"use client"

import { useState } from "react"
import { banUser } from "@/app/actions/vendors"

export function BanUserButton({ userId, isBanned }: { userId: string; isBanned: boolean }) {
  const [banned, setBanned] = useState(isBanned)

  async function handleBan() {
    if (!confirm(`Ban this user?`)) return
    try {
      await banUser(userId)
      setBanned(true)
    } catch {
      alert("Failed to ban user")
    }
  }

  return (
    <button
      onClick={handleBan}
      disabled={banned}
      className={`text-xs px-2 py-1 rounded-lg border transition disabled:opacity-50 ${
        banned
          ? "bg-red-500/10 text-red-400 border-red-500/30"
          : "bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
      }`}
    >
      {banned ? "Banned" : "Ban"}
    </button>
  )
}
