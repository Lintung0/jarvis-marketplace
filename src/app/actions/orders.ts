"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { incrementOrderStock } from "./stock"
import type { SupabaseClient } from "@supabase/supabase-js"

const VALID_TRANSITIONS: Record<string, string[]> = {
  paid: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  // Ambil status lama utk restock
  const { data: oldOrder } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single()

  const wasPaid = oldOrder && !["pending", "cancelled"].includes(oldOrder.status)

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) throw new Error(error.message)

  // Restock kalo di-cancel/refund & sebelumnya udah paid
  if (wasPaid && (status === "cancelled" || status === "refunded")) {
    await incrementOrderStock(orderId)
  }

  // Notif ke buyer kalo status berubah
  if (["shipped", "delivered", "cancelled", "refunded"].includes(status)) {
    const { data: ord } = await supabase
      .from("orders")
      .select("buyer_id")
      .eq("id", orderId)
      .single()

    if (ord?.buyer_id) {
      await supabase.from("notifications").insert({
        user_id: ord.buyer_id,
        type: status,
        message: `Your order #${orderId.slice(0, 8)} status has been updated to ${status}`,
        order_id: orderId,
      })
    }
  }

  revalidatePath("/admin/orders")
  revalidatePath("/moderator/returns")
}

export async function approveReturn(returnId: string) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) throw new Error("Unauthorized")

  // Ambil return request + order (pake admin client biar gak kena RLS)
  const { data: req } = await admin
    .from("return_requests")
    .select("*, orders!inner(id, status, total, buyer_id)")
    .eq("id", returnId)
    .single()

  if (!req) throw new Error("Return request not found")

  // Refund ke buyer wallet
  if (req.orders?.buyer_id && req.orders?.total > 0) {
    const { data: buyer } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", req.orders.buyer_id)
      .single()

    if (buyer) {
      await admin
        .from("profiles")
        .update({ balance: (Number(buyer.balance) || 0) + Number(req.orders.total) })
        .eq("id", req.orders.buyer_id)
    }
  }

  await admin
    .from("orders")
    .update({ status: "refunded", updated_at: new Date().toISOString() })
    .eq("id", req.order_id)

  await admin
    .from("return_requests")
    .update({ status: "approved", reviewed_by: user.id, updated_at: new Date().toISOString() })
    .eq("id", returnId)

  await incrementOrderStock(req.order_id)

  // Notif ke buyer
  await admin.from("notifications").insert({
    user_id: req.orders.buyer_id,
    type: "return_approved",
    message: `Your return request for order #${req.order_id.slice(0, 8)} has been approved. Rp${Number(req.orders.total).toLocaleString("id-ID")} refunded to your wallet.`,
    order_id: req.order_id,
  })

  revalidatePath("/moderator/returns")
  revalidatePath("/admin/orders")
  revalidatePath("/admin/payouts")
}

export async function rejectReturn(returnId: string, note?: string) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "moderator"].includes(profile.role)) throw new Error("Unauthorized")

  // Ambil return request buat notif (pake admin client biar gak kena RLS)
  const { data: req } = await admin
    .from("return_requests")
    .select("user_id, order_id")
    .eq("id", returnId)
    .single()

  await admin
    .from("return_requests")
    .update({
      status: "rejected",
      reviewed_by: user.id,
      review_note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", returnId)

  if (req) {
    await admin.from("notifications").insert({
      user_id: req.user_id,
      type: "return_rejected",
      message: `Your return request for order #${req.order_id.slice(0, 8)} has been rejected.${note ? ` Reason: ${note}` : ""}`,
      order_id: req.order_id,
    })
  }

  revalidatePath("/moderator/returns")
}

export async function vendorUpdateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "vendor") throw new Error("Only vendors can perform this action")

  // Ambil order untuk validasi (pake admin client biar gak kena RLS — vendor gak punya SELECT policy di orders)
  const admin = createAdminClient()
  const { data: order } = await admin
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single()

  if (!order) throw new Error("Order not found")

  // Validasi transisi
  const allowed = VALID_TRANSITIONS[order.status]
  if (!allowed?.includes(newStatus)) {
    throw new Error(`Cannot change status from ${order.status} to ${newStatus}`)
  }

  // Validasi vendor punya item di order ini
  const { count } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("order_id", orderId)
    .eq("vendor_id", user.id)

  if (!count || count === 0) throw new Error("You don't have items in this order")

  const { error } = await admin
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) throw new Error(error.message)

  await createNotification(
    admin,
    orderId,
    newStatus,
    `Your order #${orderId.slice(0, 8)} has been updated to ${newStatus}`
  )

  revalidatePath("/vendor/orders")
  revalidatePath(`/orders/${orderId}`)
}

async function createNotification(
  supabase: SupabaseClient,
  orderId: string,
  type: string,
  message: string
) {
  const { data: order } = await supabase
    .from("orders")
    .select("buyer_id")
    .eq("id", orderId)
    .single()

  if (!order?.buyer_id) return

  await supabase.from("notifications").insert({
    user_id: order.buyer_id,
    type,
    message,
    order_id: orderId,
  })
}
