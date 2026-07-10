"use server"

import { logger } from "@/lib/logger"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
      type: "physical",
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  // Save product images
  const imageUrls: string[] = JSON.parse(formData.get("image_urls") as string || "[]")
  if (imageUrls.length > 0 && product) {
    const images = imageUrls.map((url, i) => ({
      product_id: product.id,
      url,
      is_primary: i === 0,
      sort_order: i,
    }))
    const { error: imgError } = await supabase.from("product_images").insert(images)
    if (imgError) logger.error("Failed to save product images:", imgError)
  }

  revalidatePath("/vendor/products")
  redirect("/vendor/products")
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const stock = parseInt(formData.get("stock") as string)
  const status = formData.get("status") as string
  const category_id = formData.get("category_id") as string
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
    .update({ title, slug, description, price, stock, status, category_id: category_id || null, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("vendor_id", user.id)

  if (error) throw new Error(error.message)

  // Update images if provided
  const imageUrls: string[] = JSON.parse(formData.get("image_urls") as string || "[]").filter(Boolean)
  if (imageUrls.length > 0) {
    await supabase.from("product_images").delete().eq("product_id", productId)
    const images = imageUrls.map((url, i) => ({
      product_id: productId,
      url,
      is_primary: i === 0,
      sort_order: i,
    }))
    const { error: imgError } = await supabase.from("product_images").insert(images)
    if (imgError) logger.error("Failed to update product images:", imgError)
  }

  revalidatePath("/vendor/products")
  redirect("/vendor/products")
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
