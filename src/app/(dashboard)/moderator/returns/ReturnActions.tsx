"use client"

import { useState } from "react"
import { approveReturn, rejectReturn } from "@/app/actions/orders"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function ReturnActions({ returnId, orderId }: { returnId: string; orderId: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleApprove() {
    setLoading("approve")
    try {
      await approveReturn(returnId)
      router.refresh()
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleReject() {
    const note = prompt("Optional rejection note:")
    setLoading("reject")
    try {
      await rejectReturn(returnId, note || undefined)
      router.refresh()
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition flex items-center gap-1"
      >
        {loading === "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition flex items-center gap-1"
      >
        {loading === "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        Reject
      </button>
    </div>
  )
}
