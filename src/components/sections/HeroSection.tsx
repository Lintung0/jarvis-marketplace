"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import type { Banner } from "@/types"

const defaultSlides = [
  {
    tag: "hero.new_collection_tag",
    title: "hero.summer_fashion",
    subtitle: "hero.up_to_60_off",
    cta: "hero.shop_now",
    ctaLink: "/categories/clothing",
    bg: "from-teal-50 to-amber-100",
    accent: "#00a99d",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=500&fit=crop&auto=format",
  },
  {
    tag: "hero.best_sellers_tag",
    title: "hero.discover_handmade",
    subtitle: "hero.support_sellers",
    cta: "hero.explore_now",
    ctaLink: "/products",
    bg: "from-slate-50 to-blue-50",
    accent: "#3b82f6",
    image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=700&h=500&fit=crop&auto=format",
  },
  {
    tag: "hero.weekend_deals_tag",
    title: "hero.fresh_styles",
    subtitle: "hero.thousands_sellers",
    cta: "hero.browse_deals",
    ctaLink: "/products",
    bg: "from-green-50 to-teal-50",
    accent: "#10b981",
    image: "https://images.unsplash.com/photo-1758274251589-fb70a3654a1b?w=700&h=500&fit=crop&auto=format",
  },
]

interface SlideData {
  tag: string
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  bg: string
  accent: string
  image: string
}

function bannerToSlide(banner: Banner, index: number): SlideData {
  const colors = [
    { bg: "from-teal-50 to-amber-100", accent: "#00a99d" },
    { bg: "from-slate-50 to-blue-50", accent: "#3b82f6" },
    { bg: "from-green-50 to-teal-50", accent: "#10b981" },
    { bg: "from-purple-50 to-pink-50", accent: "#8b5cf6" },
    { bg: "from-cyan-50 to-sky-50", accent: "#06b6d4" },
  ]
  const color = colors[index % colors.length]

  return {
    tag: banner.title ?? "",
    title: banner.title ?? "",
    subtitle: "",
    cta: "Shop Now",
    ctaLink: banner.link ?? "/products",
    bg: color.bg,
    accent: color.accent,
    image: banner.image_url,
  }
}

export default function HeroSection() {
  const [active, setActive] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    fetch("/api/banners?placement=hero")
      .then((r) => r.json())
      .then(setBanners)
      .catch(() => setBanners([]))
  }, [])

  const slides: SlideData[] = banners.length > 0
    ? banners.map(bannerToSlide)
    : defaultSlides

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[active]

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        <div className={`flex-1 rounded-2xl bg-gradient-to-br ${slide.bg} overflow-hidden relative`} style={{ minHeight: 340 }}>
          <div className="flex h-full items-center justify-between p-8 md:p-12">
            <div className="flex-1 z-10">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: slide.accent + "20", color: slide.accent }}
              >
                {slide.tag}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 whitespace-pre-line text-[#1a1a2e]">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-gray-500 mb-6 text-sm md:text-base">{slide.subtitle}</p>
              )}
              <Link
                href={slide.ctaLink}
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)` }}
              >
                {slide.cta} →
              </Link>
            </div>
            <div className="hidden sm:block w-72 md:w-80 h-64 md:h-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ml-4">
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === active ? 24 : 8,
                  background: i === active ? slide.accent : "#ccc",
                }}
              />
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 w-52">
          <Link
            href="/categories/electronics"
            className="flex-1 rounded-2xl p-5 hover:scale-[1.02] transition-transform flex flex-col justify-end"
            style={{ background: "#1a1a2e", minHeight: 152 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-white opacity-60">Limited Time</p>
            <h3 className="text-lg font-bold leading-tight mb-1 text-white">{t("hero.flash_sale")}</h3>
            <p className="text-xs text-white opacity-80">{t("hero.flash_sale_desc")}</p>
            <span className="mt-3 text-xs font-semibold text-white">Shop →</span>
          </Link>
          <Link
            href="/products"
            className="flex-1 rounded-2xl p-5 hover:scale-[1.02] transition-transform flex flex-col justify-end"
            style={{ background: "#fff3e0", minHeight: 152 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-teal-400 opacity-80">This Week</p>
            <h3 className="text-lg font-bold leading-tight mb-1 text-teal-700">{t("hero.new_arrivals")}</h3>
            <p className="text-xs text-teal-600 opacity-80">{t("hero.new_arrivals_desc")}</p>
            <span className="mt-3 text-xs font-semibold text-teal-500">Shop →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
