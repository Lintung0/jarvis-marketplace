"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function requestPayout(data: {
  amount: number
  bank_name: string
  account_number: string
  account_holder: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("balance, role, full_name, email")
    .eq("id", user.id)
    .single()

  if (!profile) throw new Error("Profile not found")
  if (profile.role !== "vendor") throw new Error("Hanya vendor yang bisa request payout")
  if (profile.balance < data.amount) throw new Error("Saldo tidak mencukupi")
  if (data.amount < 50000) throw new Error("Minimum payout Rp 50.000")

  // Create payout request
  const { data: payout, error } = await admin
    .from("payouts")
    .insert({
      vendor_id: user.id,
      amount: data.amount,
      bank_name: data.bank_name,
      account_number: data.account_number,
      account_holder: data.account_holder,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Kurangi balance vendor (hold)
  await admin
    .from("profiles")
    .update({ balance: (profile.balance ?? 0) - data.amount })
    .eq("id", user.id)

  // Catat transaksi wallet
  await admin
    .from("wallet_transactions")
    .insert({
      user_id: user.id,
      amount: data.amount,
      type: "withdrawal",
      status: "pending",
      notes: `Withdrawal request to ${data.bank_name} ${data.account_number}`,
    })

  // Notifikasi ke admin
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin")

  if (admins && admins.length > 0) {
    await admin.from("notifications").insert({
      user_id: admins[0].id,
      type: "payout_requested",
      message: `Vendor ${profile.full_name || user.email} meminta payout Rp${data.amount.toLocaleString("id-ID")}`,
    })
  }

  revalidatePath("/vendor/payouts")
  revalidatePath("/admin/payouts")
  return { success: true, payoutId: payout.id }
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

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()

  const { data: payout } = await admin
    .from("payouts")
    .select("*")
    .eq("id", payoutId)
    .single()

  if (!payout) throw new Error("Payout not found")
  if (payout.status !== "pending") throw new Error("Payout already processed")

  // Update payout status
  await admin
    .from("payouts")
    .update({
      status: "completed",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", payoutId)

  // Update wallet transaction
  await admin
    .from("wallet_transactions")
    .update({ status: "success" })
    .eq("user_id", payout.vendor_id)
    .eq("type", "withdrawal")
    .eq("amount", payout.amount)
    .eq("status", "pending")

  // Notifikasi vendor
  await admin.from("notifications").insert({
    user_id: payout.vendor_id,
    type: "payout_approved",
    message: `Permintaan payout Rp${payout.amount.toLocaleString("id-ID")} telah disetujui dan sedang diproses.`,
  })

  revalidatePath("/admin/payouts")
  revalidatePath("/vendor/payouts")
  return { success: true }
}

export async function rejectPayout(payoutId: string, reason?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()

  const { data: payout } = await admin
    .from("payouts")
    .select("*")
    .eq("id", payoutId)
    .single()

  if (!payout) throw new Error("Payout not found")
  if (payout.status !== "pending") throw new Error("Payout already processed")

  // Update payout status
  await admin
    .from("payouts")
    .update({
      status: "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: reason || null,
    })
    .eq("id", payoutId)

  // Kembalikan balance vendor
  const { data: vendor } = await admin
    .from("profiles")
    .select("balance")
    .eq("id", payout.vendor_id)
    .single()

  await admin
    .from("profiles")
    .update({ balance: (vendor?.balance ?? 0) + payout.amount })
    .eq("id", payout.vendor_id)

  // Update wallet transaction
  await admin
    .from("wallet_transactions")
    .update({ status: "failed" })
    .eq("user_id", payout.vendor_id)
    .eq("type", "withdrawal")
    .eq("amount", payout.amount)
    .eq("status", "pending")

  // Notifikasi vendor
  await admin.from("notifications").insert({
    user_id: payout.vendor_id,
    type: "payout_rejected",
    message: `Permintaan payout Rp${payout.amount.toLocaleString("id-ID")} ditolak. ${reason ? `Alasan: ${reason}` : ""}`,
  })

  revalidatePath("/admin/payouts")
  revalidatePath("/vendor/payouts")
  return { success: true }
}