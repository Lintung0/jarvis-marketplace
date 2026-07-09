import { createAdminClient } from "@/lib/supabase/server"
import { BannerForm } from "@/components/admin/BannerForm"
import { BannerActions } from "./BannerActions"
import type { Banner } from "@/types"

export default async function AdminBannersPage() {
  const admin = createAdminClient()

  const { data: banners } = await admin
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">{banners?.length ?? 0} banners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Image</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Placement</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Sort Order</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners?.map((banner: Banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={banner.image_url}
                            alt={banner.title ?? ""}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {banner.title || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-500 border-orange-500/30 capitalize">
                          {banner.placement}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {banner.sort_order}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          banner.is_active
                            ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}>
                          {banner.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BannerActions banner={banner} />
                      </td>
                    </tr>
                  ))}
                  {(!banners || banners.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        No banners yet. Add your first banner.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <BannerForm />
        </div>
      </div>
    </div>
  )
}
