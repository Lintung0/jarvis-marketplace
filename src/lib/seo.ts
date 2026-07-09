import type { Metadata } from "next"
import { SITE_URL, APP_NAME } from "@/lib/constants"

interface GenerateMetaArgs {
  title: string
  description: string
  image?: string | null
  path?: string
  noIndex?: boolean
}

export function generateMeta({
  title,
  description,
  image,
  path = "",
  noIndex = false,
}: GenerateMetaArgs): Metadata {
  const url = `${SITE_URL}${path}`
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: APP_NAME }]

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
  }
}
