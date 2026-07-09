import { NextResponse } from "next/server"
import { SITE_URL, APP_NAME } from "@/lib/constants"

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME} - RSS Feeds</title>
    <link>${SITE_URL}</link>
    <description>Subscribe to ${APP_NAME} RSS feeds</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>Products</title>
      <link>${SITE_URL}/api/rss/products</link>
      <guid isPermaLink="true">${SITE_URL}/api/rss/products</guid>
      <description>Latest products from ${APP_NAME}</description>
    </item>
    <item>
      <title>Blog</title>
      <link>${SITE_URL}/api/rss/blog</link>
      <guid isPermaLink="true">${SITE_URL}/api/rss/blog</guid>
      <description>Latest blog posts from ${APP_NAME}</description>
    </item>
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
