"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/app/actions/orders"

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]

export function AdminOrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setStatus(newStatus)
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch {
      setStatus(currentStatus)
      alert("Failed to update order status")
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className="bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1 text-xs focus:border-teal-400 outline-none"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
