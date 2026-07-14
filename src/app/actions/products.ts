"use server"

import { logger } from "@/lib/logger"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function upsertImages(supabase: any, productId: string, imageUrls: string[]) {
  if (imageUrls.length === 0) return
  const { error: delErr } = await supabase.from("product_images").delete().eq("product_id", productId)
  if (delErr) logger.error("Failed to delete old images:", delErr)
  const images = imageUrls.map((url: string, i: number) => ({
    product_id: productId,
    url,
    is_primary: i === 0,
  }))
  const { error: insErr } = await supabase.from("product_images").insert(images)
  if (insErr) throw new Error("Failed to save images: " + insErr.message)
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const stock = parseInt(formData.get("stock") as string)
  const status = formData.get("status") as string
  const category_id = formData.get("category_id") as string
  const location = formData.get("location") as string
  const specsRaw = formData.get("specs") as string
  const specs = specsRaw ? JSON.parse(specsRaw) : {}
  const imageUrls: string[] = JSON.parse(formData.get("image_urls") as string || "[]")
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      vendor_id: user.id,
      title,
      slug,
      description,
      price,
      stock,
      status,
      category_id: category_id || null,
      location: location || null,
      specs,
      type: "physical",
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  if (product) await upsertImages(supabase, product.id, imageUrls)

  revalidatePath("/vendor/products")
  return "/vendor/products"
}

export async function updateProduct(productId: string, formData: FormData, imageUrls?: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const stock = parseInt(formData.get("stock") as string)
  const status = formData.get("status") as string
  const category_id = formData.get("category_id") as string
  const location = formData.get("location") as string
  const specsRaw = formData.get("specs") as string
  const specs = specsRaw ? JSON.parse(specsRaw) : {}
  const finalUrls = (imageUrls || JSON.parse(formData.get("image_urls") as string || "[]")).filter(Boolean)
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", productId)
    .maybeSingle()
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const { error } = await supabase
    .from("products")
    .update({ title, slug, description, price, stock, status, category_id: category_id || null, location: location || null, specs, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("vendor_id", user.id)

  if (error) throw new Error(error.message)

  await upsertImages(supabase, productId, finalUrls)

  revalidatePath("/vendor/products")
  return "/vendor/products"
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("vendor_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/vendor/products")
}

export async function adminDeleteProduct(productId: string) {
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
    .from("products")
    .delete()
    .eq("id", productId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
}

export async function toggleFeaturedProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { data: product } = await supabase
    .from("products")
    .select("is_featured")
    .eq("id", productId)
    .single()

  if (!product) throw new Error("Product not found")

  const admin = createAdminClient()
  const { error } = await admin
    .from("products")
    .update({ is_featured: !product.is_featured, updated_at: new Date().toISOString() })
    .eq("id", productId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
}

export async function adminUpdateProductStatus(productId: string, status: string) {
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
    .from("products")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", productId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
}
