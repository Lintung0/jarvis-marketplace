import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
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
        <h1 className="text-2xl font-bold text-gray-200 mb-6">Brands</h1>
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm">Belum ada brand terdaftar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Semua Brand</h1>
        <p className="text-sm text-gray-400 mt-1">
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
            {brand.logo_url ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 mb-3 p-2">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl gradient-brand flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-white">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-500 transition-colors">
              {brand.name}
            </h3>
            {brand.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {brand.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
