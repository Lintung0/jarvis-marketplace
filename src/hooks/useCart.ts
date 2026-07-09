"use client"

import { useCartStore } from "@/stores/cartStore"

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total } =
    useCartStore()
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, total, count }
}
