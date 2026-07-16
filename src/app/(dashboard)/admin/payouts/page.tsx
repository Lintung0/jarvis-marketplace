import { createAdminClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { AdminPayoutActions } from "./AdminPayoutActions"

export default async function AdminPayoutsPage() {
  const supabase = createAdminClient()

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*, vendor:profiles!vendor_id(full_name, username, email)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Payout Requests</h1>
      <p className="text-sm text-gray-500 mb-8">Manage vendor withdrawal requests.</p>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Vendor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Account</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!withdrawals || withdrawals.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No payout requests yet.
                  </td>
                </tr>
              ) : (
                withdrawals?.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                          {(w.vendor?.full_name ?? w.vendor?.username ?? "?").charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{w.vendor?.full_name ?? w.vendor?.username}</p>
                          <p className="text-xs text-gray-400">{w.vendor?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {w.method?.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                      {typeof w.account_details === "object"
                        ? [w.account_details?.bank, w.account_details?.name, w.account_details?.number].filter(Boolean).join(" - ") || w.account_details?.details || "-"
                        : w.account_details ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <div>{new Date(w.created_at).toLocaleDateString("id-ID")}</div>
                      {w.paid_at && <div className="text-green-600">Paid: {new Date(w.paid_at).toLocaleDateString("id-ID")}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <AdminPayoutActions payout={w} />
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    approved: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    rejected: "bg-red-500/10 text-red-500 border-red-500/30",
    paid: "bg-green-500/10 text-green-600 border-green-500/30",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
      {status}
    </span>
  )
}
