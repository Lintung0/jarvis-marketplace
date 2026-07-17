import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getActiveVendorIds } from "@/lib/queries"
import ProductGrid from "@/components/shared/ProductGrid"
import BrandLogo from "@/components/shared/BrandLogo"
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton"
import { Suspense } from "react"
import type { Product } from "@/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

const brandBios: Record<string, { founded: string; country: string; bio: string }> = {
  samsung: {
    founded: "1969",
    country: "Korea Selatan",
    bio: "Samsung Electronics adalah perusahaan teknologi multinasional asal Korea Selatan yang didirikan pada tahun 1969. Samsung merupakan salah satu produsen smartphone, televisi, semikonduktor, dan peralatan elektronik terbesar di dunia. Dengan inovasi yang terus berkembang, Samsung telah menjadi pemimpin pasar global di berbagai segmen elektronik konsumen.",
  },
  apple: {
    founded: "1976",
    country: "Amerika Serikat",
    bio: "Apple Inc. didirikan pada tahun 1976 oleh Steve Jobs, Steve Wozniak, dan Ronald Wayne. Apple dikenal sebagai pelopor desain produk teknologi premium, menghadirkan iPhone, Mac, iPad, dan ekosistem software yang terintegrasi. Apple adalah salah satu perusahaan dengan valuasi tertinggi di dunia.",
  },
  sony: {
    founded: "1946",
    country: "Jepang",
    bio: "Sony Corporation adalah konglomerat multinasional asal Jepang yang didirikan pada tahun 1946. Sony bergerak di bidang elektronik konsumen, gaming (PlayStation), musik, film, dan kamera. Sony dikenal atas inovasi seperti Walkman, Trinitron, dan PlayStation yang telah mengubah industri hiburan global.",
  },
  nike: {
    founded: "1964",
    country: "Amerika Serikat",
    bio: "Nike, Inc. didirikan pada tahun 1964 oleh Bill Bowerman dan Phil Knight dengan nama Blue Ribbon Sports. Nike adalah merek pakaian olahraga dan alas kaki terbesar di dunia. Slogan ikoniknya 'Just Do It' dan logo Swoosh menjadikan Nike salah satu brand paling dikenal secara global.",
  },
  adidas: {
    founded: "1948",
    country: "Jerman",
    bio: "PUMA SE didirikan pada tahun 1948 oleh Rudolf Dassler di Herzogenaurach, Jerman. PUMA adalah salah satu merek olahraga terkemuka di dunia yang menghadirkan produk sepatu, pakaian, dan aksesori untuk berbagai cabang olahraga dan gaya hidup.",
  },
  levis: {
    founded: "1853",
    country: "Amerika Serikat",
    bio: "Levi Strauss & Co. didirikan pada tahun 1853 oleh Levi Strauss di San Francisco, Amerika Serikat. Levi's adalah pencipta celana jeans pertama di dunia dan hingga kini menjadi salah satu merek denim paling ikonik dan dikenal secara global.",
  },
  zara: {
    founded: "1975",
    country: "Spanyol",
    bio: "Zara didirikan pada tahun 1975 oleh Amancio Ortega dan Rosalía Mera di A Coruña, Spanyol. Zara adalah merek fashion fast-fashion terbesar di dunia di bawah grup Inditex. Zara dikenal atas kemampuannya menghadirkan tren fashion terbaru dengan waktu produksi yang sangat cepat.",
  },
  "under-armour": {
    founded: "1996",
    country: "Amerika Serikat",
    bio: "Under Armour didirikan pada tahun 1996 oleh Kevin Plank di Baltimore, Amerika Serikat. Under Armour adalah merek pakaian olahraga dan alas kaki performa tinggi yang digunakan oleh para atlet profesional di seluruh dunia.",
  },
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!brand || !brand.is_active) notFound()

  const activeVendorIds = await getActiveVendorIds(supabase)

  const { data: products } = await supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url)`
    )
    .eq("brand_id", brand.id)
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])
    .order("created_at", { ascending: false })

  const bio = brandBios[slug]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Brand Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 relative flex items-center justify-center flex-shrink-0">
            <BrandLogo name={brand.name} logo_url={brand.logo_url} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
            {bio && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>📅 Didirikan {bio.founded}</span>
                <span>🌍 {bio.country}</span>
              </div>
            )}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-teal-500 hover:text-teal-600 mt-2"
              >
                🔗 {brand.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {bio && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tentang {brand.name}</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{bio.bio}</p>
          </div>
        )}
        {!bio && brand.description && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tentang {brand.name}</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{brand.description}</p>
          </div>
        )}
      </div>

      {/* Products */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Produk {brand.name} ({products?.length ?? 0})
      </h2>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductGrid products={(products ?? []) as unknown as Product[]} emptyMessage={`Belum ada produk dari ${brand.name}.`} />
      </Suspense>
    </div>
  )
}
