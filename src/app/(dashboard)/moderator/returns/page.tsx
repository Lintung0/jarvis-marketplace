import { createClient, createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatusBadge } from "@/components/dashboard/StatsCard"
import { formatCurrency } from "@/lib/utils"
import { ReturnActions } from "./ReturnActions"

export default async function ModeratorReturnsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["moderator", "admin"].includes(profile.role)) redirect("/products")

  const { data: requests } = await admin
    .from("return_requests")
    .select("*, orders!inner(id, total, status), user:user_id(email, full_name)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Return Requests</h1>
        <p className="text-sm text-gray-500">{requests?.length ?? 0} total requests</p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">↩️</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Return Requests</h3>
          <p className="text-gray-500">Return requests from buyers will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Buyer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Order Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{req.user?.full_name || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{req.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs font-medium">
                        {req.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {req.description || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(req.orders?.total ?? 0)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status === "pending" ? "pending" : req.status === "approved" ? "refunded" : "cancelled"} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(req.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "pending" ? (
                        <ReturnActions returnId={req.id} orderId={req.order_id} />
                      ) : (
                        <span className="text-xs text-gray-400">
                          {req.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
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
