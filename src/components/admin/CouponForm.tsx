"use client"

import { useState } from "react"
import { createCoupon } from "@/app/actions/coupons"

export function CouponForm() {
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [minOrder, setMinOrder] = useState("0")
  const [maxUses, setMaxUses] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const start_at = startDate ? `${startDate}T00:00:00Z` : null
      const expires_at = endDate ? `${endDate}T23:59:59Z` : null

      if (start_at && expires_at && new Date(start_at) >= new Date(expires_at)) {
        throw new Error("End date must be after start date")
      }

      await createCoupon({
        code,
        type,
        value: parseFloat(value),
        min_order: parseFloat(minOrder),
        max_uses: maxUses ? parseInt(maxUses, 10) : null,
        start_at,
        expires_at,
      })
      setCode("")
      setType("percentage")
      setValue("")
      setMinOrder("0")
      setMaxUses("")
      setStartDate("")
      setEndDate("")
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
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DISKON50"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none uppercase"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
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
          <label className="text-sm font-medium text-gray-700 block mb-1">
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
          <label className="text-sm font-medium text-gray-700 block mb-1">Min Order (Rp)</label>
          <input
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            type="number"
            min="0"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Max Uses (leave empty for unlimited)</label>
          <input
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            type="number"
            min="0"
            placeholder="Unlimited"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
            />
          </div>
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
