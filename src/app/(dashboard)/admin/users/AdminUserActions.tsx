"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateUserRole, toggleUserBan } from "@/app/actions/users"
import { Loader2 } from "lucide-react"

const ROLES = ["member", "vendor", "moderator", "admin"] as const

type User = {
  id: string
  full_name: string | null
  username: string | null
  email: string | null
  role: string
  is_banned: boolean
}

export function AdminUserActions({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState(user.role)

  async function handleRoleChange(newRole: string) {
    if (newRole === user.role) return
    setLoading("role")
    setError(null)
    try {
      await updateUserRole(user.id, newRole as "member" | "vendor" | "moderator" | "admin")
      setSelectedRole(newRole)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update role")
    }
    setLoading(null)
  }

  async function handleBan() {
    setLoading("ban")
    setError(null)
    try {
      await toggleUserBan(user.id)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to toggle ban")
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={loading === "role"}
          className="bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1 text-xs focus:border-teal-400 outline-none disabled:opacity-50"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {loading === "role" && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
        <button
          onClick={handleBan}
          disabled={loading !== null}
          className={`px-2 py-1 text-xs font-medium rounded-md border transition disabled:opacity-50 ${
            user.is_banned
              ? "bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
          }`}
        >
          {loading === "ban" ? <Loader2 className="w-3 h-3 animate-spin" /> : user.is_banned ? "Unban" : "Ban"}
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
