"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { vendorUpdateOrderStatus } from "@/app/actions/orders"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface VendorOrderActionsProps {
  orderId: string
  currentStatus: string
}

const ACTIONS: Record<string, { label: string; nextStatus: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paid: { label: "Process", nextStatus: "processing", variant: "default" },
  processing: { label: "Ship", nextStatus: "shipped", variant: "secondary" },
}

export function VendorOrderActions({ orderId, currentStatus: initialStatus }: VendorOrderActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  const action = ACTIONS[status]
  if (!action) return null

  async function handleClick() {
    setLoading(true)
    setError("")
    try {
      await vendorUpdateOrderStatus(orderId, action.nextStatus)
      setStatus(action.nextStatus)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={action.variant}
        size="sm"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : action.label}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
