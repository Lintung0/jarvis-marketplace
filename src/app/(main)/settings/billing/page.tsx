import { createClient } from "@/lib/supabase/server"
import { getVendorSubscription, getProductCountForVendor, getPlans } from "@/app/actions/membership"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Package, Calendar, Check, ArrowUpRight, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/settings/billing")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isVendor = profile?.role === "vendor" || profile?.role === "admin" || profile?.role === "moderator"

  const subscription = isVendor ? await getVendorSubscription(user.id) : null
  const productCount = isVendor ? await getProductCountForVendor(user.id) : 0
  const plans = await getPlans()

  const currentPlan = subscription?.plan
  const planLimit = currentPlan?.product_limit ?? 5
  const isExpired = subscription ? new Date(subscription.end_date) < new Date() : false
  const daysLeft = subscription
    ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola langganan dan metode pembayaran</p>
      </div>

      {!isVendor ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Crown className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Fitur Membership untuk Vendor</h2>
          <p className="text-gray-500 text-sm mb-6">
            Kamu harus mendaftar sebagai penjual untuk mengakses membership dan fitur billing.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all"
          >
            Mulai Jualan
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Current Plan Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/60 text-sm font-medium">Paket Saat Ini</span>
                </div>
                <h2 className="text-2xl font-bold">{currentPlan?.name ?? "Free"}</h2>
              </div>
              {currentPlan && currentPlan.price > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  {isExpired ? "Expired" : daysLeft > 0 ? `${daysLeft} hari lagi` : "Aktif"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/50 text-xs mb-1">Harga</p>
                <p className="font-semibold">{currentPlan?.price ? formatCurrency(currentPlan.price) + "/bln" : "Gratis"}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Produk</p>
                <p className="font-semibold">{productCount}/{planLimit}</p>
              </div>
              {subscription?.end_date && (
                <div>
                  <p className="text-white/50 text-xs mb-1">Berakhir</p>
                  <p className="font-semibold">{new Date(subscription.end_date).toLocaleDateString("id-ID")}</p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all"
                style={{ width: `${Math.min((productCount / planLimit) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link
              href="/membership"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-3">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900 group-hover:text-teal-600 transition">Ganti Plan</p>
              <p className="text-xs text-gray-400 mt-1">Upgrade atau downgrade</p>
            </Link>
            <Link
              href="/vendor/products"
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Kelola Produk</p>
              <p className="text-xs text-gray-400 mt-1">{productCount} dari {planLimit} produk terpakai</p>
            </Link>
          </div>

          {/* All Plans Comparison */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Semua Paket</h3>
            <div className="space-y-3">
              {plans.map((plan: any) => {
                const isActive = currentPlan?.id === plan.id
                return (
                  <div
                    key={plan.id}
                    className={`relative flex items-center justify-between p-4 rounded-xl border ${
                      isActive
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    } transition`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.price === 0 ? "bg-gray-100" :
                        plan.price >= 200000 ? "bg-purple-100" :
                        "bg-teal-100"
                      }`}>
                        <Crown className={`w-5 h-5 ${
                          plan.price === 0 ? "text-gray-400" :
                          plan.price >= 200000 ? "text-purple-600" :
                          "text-teal-600"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 text-[10px] font-medium">
                              <Check className="w-3 h-3" />
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {plan.price === 0 ? "Gratis" : formatCurrency(plan.price) + "/bulan"} &middot; {plan.product_limit === 999999 ? "Unlimited" : plan.product_limit} produk &middot; Komisi {plan.commission_rate}%
                        </p>
                        {plan.features && Array.isArray(plan.features) && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {plan.features.slice(0, 3).map((f: string) => (
                              <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                                <Check className="w-3 h-3" />
                                {f}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="text-[10px] text-gray-400">+{plan.features.length - 3} lainnya</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!isActive && (
                      <Link
                        href="/membership"
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all whitespace-nowrap"
                      >
                        Pilih
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
