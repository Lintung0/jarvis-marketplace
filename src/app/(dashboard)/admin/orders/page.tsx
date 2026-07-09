import { createClient } from "@/lib/supabase/server"
import { StatusBadge } from "@/components/dashboard/StatsCard"
import { formatCurrency } from "@/lib/utils"
import { AdminOrderActions } from "./AdminOrderActions"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, buyer: profiles(full_name, username)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">All Orders</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Order ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Buyer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-500">{order.buyer?.full_name ?? order.buyer?.username ?? "-"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-gray-500">{order.payment_method ?? "-"}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3"><AdminOrderActions orderId={order.id} currentStatus={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
