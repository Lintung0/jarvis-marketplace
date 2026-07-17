"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Brand } from "@/types"

export async function getBrands(): Promise<Brand[]> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  return (data as Brand[]) ?? []
}

export async function getBrand(slug: string): Promise<Brand | null> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single()

  return data as Brand | null
}

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true })

  return (data as Brand[]) ?? []
}

export async function createBrand(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  let logoUrl = formData.get("logo_url") as string || null
  const logoFile = formData.get("logo_file") as File | null

  // Upload logo file if provided
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${formData.get("slug")}-${Date.now()}.${fileExt}`
    const filePath = `brand-logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, logoFile, { upsert: true })

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from("brand-logos")
        .getPublicUrl(filePath)
      logoUrl = publicUrl
    }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("brands").insert({
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    logo_url: logoUrl,
    website: (formData.get("website") as string) || null,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/brands")
}

export async function updateBrand(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    logo_url?: string
    website?: string
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
    .from("brands")
    .update(data)
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/brands")
  revalidatePath(`/admin/brands/${id}/edit`)
}

export async function adminToggleBrandForm(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const admin = createAdminClient()
  const { data: brand } = await admin
    .from("brands")
    .select("is_active")
    .eq("id", id)
    .single()

  if (!brand) throw new Error("Brand not found")

  await admin
    .from("brands")
    .update({ is_active: !brand.is_active })
    .eq("id", id)

  revalidatePath("/admin/brands")
}

export async function deleteBrand(id: string) {
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
  const { error } = await admin.from("brands").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/brands")
}
