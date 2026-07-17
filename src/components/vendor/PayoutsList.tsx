"use client"

import { formatCurrency } from "@/lib/utils"
import { Clock, CheckCircle, XCircle, CreditCard } from "lucide-react"

interface Payout {
  id: string
  amount: number
  status: string
  bank_name: string
  account_number: string
  account_holder: string
  created_at: string
  reviewed_at: string | null
  notes: string | null
}

interface Props {
  payouts: Payout[]
}

export default function PayoutsList({ payouts }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu"
      case "approved":
      case "completed":
        return "Disetujui"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  if (payouts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Belum ada riwayat payout</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Riwayat Payout</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Jumlah</th>
              <th className="pb-3 font-medium">Bank</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="py-3">
                  <div className="text-sm text-gray-900">
                    {new Date(payout.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="py-3 font-semibold text-gray-900">
                  {formatCurrency(payout.amount)}
                </td>
                <td className="py-3">
                  <div className="text-sm text-gray-900">{payout.bank_name}</div>
                  <div className="text-xs text-gray-500">
                    {payout.account_number} • {payout.account_holder}
                  </div>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                    {payout.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                    {payout.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {payout.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                    {getStatusLabel(payout.status)}
                  </span>
                  {payout.notes && (
                    <div className="text-xs text-gray-500 mt-1">{payout.notes}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}