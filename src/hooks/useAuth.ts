"use client"

import { useAuthStore } from "@/stores/authStore"

export function useAuth() {
  const { user, setUser } = useAuthStore()
  const isAdmin = user?.role === "admin"
  const isModerator = user?.role === "moderator"
  const isVendor = user?.role === "vendor"
  const isMember = user?.role === "member"

  return { user, setUser, isAdmin, isModerator, isVendor, isMember }
}
