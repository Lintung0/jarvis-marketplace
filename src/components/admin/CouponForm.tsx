"use client"

import { useState } from "react"
import { createCoupon } from "@/app/actions/coupons"

export function CouponForm() {
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [minOrder, setMinOrder] = useState("0")
  const [maxUses, setMaxUses] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createCoupon({
        code,
        type,
        value: parseInt(value),
        min_order: parseInt(minOrder),
        max_uses: maxUses ? parseInt(maxUses) : null,
        expires_at: expiresAt || null,
      })
      setCode("")
      setType("percentage")
      setValue("")
      setMinOrder("0")
      setMaxUses("")
      setExpiresAt("")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal membuat kupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 mb-4">Create Coupon</h2>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DISKON50"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none uppercase"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (Rp)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">
            Value {type === "percentage" ? "(%)" : "(Rp)"}
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "percentage" ? "10" : "50000"}
            required
            type="number"
            min="0"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Min Order (Rp)</label>
          <input
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            type="number"
            min="0"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Max Uses (leave empty for unlimited)</label>
          <input
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            type="number"
            min="0"
            placeholder="Unlimited"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Expires At</label>
          <input
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            type="datetime-local"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  )
}
