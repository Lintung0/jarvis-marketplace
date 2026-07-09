"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type Role = "member" | "vendor" | "moderator" | "admin"

export async function updateUserRole(userId: string, newRole: Role) {
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Hanya admin yang bisa mengganti role user")

  const admin = createAdminClient()

  const { data: target } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (!target) throw new Error("User tidak ditemukan")
  if (target.role === "admin" && userId !== user.id) {
    throw new Error("Tidak bisa mengubah role admin lain")
  }

  const { error } = await admin
    .from("profiles")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/users")
  revalidatePath("/admin/vendors")
}

export async function toggleUserBan(userId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()

  const { data: target } = await admin
    .from("profiles")
    .select("role, is_banned")
    .eq("id", userId)
    .single()

  if (!target) throw new Error("User tidak ditemukan")
  if (target.role === "admin" && profile.role !== "admin") {
    throw new Error("Moderator tidak bisa ban admin")
  }

  const { error } = await admin
    .from("profiles")
    .update({ is_banned: !target.is_banned, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/users")
  revalidatePath("/admin/vendors")
  revalidatePath("/moderator/reports")
}
