import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
import BrandLogo from "@/components/shared/BrandLogo"
import type { Brand } from "@/types"

export default async function BrandsPage() {
  const supabase = createAdminClient()

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (!brands || brands.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Brands</h1>
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm">Belum ada brand terdaftar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Semua Brand</h1>
        <p className="text-sm text-gray-600 mt-1">
          {brands.length} brand tersedia
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand: Brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-teal-200 transition-all group"
          >
            {brand.logo_url || true ? (
              <div className="w-20 h-20 relative flex items-center justify-center mb-3">
                <BrandLogo name={brand.name} logo_url={brand.logo_url} slug={brand.slug} />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl gradient-brand flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-white">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-500 transition-colors text-sm">
              {brand.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
