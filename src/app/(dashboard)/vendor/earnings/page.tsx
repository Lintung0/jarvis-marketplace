import { createClient, createAdminClient } from "@/lib/supabase/server"
import StatsCard from "@/components/dashboard/StatsCard"
import { DollarSign, TrendingUp, Wallet, Banknote } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { PayoutRequestForm } from "./PayoutRequestForm"

export default async function VendorEarningsPage() {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: orderItems } = await admin
    .from("order_items")
    .select("price, quantity, vendor_earning, order:orders!inner(status)")
    .eq("vendor_id", user.id)
    .in("orders.status", ["paid", "processing", "shipped", "delivered"])

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("amount, status, created_at")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })

  const totalRevenue = orderItems?.reduce((s, i: any) => s + Number(i.price) * i.quantity, 0) ?? 0
  const totalEarnings = orderItems?.reduce((s, i: any) => s + Number(i.vendor_earning ?? i.price * i.quantity), 0) ?? 0
  const withdrawn = withdrawals?.filter(w => w.status === "paid").reduce((s, w) => s + Number(w.amount), 0) ?? 0
  const pending = withdrawals?.filter(w => w.status === "pending").reduce((s, w) => s + Number(w.amount), 0) ?? 0
  const balance = totalEarnings - withdrawn

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings</h1>
      <p className="text-sm text-gray-500 mb-8">Track your revenue and payouts.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="w-6 h-6" />} color="indigo" />
        <StatsCard title="My Earnings" value={formatCurrency(totalEarnings)} icon={<DollarSign className="w-6 h-6" />} color="green" />
        <StatsCard title="Available Balance" value={formatCurrency(balance)} icon={<Wallet className="w-6 h-6" />} color="orange" />
        <StatsCard title="Pending Payout" value={formatCurrency(pending)} icon={<Banknote className="w-6 h-6" />} color="purple" />
      </div>

      {balance > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Request Payout</h3>
          <PayoutRequestForm maxAmount={balance} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Payout History</h3>
        {!withdrawals || withdrawals.length === 0 ? (
          <p className="text-gray-400 text-sm">No withdrawals yet.</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{formatCurrency(w.amount)}</p>
                  <p className="text-xs text-gray-400">{new Date(w.created_at).toLocaleDateString("id-ID")}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${w.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : w.status === "approved" ? "bg-teal-50 text-teal-700 border-teal-200" : w.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
