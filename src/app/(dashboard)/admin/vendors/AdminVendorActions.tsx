"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toggleVendorStatus } from "@/app/actions/vendors"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function AdminVendorActions({
  vendorId, isVerified, isBanned,
}: {
  vendorId: string; isVerified: boolean; isBanned: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleVerify() {
    setLoading("verify")
    setError(null)
    try {
      await toggleVendorStatus(vendorId, "is_verified", !isVerified)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(null)
  }

  async function handleBan() {
    setLoading("ban")
    setError(null)
    try {
      await toggleVendorStatus(vendorId, "is_banned", !isBanned)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVerify}
          disabled={loading !== null}
          className={isVerified ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-green-600"}
        >
          {loading === "verify" ? <Loader2 className="w-3 h-3 animate-spin" /> : isVerified ? "Verified" : "Verify"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBan}
          disabled={loading !== null}
          className={isBanned ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-destructive"}
        >
          {loading === "ban" ? <Loader2 className="w-3 h-3 animate-spin" /> : isBanned ? "Banned" : "Ban"}
        </Button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
          <span className="text-xs text-red-600">{error}</span>
        </div>
      )}
    </div>
  )
}
