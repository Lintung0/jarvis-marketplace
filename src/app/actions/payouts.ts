"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function requestPayout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", user.id)
    .single()

  if (profile?.is_banned) throw new Error("Akun kamu telah diban. Tidak bisa melakukan pencairan dana.")

  const amount = parseFloat(formData.get("amount") as string)
  const method = formData.get("method") as string
  const accountDetails = formData.get("account_details") as string

  if (!amount || amount <= 0) throw new Error("Invalid amount")
  if (!method) throw new Error("Payment method required")

  const { error } = await supabase.from("withdrawals").insert({
    vendor_id: user.id,
    amount,
    method,
    account_details: { details: accountDetails },
    status: "pending",
  })

  if (error) throw new Error(error.message)
  revalidatePath("/vendor/earnings")
}

export async function approvePayout(payoutId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "approved" })
    .eq("id", payoutId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/payouts")
}

export async function rejectPayout(payoutId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "rejected" })
    .eq("id", payoutId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/payouts")
}

export async function markPayoutAsPaid(payoutId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", payoutId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/payouts")
}
