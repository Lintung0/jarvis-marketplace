"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowUp, ArrowDown, Check, X } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
}

interface Props {
  balance: number
  transactions: Transaction[]
}

export default function WalletClient({ balance: initialBalance, transactions: initialTransactions }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [topupAmount, setTopupAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState(initialTransactions)

  useEffect(() => {
    const status = searchParams.get("status")
    if (status === "success") {
      toast.success("Top up berhasil! Saldo Anda sudah diperbarui.")
      // Refresh halaman
      setTimeout(() => router.refresh(), 2000)
    } else if (status === "failed") {
      toast.error("Top up gagal. Silakan coba lagi.")
    }
  }, [searchParams, router])

  const handleTopup = async () => {
    if (!topupAmount || isNaN(Number(topupAmount))) {
      toast.error("Masukkan nominal yang valid")
      return
    }

    const amount = Number(topupAmount)
    if (amount < 10000) {
      toast.error("Minimum top up Rp 10.000")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Redirect ke Xendit payment
      window.location.href = data.payment_url
    } catch (error: any) {
      toast.error(error.message || "Gagal buat top up")
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      topup: "Top Up",
      payment: "Pembayaran",
      refund: "Pengembalian Dana",
      withdrawal: "Penarikan",
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "topup":
        return "text-green-600"
      case "payment":
        return "text-red-600"
      case "refund":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />
      case "failed":
        return <X className="w-4 h-4 text-red-600" />
      case "pending":
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Up Section */}
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Up Wallet</h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            placeholder="Masukkan nominal (min. Rp 10.000)"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
          <Button
            onClick={handleTopup}
            disabled={loading || !topupAmount}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Top Up"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Metode pembayaran: Transfer Bank, E-Wallet, Kartu Kredit (via Xendit)
        </p>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Transaksi</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`${tx.type === "topup" || tx.type === "refund" ? "bg-green-100" : "bg-red-100"} p-2 rounded-lg`}>
                    {tx.type === "topup" || tx.type === "refund" ? (
                      <ArrowUp className={`w-4 h-4 ${getTypeColor(tx.type)}`} />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${getTypeColor(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${tx.type === "topup" || tx.type === "refund" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "topup" || tx.type === "refund" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  {getStatusIcon(tx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
