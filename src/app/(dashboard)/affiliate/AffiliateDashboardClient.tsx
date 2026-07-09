"use client"

import { useState } from "react"
import { Copy, ExternalLink, MousePointerClick, Users, DollarSign, TrendingUp, Clock, CheckCircle, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface Stats {
  id: string
  referral_code: string
  commission_rate: number
  total_earnings: number
  total_clicks: number
  total_conversions: number
  pending_earnings: number
  approved_earnings: number
}

interface Transaction {
  id: string
  commission_amount: number
  status: string
  created_at: string
  paid_at: string | null
  order: { id: string; total: number; created_at: string } | null
}

interface Click {
  id: string
  ip_address: string | null
  user_agent: string | null
  referrer_url: string | null
  created_at: string
  product: { id: string; title: string; slug: string } | null
}

export default function AffiliateDashboardClient({
  stats, transactions, clicks,
}: {
  stats: Stats
  transactions: Transaction[]
  clicks: Click[]
}) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = `${baseUrl}?ref=${stats.referral_code}`
  const shopLink = `${baseUrl}/products?ref=${stats.referral_code}`

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Earn commissions by sharing products with your network</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600">{stats.commission_rate}% Commission</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Earnings</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.total_earnings)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Clicks</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_clicks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Conversions</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_conversions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.pending_earnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Your Referral Links</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">General Store Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shopLink}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={() => handleCopy(shopLink)}
                className="shrink-0 px-4 py-2.5 gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
              >
                {copied ? "Copied!" : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono font-bold text-orange-600 text-sm">
                {stats.referral_code}
              </div>
              <button
                onClick={() => handleCopy(stats.referral_code)}
                className="shrink-0 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clicks */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Clicks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">IP</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clicks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    <MousePointerClick className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No clicks yet. Share your link to start earning!
                  </td>
                </tr>
              ) : (
                clicks.map((click) => (
                  <tr key={click.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(click.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {click.product?.title ?? "General Store"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{click.ip_address ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{click.referrer_url ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Earnings History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Commission</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No earnings yet. Refer customers to start earning!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs font-mono">
                      #{tx.order?.id.slice(0, 8).toUpperCase() ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{formatCurrency(tx.commission_amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        tx.status === "paid" ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30" :
                        tx.status === "approved" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                        "bg-[#ff2d95]/10 text-[#ff2d95] border-[#ff2d95]/30"
                      }`}>
                        {tx.status === "paid" && <CheckCircle className="w-3 h-3" />}
                        {tx.status}
                      </span>
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
