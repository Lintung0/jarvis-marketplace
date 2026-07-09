import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getActiveVendorIds } from "@/lib/queries"
import { SITE_URL, APP_NAME } from "@/lib/constants"

export async function GET() {
  const supabase = await createClient()
  const activeVendorIds = await getActiveVendorIds(supabase)

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, description, price, created_at")
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])
    .order("created_at", { ascending: false })
    .limit(50)

  const items = (products || []).map((p) => {
    const link = `${SITE_URL}/products/${p.slug}`
    const description = p.description
      ? `<![CDATA[${p.description.slice(0, 500)}]]>`
      : ""
    const pubDate = new Date(p.created_at).toUTCString()
    return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <price>${p.price}</price>
    </item>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME} - Products</title>
    <link>${SITE_URL}/products</link>
    <description>Latest products from ${APP_NAME}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/api/rss/products" rel="self" type="application/rss+xml"/>
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
