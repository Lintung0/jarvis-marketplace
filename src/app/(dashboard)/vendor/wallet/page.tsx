import { createClient, createAdminClient } from "@/lib/supabase/server"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Banknote, CreditCard, Plus } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"
import { formatCurrency } from "@/lib/utils"
import { PayoutRequestForm } from "../earnings/PayoutRequestForm"
import Link from "next/link"
import VendorTransactionList from "@/components/vendor/VendorTransactionList"

export default async function VendorWalletPage() {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: orderItems } = await admin
    .from("order_items")
    .select("price, quantity, vendor_earning, created_at, order:orders!inner(status, id)")
    .eq("vendor_id", user.id)
    .in("orders.status", ["paid", "processing", "shipped", "delivered"])
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("amount, status, created_at, method")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const totalRevenue = orderItems?.reduce((s: number, i: any) => s + Number(i.price) * i.quantity, 0) ?? 0
  const totalEarnings = orderItems?.reduce((s: number, i: any) => s + Number(i.vendor_earning ?? i.price * i.quantity), 0) ?? 0
  const withdrawn = withdrawals?.filter(w => w.status === "paid").reduce((s: number, w) => s + Number(w.amount), 0) ?? 0
  const pending = withdrawals?.filter(w => w.status === "pending" || w.status === "approved").reduce((s: number, w) => s + Number(w.amount), 0) ?? 0
  const balance = totalEarnings - withdrawn

  const transactions: { type: string; amount: number; desc: string; date: string; status?: string }[] = []

  orderItems?.forEach((i: any) => {
    transactions.push({
      type: "earning",
      amount: Number(i.vendor_earning ?? i.price * i.quantity),
      desc: `Penjualan #${i.order?.id?.slice(0, 8) ?? ""}`,
      date: i.created_at,
    })
  })

  withdrawals?.forEach((w: any) => {
    transactions.push({
      type: "withdrawal",
      amount: Number(w.amount),
      desc: `Penarikan ${w.method?.replace(/_/g, " ") ?? ""}`,
      date: w.created_at,
      status: w.status,
    })
  })

  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dompet Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola saldo dan riwayat transaksi</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 md:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Saldo Tersedia</span>
          </div>
          <div className="text-4xl font-bold mb-4">{formatCurrency(balance)}</div>
          <div className="flex gap-4 text-sm text-white/80">
            <span>Total Pendapatan: {formatCurrency(totalEarnings)}</span>
            <span>|</span>
            <span>Tertarik: {formatCurrency(withdrawn)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/vendor/earnings"
          className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-3">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-teal-600 transition">Tarik Saldo</p>
          <p className="text-xs text-gray-400 mt-1">Ajukan pencairan dana</p>
        </Link>
        <Link
          href="/vendor/earnings"
          className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition">Riwayat Pendapatan</p>
          <p className="text-xs text-gray-400 mt-1">Lihat detail earnings</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Pendapatan" value={formatCurrency(totalEarnings)} icon={<DollarSign className="w-6 h-6" />} color="green" />
        <StatsCard title="Sudah Ditarik" value={formatCurrency(withdrawn)} icon={<ArrowDownLeft className="w-6 h-6" />} color="blue" />
        <StatsCard title="Pending Payout" value={formatCurrency(pending)} icon={<Banknote className="w-6 h-6" />} color="purple" />
      </div>

      {/* Payout Request Form */}
      {balance > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-gray-900">Ajukan Penarikan</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Saldo tersedia: {formatCurrency(balance)}</p>
          <PayoutRequestForm maxAmount={balance} />
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Plus className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-900">Riwayat Transaksi</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">Transaksi terbaru</p>

        <VendorTransactionList transactions={transactions} />
      </div>
    </div>
  )
}
