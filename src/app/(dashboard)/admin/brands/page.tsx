import { createAdminClient } from "@/lib/supabase/server"
import { BrandForm } from "@/components/admin/BrandForm"
import { BrandActions } from "./BrandActions"
import type { Brand } from "@/types"

export default async function AdminBrandsPage() {
  const admin = createAdminClient()

  const { data: brands } = await admin
    .from("brands")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500">{brands?.length ?? 0} brands</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Logo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Slug</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {brands?.map((brand: Brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {brand.logo_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={brand.logo_url}
                              alt={brand.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {brand.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {brand.slug}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          brand.is_active
                            ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}>
                          {brand.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BrandActions brand={brand} />
                      </td>
                    </tr>
                  ))}
                  {(!brands || brands.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        No brands yet. Add your first brand.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <BrandForm />
        </div>
      </div>
    </div>
  )
}
