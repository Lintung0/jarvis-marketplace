"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, Check, X, Loader2, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Transaction {
  type: string
  amount: number
  desc: string
  date: string
  status?: string
}

interface Props {
  transactions: {
    type: string
    amount: number
    desc: string
    date: string
    status?: string
  }[]
}

export default function VendorTransactionList({ transactions }: Props) {
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    if (!isDetailOpen) setSelectedTx(null)
  }, [isDetailOpen])

  const openDetail = (tx: any) => {
    setSelectedTx(tx)
    setIsDetailOpen(true)
  }

  const getTypeLabel = (type: string) => {
    return type === "earning" ? "Pendapatan Penjualan" : "Penarikan Dana"
  }

  const getTypeColor = (type: string) => {
    return type === "earning" ? "text-emerald-600" : "text-red-500"
  }

  const getBgColor = (type: string) => {
    return type === "earning" ? "bg-emerald-100" : "bg-red-100"
  }

  const getIcon = (tx: any) => {
    if (tx.type === "earning") {
      return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
    }
    if (tx.status === "paid") return <Check className="w-4 h-4 text-blue-600" />
    if (tx.status === "rejected") return <X className="w-4 h-4 text-red-600" />
    return <ArrowUpRight className="w-4 h-4 text-yellow-600" />
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return "-"
    switch (status) {
      case "paid": return "Berhasil"
      case "approved": return "Disetujui"
      case "rejected": return "Ditolak"
      case "pending": return "Menunggu"
      default: return status
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700"
    switch (status) {
      case "paid": return "bg-blue-100 text-blue-700"
      case "approved": return "bg-teal-100 text-teal-700"
      case "rejected": return "bg-red-100 text-red-700"
      default: return "bg-yellow-100 text-yellow-700"
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric"
    })
  }

  return (
    <>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto text-gray-300 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Belum ada transaksi</p>
          <p className="text-gray-300 text-xs mt-1">Mulai jualan untuk melihat pemasukan</p>
        </div>
      ) : (
        <div className="space-y-1">
          {transactions.slice(0, 30).map((tx, i) => (
            <div
              key={i}
              onClick={() => { setSelectedTx(tx); setIsDetailOpen(true); }}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  tx.type === "earning"
                    ? "bg-emerald-100"
                    : tx.status === "paid"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                }`}>
                  {tx.type === "earning" ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className={`w-4 h-4 ${
                      tx.status === "paid" ? "text-blue-600" :
                      tx.status === "rejected" ? "text-red-600" :
                      "text-yellow-600"
                    }`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.desc}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString("id-ID")}</p>
                    {tx.type === "withdrawal" && tx.status && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        tx.status === "paid" ? "bg-blue-100 text-blue-700" :
                        tx.status === "rejected" ? "bg-red-100 text-red-700" :
                        tx.status === "approved" ? "bg-teal-100 text-teal-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "earning" ? "text-emerald-600" : "text-red-500"}`}>
                {tx.type === "earning" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Detail Transaksi</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTx.type === "earning" ? "bg-emerald-100" : "bg-red-100"}`}>
                  {selectedTx.type === "earning" ? (
                    <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">{selectedTx.desc}</p>
                  <p className="text-sm text-gray-500">{new Date(selectedTx.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Tipe</span>
                  <span className={`font-medium ${selectedTx.type === "earning" ? "text-emerald-600" : "text-red-500"}`}>
                    {selectedTx.type === "earning" ? "+" : "-"}
                    {formatCurrency(selectedTx.amount)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Tipe Transaksi</span>
                  <span className="font-medium text-gray-900">{selectedTx.type === "earning" ? "Pendapatan Penjualan" : "Penarikan Dana"}</span>
                </div>

                {selectedTx.type === "withdrawal" && selectedTx.status && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                      {selectedTx.status === "paid" ? "Berhasil" :
                       selectedTx.status === "approved" ? "Disetujui" :
                       selectedTx.status === "rejected" ? "Ditolak" : "Menunggu"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Waktu</span>
                  <span className="font-medium text-gray-900">{new Date(selectedTx.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Deskripsi</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] break-words">{selectedTx.desc}</span>
                </div>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}