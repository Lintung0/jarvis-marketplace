import { createClient } from "@/lib/supabase/server"
import { getAllPlansAdmin, getAllSubscriptionsAdmin, adminTogglePlanForm } from "@/app/actions/membership"
import { formatCurrency } from "@/lib/utils"
import { Crown, Package, Users, TrendingUp, Plus, Check, X } from "lucide-react"
import Link from "next/link"

export default async function AdminMembershipPage() {
  const plans = await getAllPlansAdmin()
  const subscriptions = await getAllSubscriptionsAdmin()

  const activeSubs = subscriptions?.filter((s: any) => s.status === "active") ?? []
  const totalRevenue = subscriptions?.reduce((sum: number, s: any) => {
    if (s.status === "active") return sum + (s.plan?.price ?? 0)
    return sum
  }, 0) ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership</h1>
          <p className="text-sm text-gray-500 mt-1">Manage plans and subscriptions</p>
        </div>
        <Link
          href="/admin/membership/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Plans</p>
              <p className="text-xl font-bold text-gray-900">{plans?.length ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Active Subscribers</p>
              <p className="text-xl font-bold text-gray-900">{activeSubs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">MRR</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Subs</p>
              <p className="text-xl font-bold text-gray-900">{subscriptions?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Plans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Products</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Commission</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans?.map((plan: any) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Crown className={`w-4 h-4 ${plan.price === 0 ? "text-gray-400" : plan.price >= 200000 ? "text-purple-500" : "text-orange-500"}`} />
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-400">{plan.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {plan.price === 0 ? "Free" : formatCurrency(plan.price) + "/mo"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {plan.product_limit >= 999999 ? "∞" : plan.product_limit}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{plan.commission_rate}%</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {plan.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {plan.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/membership/${plan.id}/edit`}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/30 hover:bg-blue-500/20 transition"
                      >
                        Edit
                      </Link>
                      <form action={adminTogglePlanForm}>
                        <input type="hidden" name="planId" value={plan.id} />
                        <input type="hidden" name="isActive" value={plan.is_active ? "false" : "true"} />
                        <button
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border transition ${
                            plan.is_active
                              ? "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
                          }`}
                        >
                          {plan.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Subscriptions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Vendor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Start</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">End</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!subscriptions || subscriptions.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">No subscriptions yet.</td>
                </tr>
              ) : (
                subscriptions?.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                          {(sub.vendor?.full_name ?? sub.vendor?.username ?? "?").charAt(0)}
                        </div>
                        <p className="font-medium text-gray-900">{sub.vendor?.full_name ?? sub.vendor?.username}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${
                        sub.plan?.price === 0 ? "text-gray-500" :
                        sub.plan?.price >= 200000 ? "text-purple-600" : "text-orange-600"
                      }`}>
                        {sub.plan?.name ?? "?"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        sub.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                        sub.status === "expired" ? "bg-red-50 text-red-700 border-red-200" :
                        sub.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-gray-50 text-gray-500 border-gray-200"
                      }`}>{sub.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(sub.start_date).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(sub.end_date).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{sub.payment_id ? sub.payment_id.slice(0, 12) + "..." : "-"}</td>
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
