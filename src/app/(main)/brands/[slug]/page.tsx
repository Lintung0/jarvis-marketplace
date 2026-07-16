import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getActiveVendorIds } from "@/lib/queries"
import ProductGrid from "@/components/shared/ProductGrid"
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton"
import { Suspense } from "react"
import type { Product } from "@/types"

interface PageProps {
  params: Promise<{ slug: string }>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Brand Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
        <div className="flex items-center gap-6">
          {brand.logo_url ? (
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 p-3 flex-shrink-0">
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-white">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
            {brand.description && (
              <p className="text-gray-500 mt-2 max-w-2xl">{brand.description}</p>
            )}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-teal-500 hover:text-teal-600 mt-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {brand.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-200 mb-4">
        Produk {brand.name} ({products?.length ?? 0})
      </h2>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductGrid products={(products ?? []) as unknown as Product[]} />
      </Suspense>
    </div>
  )
}
