import { logger } from "@/lib/logger"
import { createAdminClient } from "@/lib/supabase/server"
import { AdminVendorActions } from "./AdminVendorActions"

export default async function AdminVendorsPage() {
  const supabase = createAdminClient()

  const { data: vendors, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, location, is_verified, is_banned, created_at")
    .eq("role", "vendor")
    .order("created_at", { ascending: false })

  if (error) {
    logger.error("Failed to fetch vendors:", error)
    return <div className="text-red-500 p-6">Gagal memuat data vendor: {error.message}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendors</h1>
      <p className="text-sm text-gray-500 mb-8">{vendors?.length ?? 0} total vendors</p>

      {(!vendors || vendors.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Belum ada vendor terdaftar.</p>
          <p className="text-sm text-gray-400 mt-1">Vendor akan muncul setelah kamu approve pengajuan di menu Vendor Applications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Vendor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Verified</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                          {(v.full_name ?? v.username ?? "?").charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{v.full_name ?? v.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{v.email}</td>
                    <td className="px-4 py-3 text-gray-500">{v.location || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${v.is_verified ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30" : "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                        {v.is_verified ? "Verified" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${v.is_banned ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30"}`}>
                        {v.is_banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(v.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <AdminVendorActions
                        vendorId={v.id}
                        isVerified={v.is_verified}
                        isBanned={v.is_banned}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
