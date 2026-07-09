"use server"

import { logger } from "@/lib/logger"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function applyAsVendor(storeName: string, description: string, reason: string) {
  logger.info("[applyAsVendor] start", { storeName })
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    logger.error("[applyAsVendor] auth error", authErr)
    throw new Error("Unauthorized")
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profErr || !profile) {
    logger.error("[applyAsVendor] profile fetch error", profErr)
    throw new Error("Profile not found")
  }
  if (profile.role !== "member") throw new Error("Only members can apply as vendor")

  // Cek apakah sudah pernah apply & masih pending
  const { data: existing, error: existErr } = await supabase
    .from("vendor_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)

  if (existErr) logger.error("[applyAsVendor] existing check error", existErr)

  if (existing && existing.length > 0 && existing[0].status === "pending") {
    throw new Error("You already have a pending application")
  }

  const admin = createAdminClient()
  const { error } = await admin.from("vendor_applications").insert({
    user_id: user.id,
    store_name: storeName,
    description,
    reason,
    status: "pending",
  })

  if (error) {
    logger.error("[applyAsVendor] insert error", error)
    throw new Error(error.message)
  }
  logger.info("[applyAsVendor] success for", user.id)
  revalidatePath("/profile")
}

export async function getUserApplication(userId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    logger.error("[getUserApplication] auth error", authErr)
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("vendor_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    logger.error("[getUserApplication] query error", error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    logger.error("[checkAdmin] auth error", authError)
    throw new Error("Unauthorized")
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profErr) {
    logger.error("[checkAdmin] profile query error", profErr)
    throw new Error("Failed to verify admin role")
  }
  if (!profile) {
    logger.error("[checkAdmin] profile not found for", user.id)
    throw new Error("Profile not found")
  }
  if (profile.role !== "admin") {
    logger.error("[checkAdmin] user is not admin, role:", profile.role)
    throw new Error("Unauthorized: Admin only")
  }
  return user
}

export async function getPendingApplications() {
  await checkAdmin()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("vendor_applications")
    .select("*, user:user_id(id, full_name, email, avatar_url)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    logger.error("[getPendingApplications] query error", error)
    return []
  }
  return data ?? []
}

export async function getAllApplications() {
  await checkAdmin()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("vendor_applications")
    .select("*, user:user_id(id, full_name, email, avatar_url)")
    .order("created_at", { ascending: false })

  if (error) {
    logger.error("[getAllApplications] query error", error)
    return []
  }
  return data ?? []
}

export async function approveApplication(applicationId: string) {
  logger.info("[approveApplication] start", { applicationId })
  const user = await checkAdmin()
  const admin = createAdminClient()

  // Get application
  const { data: app, error: appError } = await admin
    .from("vendor_applications")
    .select("user_id, store_name")
    .eq("id", applicationId)
    .single()

  if (appError || !app) {
    logger.error("[approveApplication] app not found", { appError, app })
    throw new Error(`Application not found: ${appError?.message || "no data"}`)
  }
  logger.info("[approveApplication] found app", app)

  // Update application status
  const { error: statusError } = await admin
    .from("vendor_applications")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId)

  if (statusError) {
    logger.error("[approveApplication] status update error", statusError)
    throw new Error(`Failed to update application: ${statusError.message}`)
  }

  // Update user role to vendor
  const { error: roleError } = await admin
    .from("profiles")
    .update({ role: "vendor" })
    .eq("id", app.user_id)

  if (roleError) {
    logger.error("[approveApplication] role update error", roleError)
    throw new Error(`Failed to update role: ${roleError.message}`)
  }

  logger.info("[approveApplication] success, promoted", app.user_id)
  revalidatePath("/admin/vendor-applications")
  revalidatePath("/admin/vendors")
  revalidatePath("/profile")
}

export async function rejectApplication(applicationId: string, adminNote: string) {
  logger.info("[rejectApplication] start", { applicationId })
  const user = await checkAdmin()
  const admin = createAdminClient()

  const { error } = await admin
    .from("vendor_applications")
    .update({
      status: "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote,
    })
    .eq("id", applicationId)

  if (error) {
    logger.error("[rejectApplication] update error", error)
    throw new Error(`Failed to reject application: ${error.message}`)
  }

  logger.info("[rejectApplication] success")
  revalidatePath("/admin/vendor-applications")
  revalidatePath("/profile")
}
