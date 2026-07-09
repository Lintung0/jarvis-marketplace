"use server"

import { createAdminClient } from "@/lib/supabase/server"

export async function decrementStock(productId: string, quantity: number) {
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single()

  if (product && product.stock >= quantity) {
    await supabase
      .from("products")
      .update({ stock: product.stock - quantity })
      .eq("id", productId)
  }
}

export async function incrementStock(productId: string, quantity: number) {
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single()

  if (product) {
    await supabase
      .from("products")
      .update({ stock: product.stock + quantity })
      .eq("id", productId)
  }
}

export async function decrementOrderStock(orderId: string) {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId)

  if (!items) return

  for (const item of items) {
    if (item.product_id) {
      await decrementStock(item.product_id, item.quantity)
    }
  }
}

export async function incrementOrderStock(orderId: string) {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId)

  if (!items) return

  for (const item of items) {
    if (item.product_id) {
      await incrementStock(item.product_id, item.quantity)
    }
  }
}
