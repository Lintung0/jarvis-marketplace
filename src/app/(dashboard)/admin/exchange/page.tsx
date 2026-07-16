import { createAdminClient } from "@/lib/supabase/server"
import { updateExchangeRate } from "@/app/actions/exchange-rates"
import { RefreshCw } from "lucide-react"

export default async function AdminExchangePage() {
  const admin = createAdminClient()
  const { data } = await admin
    .from("exchange_rates")
    .select("rate_to_idr, updated_at")
    .eq("currency_code", "USD")
    .single()

  const currentRate = data ? Number(data.rate_to_idr) : 16250
  const lastSync = data?.updated_at

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Exchange Rate</h1>
      <p className="text-sm text-gray-500 mb-8">
        Atur kurs USD ke IDR. Nilai akan otomatis tersync tiap hari via cron job.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Kurs Saat Ini</p>
            <p className="text-3xl font-bold text-gray-900">
              1 USD = Rp{currentRate.toLocaleString()}
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            {lastSync && (
              <p>Terakhir sync: {new Date(lastSync).toLocaleString("id-ID")}</p>
            )}
          </div>
        </div>

        <form action={updateExchangeRate} className="space-y-4">
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
              Override Rate (Rp)
            </label>
            <div className="flex gap-3">
              <input
                id="rate"
                name="rate"
                type="number"
                defaultValue={currentRate}
                className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 text-sm">Cron Job Otomatis</h3>
            <p className="text-xs text-blue-600 mt-1">
              Rate otomatis diupdate setiap tengah malam (00:00 UTC) oleh cron job. 
              Override manual di atas akan menimpa sampai cron job berikutnya berjalan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
