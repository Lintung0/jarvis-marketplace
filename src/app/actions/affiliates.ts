"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getOrCreateAffiliateProfile(userId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("affiliate_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (existing) return existing

  const code = await generateCode()
  const { data, error } = await supabase
    .from("affiliate_profiles")
    .insert({ id: userId, referral_code: code })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

async function generateCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function trackClick(
  referralCode: string,
  req: Request,
  productId?: string
) {
  const supabase = await createClient()

  const { data: affiliate } = await supabase
    .from("affiliate_profiles")
    .select("id")
    .eq("referral_code", referralCode)
    .single()

  if (!affiliate) return { success: false, error: "Invalid referral code" }

  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null
  const ua = req.headers.get("user-agent") ?? null
  const referrer = req.headers.get("referer") ?? null

  const { error } = await supabase.from("affiliate_clicks").insert({
    affiliate_id: affiliate.id,
    ip_address: ip ? ip.split(",")[0].trim() : null,
    user_agent: ua,
    referrer_url: referrer,
    product_id: productId ?? null,
  })

  if (error) throw new Error(error.message)

  await supabase.rpc("increment_affiliate_clicks", { affiliate_id: affiliate.id })

  return { success: true }
}

export async function trackConversion(orderId: string, affiliateId: string) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select("total")
    .eq("id", orderId)
    .single()

  if (!order) throw new Error("Order not found")

  const { data: affiliate } = await supabase
    .from("affiliate_profiles")
    .select("commission_rate")
    .eq("id", affiliateId)
    .single()

  if (!affiliate) throw new Error("Affiliate not found")

  const commissionAmount = (order.total * affiliate.commission_rate) / 100

  const { error } = await supabase.from("affiliate_conversions").insert({
    affiliate_id: affiliateId,
    order_id: orderId,
    commission_amount: commissionAmount,
    status: "pending",
  })

  if (error) throw new Error(error.message)

  await supabase.rpc("increment_affiliate_conversions_and_earnings", {
    affiliate_id: affiliateId,
    amount: commissionAmount,
  })

  revalidatePath("/affiliate")
}

export async function setReferredBy(referralCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: referrer } = await supabase
    .from("affiliate_profiles")
    .select("id")
    .eq("referral_code", referralCode)
    .single()

  if (!referrer) return { success: false, error: "Invalid referral code" }

  const { error } = await supabase
    .from("affiliate_profiles")
    .update({ referred_by: referrer.id })
    .eq("id", user.id)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function getAffiliateStats(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("affiliate_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!profile) return null

  const { count: clicks } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", userId)

  const { data: conversions } = await supabase
    .from("affiliate_conversions")
    .select("commission_amount, status")
    .eq("affiliate_id", userId)

  const totalConversions = conversions?.length ?? 0
  const pendingEarnings = conversions?.filter(c => c.status === "pending").reduce((s, c) => s + c.commission_amount, 0) ?? 0
  const approvedEarnings = conversions?.filter(c => c.status === "approved" || c.status === "paid").reduce((s, c) => s + c.commission_amount, 0) ?? 0

  return {
    ...profile,
    total_clicks: clicks ?? 0,
    total_conversions: totalConversions,
    total_earnings: profile.total_earnings,
    pending_earnings: pendingEarnings,
    approved_earnings: approvedEarnings,
  }
}

export async function getAffiliateTransactions(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("affiliate_conversions")
    .select("*, order: orders(id, total, created_at, buyer_id)")
    .eq("affiliate_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  return data ?? []
}

export async function getAffiliateClicks(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("affiliate_clicks")
    .select("*, product: products(id, title, slug)")
    .eq("affiliate_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  return data ?? []
}

export async function getAllAffiliates() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { data } = await supabase
    .from("affiliate_profiles")
    .select("*, profile: profiles(id, full_name, username, email, avatar_url)")
    .order("created_at", { ascending: false })

  return data ?? []
}

export async function getAffiliateConversions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { data } = await supabase
    .from("affiliate_conversions")
    .select("*, affiliate: affiliate_profiles(id, referral_code, profile: profiles(id, full_name, username)), order: orders(id, total, created_at)")
    .order("created_at", { ascending: false })
    .limit(100)

  return data ?? []
}

export async function updateConversionStatus(conversionId: string, status: "approved" | "paid") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const updates: any = { status }
  if (status === "paid") updates.paid_at = new Date().toISOString()

  const { error } = await supabase
    .from("affiliate_conversions")
    .update(updates)
    .eq("id", conversionId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/affiliates")
}
