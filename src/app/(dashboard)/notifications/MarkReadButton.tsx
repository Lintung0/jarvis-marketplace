"use client"

import { markAsRead } from "@/app/actions/notifications"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function MarkReadButton({ notifId }: { notifId: string }) {
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        await markAsRead(notifId)
        router.refresh()
      }}
      className="p-1.5 rounded-full hover:bg-orange-100 transition text-orange-500"
      title="Mark as read"
    >
      <Check className="w-4 h-4" />
    </button>
  )
}
