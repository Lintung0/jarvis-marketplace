"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { requestPayout } from "@/app/actions/payouts"

interface Props {
  balance: number
}

export default function PayoutRequestForm({ balance }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = Number(formData.amount)
    if (!amount || amount < 50000) {
      toast.error("Minimum payout Rp 50.000")
      return
    }
    if (amount > balance) {
      toast.error("Saldo tidak mencukupi")
      return
    }
    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      toast.error("Lengkapi semua data bank")
      return
    }

    setLoading(true)
    try {
      await requestPayout({
        amount,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        account_holder: formData.account_holder,
      })
      toast.success("Permintaan payout berhasil dibuat")
      setFormData({ amount: "", bank_name: "", account_number: "", account_holder: "" })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat permintaan payout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Request Payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jumlah Penarikan
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Minimum Rp 50.000"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Bank
          </label>
          <input
            type="text"
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            placeholder="Contoh: BCA, Mandiri, BNI"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nomor Rekening
          </label>
          <input
            type="text"
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            placeholder="1234567890"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            value={formData.account_holder}
            onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
            placeholder="Sesuai KTP"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Request Payout"
          )}
        </Button>
      </form>
    </Card>
  )
}
