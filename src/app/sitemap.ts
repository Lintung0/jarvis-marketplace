import { createClient } from "@/lib/supabase/server"
import { getActiveVendorIds } from "@/lib/queries"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const activeVendorIds = await getActiveVendorIds(supabase)

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])

  const { data: categories } = await supabase
    .from("categories")
    .select("slug")

  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://modesy.com"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/vendors`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/help-center`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ]

  const productPages = (products ?? []).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryPages = (categories ?? []).map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const blogPages = (blogPosts ?? []).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages]
}
