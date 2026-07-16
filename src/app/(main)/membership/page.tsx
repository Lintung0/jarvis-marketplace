import { createClient } from "@/lib/supabase/server"
import { Check, Sparkles } from "lucide-react"
import { getPlans } from "@/app/actions/membership"
import SubscribeButton from "./SubscribeButton"

function formatPrice(price: number): string {
  if (price === 0) return "Gratis"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default async function MembershipPage() {
  const plans = await getPlans()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Pilih Paket Membership</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Dapatkan akses ke fitur eksklusif dan tingkatkan penjualan Anda dengan paket membership yang sesuai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isPro = plan.name === "Pro"
          const features = (plan.features as string[]) ?? []

          return (
            <div
              key={plan.id}
              className={`relative bg-white border rounded-2xl shadow-sm flex flex-col ${
                isPro ? "border-teal-400 shadow-lg shadow-teal-100 scale-105 md:scale-105" : "border-gray-200"
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-brand text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  PALING POPULER
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className={`text-lg font-bold ${isPro ? "text-teal-600" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${isPro ? "text-teal-600" : "text-gray-900"}`}>
                      {formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && <span className="text-sm text-gray-500">/bulan</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      {plan.product_limit >= 999999 ? "Produk tidak terbatas" : `Hingga ${plan.product_limit} produk aktif`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      {plan.featured_products >= 999999 ? "Featured tidak terbatas" : `${plan.featured_products} produk featured`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">Komisi {plan.commission_rate}% per penjualan</span>
                  </li>
                  {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <SubscribeButton planId={plan.id} planName={plan.name} isLoggedIn={!!user} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-gray-400">
          Semua paket dapat di-upgrade atau di-downgrade kapan saja. Hubungi support untuk bantuan.
        </p>
      </div>
    </div>
  )
}
