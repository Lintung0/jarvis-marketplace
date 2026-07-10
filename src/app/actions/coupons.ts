"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCoupon(data: {
  code: string
  type: "percentage" | "fixed"
  value: number
  min_order: number
  max_uses: number | null
  start_at: string | null
  expires_at: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const admin = createAdminClient()
  const { error } = await admin.from("coupons").insert({
    code: data.code.toUpperCase(),
    type: data.type,
    value: data.value,
    min_order: data.min_order,
    max_uses: data.max_uses,
    start_at: data.start_at,
    expires_at: data.expires_at,
    is_active: true,
    used_count: 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/coupons")
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const admin = createAdminClient()
  const { error } = await admin
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/coupons")
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const admin = createAdminClient()
  const { error } = await admin.from("coupons").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/coupons")
}
