"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { approvePayout, rejectPayout } from "@/app/actions/payouts"

interface Props {
  payoutId: string
}

export default function PayoutActions({ payoutId }: Props) {
  const router = useRouter()
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async () => {
    setApproving(true)
    try {
      await approvePayout(payoutId)
      toast.success("Payout disetujui")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Gagal approve")
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    setRejecting(true)
    try {
      await rejectPayout(payoutId, rejectReason || undefined)
      toast.success("Payout ditolak")
      setRejectReason("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Gagal reject")
    } finally {
      setRejecting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          ⋮
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleApprove}
          disabled={approving}
          className="text-green-600 focus:text-green-600"
        >
          {approving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          Approve
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setRejectReason(prompt("Alasan penolakan (opsional):") || "")}
          disabled={rejecting}
          className="text-red-600 focus:text-red-600"
        >
          {rejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}