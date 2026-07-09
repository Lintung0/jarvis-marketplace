"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string

  const { error } = await supabase.from("categories").insert({
    name, slug, description, icon, is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, description, icon })
    .eq("id", categoryId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
}

export async function deleteCategory(categoryId: string) {
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
    .from("categories")
    .delete()
    .eq("id", categoryId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
}

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
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
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", categoryId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/categories")
}
