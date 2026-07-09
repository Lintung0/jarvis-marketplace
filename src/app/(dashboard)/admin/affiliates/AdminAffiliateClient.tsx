"use client"

import { useState } from "react"
import { DollarSign, MousePointerClick, Users, TrendingUp, Search, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { updateConversionStatus } from "@/app/actions/affiliates"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Affiliate {
  id: string
  referral_code: string
  commission_rate: number
  total_earnings: number
  total_clicks: number
  total_conversions: number
  created_at: string
  profile: { full_name: string | null; username: string; email: string; avatar_url: string | null } | null
}

interface Conversion {
  id: string
  commission_amount: number
  status: string
  created_at: string
  paid_at: string | null
  affiliate: {
    id: string
    referral_code: string
    profile: { full_name: string | null; username: string } | null
  } | null
  order: { id: string; total: number; created_at: string } | null
}

export default function AdminAffiliateClient({
  affiliates, conversions,
}: {
  affiliates: Affiliate[]
  conversions: Conversion[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<"affiliates" | "conversions">("affiliates")
  const [search, setSearch] = useState("")

  const filteredAffiliates = affiliates.filter((a) => {
    const name = a.profile?.full_name ?? a.profile?.username ?? ""
    return name.toLowerCase().includes(search.toLowerCase()) || a.referral_code.toLowerCase().includes(search.toLowerCase())
  })

  async function handleStatusChange(conversionId: string, status: "approved" | "paid") {
    try {
      await updateConversionStatus(conversionId, status)
      toast.success(`Conversion ${status} successfully`)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const pendingConversions = conversions.filter((c) => c.status === "pending")
  const approvedConversions = conversions.filter((c) => c.status === "approved")
  const paidConversions = conversions.filter((c) => c.status === "paid")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Total Affiliates</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{affiliates.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Pending Payouts</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{pendingConversions.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{approvedConversions.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{paidConversions.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("affiliates")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "affiliates" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Affiliates ({affiliates.length})
        </button>
        <button
          onClick={() => setTab("conversions")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "conversions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Conversions ({conversions.length})
        </button>
      </div>

      {tab === "affiliates" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search affiliates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Affiliates Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Affiliate</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Code</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Commission</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Clicks</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Conversions</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Earnings</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAffiliates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No affiliates found
                      </td>
                    </tr>
                  ) : (
                    filteredAffiliates.map((aff) => (
                      <tr key={aff.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                              {(aff.profile?.full_name ?? aff.profile?.username ?? "?").charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-xs">{aff.profile?.full_name ?? aff.profile?.username ?? "Unknown"}</p>
                              <p className="text-gray-400 text-xs">{aff.profile?.email ?? ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-orange-600">{aff.referral_code}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{aff.commission_rate}%</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{aff.total_clicks}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{aff.total_conversions}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{formatCurrency(aff.total_earnings)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(aff.created_at).toLocaleDateString("id-ID")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "conversions" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Affiliate</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Commission</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {conversions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      No conversions yet
                    </td>
                  </tr>
                ) : (
                  conversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(conv.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs">
                        {conv.affiliate?.profile?.full_name ?? conv.affiliate?.profile?.username ?? "Unknown"}
                        <span className="text-gray-400 ml-1 font-mono">({conv.affiliate?.referral_code})</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        #{conv.order?.id.slice(0, 8).toUpperCase() ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{formatCurrency(conv.commission_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                          conv.status === "paid" ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30" :
                          conv.status === "approved" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                          "bg-[#ff2d95]/10 text-[#ff2d95] border-[#ff2d95]/30"
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {conv.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStatusChange(conv.id, "approved")}
                              className="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(conv.id, "paid")}
                              className="px-2 py-1 text-xs font-semibold rounded-lg bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 transition"
                            >
                              Mark Paid
                            </button>
                          </div>
                        )}
                        {conv.status === "approved" && (
                          <button
                            onClick={() => handleStatusChange(conv.id, "paid")}
                            className="px-2 py-1 text-xs font-semibold rounded-lg bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 transition"
                          >
                            Mark Paid
                          </button>
                        )}
                        {conv.status === "paid" && (
                          <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
