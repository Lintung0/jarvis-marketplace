import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Banner } from "@/types"

interface BannerAdProps {
  placement: "top" | "middle" | "bottom" | "sidebar"
}

export async function BannerAd({ placement }: BannerAdProps) {
  const admin = createAdminClient()

  const { data: banners } = await admin
    .from("banners")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)

  const banner = banners?.[0] as Banner | undefined

  if (!banner) return null

  const content = (
    <div className="relative aspect-[21/9] sm:aspect-[3/1]">
      <img
        src={banner.image_url}
        alt={banner.title ?? ""}
        className="w-full h-full object-cover"
      />
      {banner.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-sm sm:text-base">
            {banner.title}
          </h3>
        </div>
      )}
    </div>
  )

  if (banner.link) {
    return (
      <Link
        href={banner.link}
        className="block w-full rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="block w-full rounded-2xl overflow-hidden bg-white border border-gray-200">
      {content}
    </div>
  )
}
