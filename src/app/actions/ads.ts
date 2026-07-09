"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AdSpace } from "@/types"

export async function getAds(placement?: string): Promise<AdSpace[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from("ad_spaces")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (placement) {
    query = query.eq("placement", placement)
  }

  const { data } = await query
  return (data as AdSpace[]) ?? []
}

export async function createAd(data: {
  name: string
  placement: string
  code: string
  sort_order: number
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
  const { error } = await admin.from("ad_spaces").insert({
    name: data.name,
    placement: data.placement,
    code: data.code,
    sort_order: data.sort_order,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/ads")
}

export async function updateAd(
  id: string,
  data: {
    name?: string
    placement?: string
    code?: string
    sort_order?: number
    is_active?: boolean
  }
) {
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
    .from("ad_spaces")
    .update(data)
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/ads")
}

export async function deleteAd(id: string) {
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
  const { error } = await admin.from("ad_spaces").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/ads")
}

export async function toggleAd(id: string) {
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
  const { data: ad } = await admin
    .from("ad_spaces")
    .select("is_active")
    .eq("id", id)
    .single()

  if (!ad) throw new Error("Ad not found")

  const { error } = await admin
    .from("ad_spaces")
    .update({ is_active: !ad.is_active })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/ads")
}
