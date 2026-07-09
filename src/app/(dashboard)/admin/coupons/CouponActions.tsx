"use client"

import { useState } from "react"
import { toggleCoupon, deleteCoupon } from "@/app/actions/coupons"

export function CouponActions({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)

  async function handleToggle() {
    const newVal = !active
    setActive(newVal)
    try { await toggleCoupon(couponId, newVal) }
    catch { setActive(active) }
  }

  async function handleDelete() {
    if (!confirm("Delete this coupon?")) return
    try { await deleteCoupon(couponId) }
    catch { alert("Failed to delete") }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`text-xs px-2 py-1 rounded-lg border transition ${
          active
            ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30"
            : "bg-gray-500/10 text-gray-400 border-gray-500/30 hover:text-[#39ff14]"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </button>
      <button
        onClick={handleDelete}
        className="text-xs px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
      >
        Delete
      </button>
    </div>
  )
}
