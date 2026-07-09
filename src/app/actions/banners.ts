"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Banner } from "@/types"

export async function getBanners(placement?: string): Promise<Banner[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (placement) {
    query = query.eq("placement", placement)
  }

  const { data } = await query
  return (data as Banner[]) ?? []
}

export async function createBanner(data: {
  title: string
  image_url: string
  link?: string
  placement: string
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
  const { error } = await admin.from("banners").insert({
    title: data.title,
    image_url: data.image_url,
    link: data.link || null,
    placement: data.placement,
    sort_order: data.sort_order,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/banners")
}

export async function updateBanner(
  id: string,
  data: {
    title?: string
    image_url?: string
    link?: string
    placement?: string
    sort_order?: number
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
    .from("banners")
    .update(data)
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/banners")
}

export async function deleteBanner(id: string) {
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
  const { error } = await admin.from("banners").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/banners")
}

export async function toggleBanner(id: string) {
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
  const { data: banner } = await admin
    .from("banners")
    .select("is_active")
    .eq("id", id)
    .single()

  if (!banner) throw new Error("Banner not found")

  const { error } = await admin
    .from("banners")
    .update({ is_active: !banner.is_active })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/banners")
}
