import { logger } from "@/lib/logger"
import { createAdminClient } from "@/lib/supabase/server"
import { AdminUserActions } from "./AdminUserActions"

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  const { data: users, error } = await admin
    .from("profiles")
    .select("id, full_name, username, email, role, is_banned, is_verified, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    logger.error("Failed to fetch users:", error)
    return <div className="text-red-500 p-6">Gagal memuat data user: {error.message}</div>
  }

  const grouped = (users ?? []).reduce<Record<string, typeof users>>((acc, u) => {
    const role = (u.role ?? "member") as string
    if (!acc[role]) acc[role] = []
    acc[role].push(u)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
      <p className="text-sm text-gray-500 mb-8">{users?.length ?? 0} total users</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { role: "all", label: "All Users", count: users?.length ?? 0, color: "bg-gray-100 text-gray-700" },
          { role: "admin", label: "Admins", count: grouped.admin?.length ?? 0, color: "bg-red-50 text-red-600" },
          { role: "moderator", label: "Moderators", count: grouped.moderator?.length ?? 0, color: "bg-purple-50 text-purple-600" },
          { role: "vendor", label: "Vendors", count: grouped.vendor?.length ?? 0, color: "bg-teal-50 text-teal-600" },
          { role: "member", label: "Members", count: grouped.member?.length ?? 0, color: "bg-blue-50 text-blue-600" },
        ].map((item) => (
          <div key={item.role} className={`rounded-xl p-4 border ${item.color.split(" ")[0]} border-gray-200`}>
            <p className={`text-2xl font-bold ${item.color.split(" ")[1]}`}>{item.count}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Verified</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Joined</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!users || users.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          u.role === "admin" ? "bg-red-500" :
                          u.role === "moderator" ? "bg-purple-500" :
                          u.role === "vendor" ? "bg-teal-500" :
                          "bg-blue-500"
                        }`}>
                          {(u.full_name ?? u.username ?? "?").charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{u.full_name ?? u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        u.role === "admin" ? "bg-red-50 text-red-600 border-red-200" :
                        u.role === "moderator" ? "bg-purple-50 text-purple-600 border-purple-200" :
                        u.role === "vendor" ? "bg-teal-50 text-teal-600 border-teal-200" :
                        "bg-blue-50 text-blue-600 border-blue-200"
                      }`}>
                        {u.role ?? "member"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        u.is_banned
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-green-500/10 text-green-600 border-green-500/30"
                      }`}>
                        {u.is_banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        u.is_verified
                          ? "bg-green-500/10 text-green-600 border-green-500/30"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                      }`}>
                        {u.is_verified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <AdminUserActions user={u} />
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
