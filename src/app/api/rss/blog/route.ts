import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL, APP_NAME } from "@/lib/constants"

export async function GET() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50)

  const items = (posts || []).map((p) => {
    const link = `${SITE_URL}/blog/${p.slug}`
    const description = p.excerpt
      ? `<![CDATA[${p.excerpt.slice(0, 500)}]]>`
      : ""
    const pubDate = new Date(p.created_at).toUTCString()
    const enclosure = p.cover_image
      ? `\n    <enclosure url="${p.cover_image}" type="image/jpeg"/>`
      : ""
    return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>${enclosure}
    </item>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest blog posts from ${APP_NAME}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/api/rss/blog" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
