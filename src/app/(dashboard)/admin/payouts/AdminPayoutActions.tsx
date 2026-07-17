"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { approvePayout, rejectPayout } from "@/app/actions/payouts"
import { Loader2 } from "lucide-react"

type Payout = {
  id: string
  status: string
  vendor: { full_name: string | null; username: string | null } | null
}

export function AdminPayoutActions({ payout }: { payout: Payout }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleApprove() {
    setLoading("approve")
    setError(null)
    try {
      await approvePayout(payout.id)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve")
    }
    setLoading(null)
  }

  async function handleReject() {
    setLoading("reject")
    setError(null)
    try {
      await rejectPayout(payout.id)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject")
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {payout.status === "pending" && (
          <>
            <button
              onClick={handleApprove}
              disabled={loading !== null}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20 transition disabled:opacity-50"
            >
              {loading === "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
            </button>
            <button
              onClick={handleReject}
              disabled={loading !== null}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 transition disabled:opacity-50"
            >
              {loading === "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reject"}
            </button>
          </>
        )}
        {payout.status === "approved" && (
          <span className="text-xs text-blue-600 font-medium">Approved</span>
        )}
        {payout.status === "completed" && (
          <span className="text-xs text-green-600 font-medium">Paid</span>
        )}
        {payout.status === "rejected" && (
          <span className="text-xs text-red-500 font-medium">Rejected</span>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
