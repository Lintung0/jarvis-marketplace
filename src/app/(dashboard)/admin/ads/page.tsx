import { createAdminClient } from "@/lib/supabase/server"
import { AdForm } from "@/components/admin/AdForm"
import { AdActions } from "./AdActions"
import type { AdSpace } from "@/types"

export default async function AdminAdsPage() {
  const admin = createAdminClient()

  const { data: ads } = await admin
    .from("ad_spaces")
    .select("*")
    .order("sort_order", { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Spaces</h1>
          <p className="text-sm text-gray-500">{ads?.length ?? 0} ads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Placement</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Sort Order</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ads?.map((ad: AdSpace) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {ad.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-500 border-orange-500/30 capitalize">
                          {ad.placement.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {ad.sort_order}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          ad.is_active
                            ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}>
                          {ad.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdActions ad={ad} />
                      </td>
                    </tr>
                  ))}
                  {(!ads || ads.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        No ad spaces yet. Add your first ad.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <AdForm />
        </div>
      </div>
    </div>
  )
}
