"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getPlans() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })
  return data ?? []
}

export async function getAllPlansAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .order("price", { ascending: true })
  return data ?? []
}

export async function getVendorSubscription(vendorId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("vendor_subscriptions")
    .select("*, plan:membership_plans(*)")
    .eq("vendor_id", vendorId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

export async function subscribe(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: plan } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", planId)
    .eq("is_active", true)
    .single()

  if (!plan) throw new Error("Plan not found")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "vendor") throw new Error("Only vendors can subscribe")

  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + plan.duration_days)

  if (plan.price === 0) {
    const { error } = await supabase.from("vendor_subscriptions").insert({
      vendor_id: user.id,
      plan_id: planId,
      status: "active",
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })

    if (error) throw new Error(error.message)
    revalidatePath("/membership")
    revalidatePath("/vendor")
    redirect("/vendor?subscribed=free")
    return
  }

  const { data: subscription, error: subError } = await supabase
    .from("vendor_subscriptions")
    .insert({
      vendor_id: user.id,
      plan_id: planId,
      status: "pending",
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })
    .select()
    .single()

  if (subError) throw new Error(subError.message)

  const xenditRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/membership/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription_id: subscription.id, plan, user }),
  })

  if (!xenditRes.ok) {
    const err = await xenditRes.json()
    throw new Error(err.error || "Failed to create payment")
  }

  const { invoice_url } = await xenditRes.json()
  if (invoice_url) redirect(invoice_url)
}

export async function checkAndExpireSubscriptions() {
  const admin = createAdminClient()
  const now = new Date().toISOString()

  const { data: expired } = await admin
    .from("vendor_subscriptions")
    .select("id")
    .eq("status", "active")
    .lt("end_date", now)

  if (expired && expired.length > 0) {
    const ids = expired.map(s => s.id)
    await admin
      .from("vendor_subscriptions")
      .update({ status: "expired", updated_at: now })
      .in("id", ids)
  }
}

export async function adminTogglePlan(planId: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("membership_plans")
    .update({ is_active: isActive })
    .eq("id", planId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/membership")
}

export async function adminTogglePlanForm(formData: FormData) {
  const planId = formData.get("planId") as string
  const isActive = formData.get("isActive") === "true"
  return adminTogglePlan(planId, isActive)
}

export async function adminCreatePlan(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const features = formData.get("features") as string
  const featuresArray = features ? features.split("\n").map(f => f.trim()).filter(Boolean) : []

  const { error } = await supabase.from("membership_plans").insert({
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    duration_days: parseInt(formData.get("duration_days") as string),
    product_limit: parseInt(formData.get("product_limit") as string),
    featured_products: parseInt(formData.get("featured_products") as string),
    commission_rate: parseFloat(formData.get("commission_rate") as string),
    features: featuresArray,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/membership")
}

export async function adminUpdatePlan(planId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const features = formData.get("features") as string
  const featuresArray = features ? features.split("\n").map(f => f.trim()).filter(Boolean) : []

  const { error } = await supabase
    .from("membership_plans")
    .update({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration_days: parseInt(formData.get("duration_days") as string),
      product_limit: parseInt(formData.get("product_limit") as string),
      featured_products: parseInt(formData.get("featured_products") as string),
      commission_rate: parseFloat(formData.get("commission_rate") as string),
      features: featuresArray,
    })
    .eq("id", planId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/membership")
}

export async function adminDeletePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase.from("membership_plans").delete().eq("id", planId)
  if (error) throw new Error(error.message)
  // admin membership page removed
}

export async function getAllSubscriptionsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { data } = await supabase
    .from("vendor_subscriptions")
    .select("*, plan:membership_plans(*), vendor:profiles(username, full_name, email)")
    .order("created_at", { ascending: false })

  return data ?? []
}

export async function getProductCountForVendor(vendorId: string) {
  const admin = createAdminClient()
  const { count } = await admin
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
  return count ?? 0
}
