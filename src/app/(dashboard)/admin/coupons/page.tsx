import { createAdminClient } from "@/lib/supabase/server"
import { CouponActions } from "./CouponActions"
import { CouponForm } from "@/components/admin/CouponForm"
import { formatCurrency } from "@/lib/utils"
import type { Coupon } from "@/types"

export default async function AdminCouponsPage() {
  const admin = createAdminClient()

  const { data: coupons } = await admin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">{coupons?.length ?? 0} coupons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Code</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Value</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Min Order</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Usage</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Expiry</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons?.map((coupon: Coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{coupon.code}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                          coupon.type === "percentage"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-purple-100 text-purple-700 border-purple-200"
                        }`}>
                          {coupon.type === "percentage" ? "%" : "Fixed"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : formatCurrency(coupon.value)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatCurrency(coupon.min_order)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {coupon.used_count}
                        {coupon.max_uses !== null ? ` / ${coupon.max_uses}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          coupon.is_active
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}>
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {coupon.start_at ? (
                          <span>
                            {new Date(coupon.start_at).toLocaleDateString("id-ID")}
                            {" → "}
                            {coupon.expires_at
                              ? new Date(coupon.expires_at).toLocaleDateString("id-ID")
                              : "∞"}
                          </span>
                        ) : coupon.expires_at ? (
                          new Date(coupon.expires_at).toLocaleDateString("id-ID")
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <CouponActions couponId={coupon.id} isActive={coupon.is_active} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <CouponForm />
        </div>
      </div>
    </div>
  )
}
