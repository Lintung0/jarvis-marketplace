"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getPublishedCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(count)")
    .order("sort_order")
  return data ?? []
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(count)")
    .eq("slug", slug)
    .single()
  return data
}

export async function getPublishedArticles(categorySlug?: string) {
  const supabase = await createClient()
  let query = supabase
    .from("kb_articles")
    .select("*, category:kb_categories!category_id(*)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
  if (categorySlug) {
    query = query.eq("kb_categories.slug", categorySlug)
  }
  const { data } = await query
  return data ?? []
}

export async function getPublishedArticlesByCategory(categoryId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!category_id(*)")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!category_id(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  return data
}

export async function getRelatedArticles(categoryId: string, excludeId: string, limit = 5) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_articles")
    .select("id, title, slug, excerpt")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit)
  return data ?? []
}

export async function incrementViewCount(articleId: string) {
  const supabase = await createClient()
  await supabase.rpc("increment_kb_view", { article_id: articleId })
}

export async function createKBCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = formData.get("description") as string
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { error } = await supabase.from("kb_categories").insert({
    name, slug, description, sort_order,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/categories")
  redirect("/admin/kb/categories")
}

export async function updateKBCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = formData.get("description") as string
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { error } = await supabase
    .from("kb_categories")
    .update({ name, slug, description, sort_order })
    .eq("id", categoryId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/categories")
}

export async function deleteKBCategory(categoryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("kb_categories").delete().eq("id", categoryId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/categories")
}

export async function createKBArticle(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const category_id = formData.get("category_id") as string
  const is_published = formData.get("is_published") === "true"

  const { error } = await supabase.from("kb_articles").insert({
    title, slug, content, excerpt, category_id, is_published,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/articles")
  redirect("/admin/kb/articles")
}

export async function updateKBArticle(articleId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const category_id = formData.get("category_id") as string
  const is_published = formData.get("is_published") === "true"

  const { error } = await supabase
    .from("kb_articles")
    .update({
      title, slug, content, excerpt, category_id, is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/articles")
}

export async function deleteKBArticle(articleId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("kb_articles").delete().eq("id", articleId)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/kb/articles")
}

export async function getAllCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(count)")
    .order("sort_order")
  return data ?? []
}

export async function getAllArticles() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!category_id(*)")
    .order("created_at", { ascending: false })
  return data ?? []
}
