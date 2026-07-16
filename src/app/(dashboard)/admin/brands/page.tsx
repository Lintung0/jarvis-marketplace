import { getBrands, adminToggleBrandForm } from "@/app/actions/brands"
import { ImageIcon, Globe, Plus, Check, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdminBrandsPage() {
  const brands = await getBrands()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product brands</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Brand
        </Link>
      </div>

      {/* Brand Count */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <p className="text-sm text-gray-500">Total Brands</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{brands.length}</p>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Brand</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Website</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">No brands yet.</td>
                </tr>
              ) : (
                brands.map((brand: any) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {brand.logo_url ? (
                            <Image src={brand.logo_url} alt={brand.name} width={40} height={40} className="object-contain" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{brand.name}</p>
                          {brand.description && <p className="text-xs text-gray-600">{brand.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{brand.slug}</td>
                    <td className="px-4 py-3">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                          <Globe className="w-3 h-3" />
                          <span className="text-xs">{brand.website.replace(/^https?:\/\//, "").replace(/\/.*/, "")}</span>
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        brand.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {brand.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {brand.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/30 hover:bg-blue-500/20 transition"
                        >
                          Edit
                        </Link>
                        <form action={adminToggleBrandForm} method="POST">
                          <input type="hidden" name="id" value={brand.id} />
                          <button className={`px-2.5 py-1 text-xs font-medium rounded-md border transition ${
                            brand.is_active
                              ? "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
                          }`}>
                            {brand.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
