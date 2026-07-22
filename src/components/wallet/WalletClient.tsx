"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowUp, ArrowDown, Check, X, Eye, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  payment_id: string | null
  notes: string | null
  created_at: string
}

interface Props {
  balance: number
  transactions: Transaction[]
}

export default function WalletClient({ balance: initialBalance, transactions: initialTransactions }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [topupAmount, setTopupAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    const status = searchParams.get("status")
    if (status === "success") {
      toast.success(t("wallet.top_up_success"))
      setTimeout(() => router.refresh(), 2000)
    } else if (status === "failed") {
      toast.error(t("wallet.top_up_failed"))
    }
  }, [searchParams, router, t])

  const handleTopup = async () => {
    if (!topupAmount || isNaN(Number(topupAmount))) {
      toast.error(t("wallet.invalid_amount"))
      return
    }

    const amount = Number(topupAmount)
    if (amount < 10000) {
      toast.error(t("wallet.min_top_up"))
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

      window.location.href = data.payment_url
    } catch (error: any) {
      toast.error(error.message || t("wallet.create_top_up_failed"))
      setLoading(false)
    }
  }

  const openDetail = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsDetailOpen(true)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      topup: t("wallet.tx_type_topup"),
      payment: t("wallet.tx_type_payment"),
      refund: t("wallet.tx_type_refund"),
      withdrawal: t("wallet.tx_type_withdrawal"),
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "topup":
      case "refund":
        return "text-green-600"
      case "payment":
      case "withdrawal":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "topup":
      case "refund":
        return "bg-green-100"
      case "payment":
      case "withdrawal":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "failed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success":
        return t("wallet.status_success")
      case "pending":
        return t("wallet.status_pending")
      case "failed":
        return t("wallet.status_failed")
      default:
        return status
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-white">
        <p className="text-sm opacity-90 mb-2">{t("wallet.balance_title")}</p>
        <h1 className="text-4xl font-bold mb-6">{formatCurrency(initialBalance)}</h1>
        <p className="text-sm opacity-75">{t("wallet.balance_subtitle")}</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Top Up Section */}
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t("wallet.top_up")}</h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            placeholder={t("wallet.enter_amount")}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
          <Button
            onClick={handleTopup}
            disabled={loading || !topupAmount}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("wallet.top_up_button")}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t("wallet.payment_method_info")}
        </p>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t("wallet.transaction_history")}</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">{t("wallet.no_transactions")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => openDetail(tx)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`${getBgColor(tx.type)} p-2 rounded-lg`}>
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
                      {formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${tx.type === "topup" || tx.type === "refund" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "topup" || tx.type === "refund" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  {getStatusIcon(tx.status)}
                  <Eye className="w-4 h-4 text-gray-400 hover:text-teal-500 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {isDetailOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{t("wallet.detail_title")}</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className={`${getBgColor(selectedTx.type)} p-3 rounded-xl`}>
                  {selectedTx.type === "topup" || selectedTx.type === "refund" ? (
                    <ArrowUp className={`w-6 h-6 ${getTypeColor(selectedTx.type)}`} />
                  ) : (
                    <ArrowDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-bold ${getTypeColor(selectedTx.type)}`}>
                    {getTypeLabel(selectedTx.type)}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(selectedTx.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTx.status)}`}>
                  {getStatusLabel(selectedTx.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t("wallet.detail_amount")}</span>
                  <span className={`font-bold ${selectedTx.type === "topup" || selectedTx.type === "refund" ? "text-green-600" : "text-red-600"}`}>
                    {selectedTx.type === "topup" || selectedTx.type === "refund" ? "+" : "-"}
                    {formatCurrency(selectedTx.amount)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t("wallet.detail_status")}</span>
                  <span className={`font-medium ${getStatusColor(selectedTx.status)} px-2 py-0.5 rounded text-xs`}>
                    {getStatusIcon(selectedTx.status)}
                    {getStatusLabel(selectedTx.status)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t("wallet.detail_date")}</span>
                  <span className="font-medium text-gray-900">{formatDate(selectedTx.created_at)}</span>
                </div>

                {selectedTx.payment_id && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t("wallet.detail_payment_id")}</span>
                    <span className="font-mono text-sm text-gray-900 break-all">{selectedTx.payment_id}</span>
                  </div>
                )}

                {selectedTx.notes && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t("wallet.detail_notes")}</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%] break-words">{selectedTx.notes}</span>
                  </div>
                )}

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-sm text-gray-900 break-all">{selectedTx.id}</span>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 rounded-b-2xl">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  {t("common.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}