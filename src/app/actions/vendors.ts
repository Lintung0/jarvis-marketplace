import { logger } from "@/lib/logger"
"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleVendorStatus(vendorId: string, field: "is_verified" | "is_banned", value: boolean) {
  logger.info("[toggleVendorStatus] start", { vendorId, field, value })

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    logger.error("[toggleVendorStatus] auth error", authError)
    throw new Error("Unauthorized")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError) {
    logger.error("[toggleVendorStatus] profile fetch error", profileError)
    throw new Error("Failed to verify admin role: " + profileError.message)
  }
  if (!profile) {
    logger.error("[toggleVendorStatus] profile not found for user", user.id)
    throw new Error("Admin profile not found")
  }
  if (profile?.role !== "admin") {
    logger.error("[toggleVendorStatus] not admin, role:", profile.role)
    throw new Error("Unauthorized: admin only")
  }

  const admin = createAdminClient()
  const { data: updateData, error: updateError } = await admin
    .from("profiles")
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq("id", vendorId)
    .select()

  if (updateError) {
    logger.error("[toggleVendorStatus] update error", updateError)
    throw new Error(`DB Update failed: ${updateError.message}`)
  }

  logger.info("[toggleVendorStatus] success", updateData)
  revalidatePath("/admin/vendors")
  revalidatePath("/admin/users")
}

export async function banUser(userId: string) {
  logger.info("[banUser] start", { userId })
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    logger.error("[banUser] auth error", authErr)
    throw new Error("Unauthorized")
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profErr) {
    logger.error("[banUser] profile error", profErr)
    throw new Error("Failed to verify role")
  }
  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    logger.error("[banUser] insufficient role", profile?.role)
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("profiles")
    .update({ is_banned: true, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) {
    logger.error("[banUser] update error", error)
    throw new Error(error.message)
  }

  logger.info("[banUser] success")
  revalidatePath("/moderator/reports")
  revalidatePath("/admin/vendors")
  revalidatePath("/admin/users")
}
