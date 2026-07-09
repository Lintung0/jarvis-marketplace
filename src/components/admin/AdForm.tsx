"use client"

import { useState } from "react"
import { createAd, updateAd } from "@/app/actions/ads"
import type { AdSpace } from "@/types"

interface AdFormProps {
  initialData?: AdSpace
  onClose?: () => void
}

export function AdForm({ initialData, onClose }: AdFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [placement, setPlacement] = useState<string>(initialData?.placement ?? "header")
  const [code, setCode] = useState(initialData?.code ?? "")
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        name,
        placement,
        code,
        sort_order: parseInt(sortOrder) || 0,
      }

      if (initialData) {
        await updateAd(initialData.id, payload)
        onClose?.()
      } else {
        await createAd(payload)
        setName("")
        setPlacement("header")
        setCode("")
        setSortOrder("0")
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save ad")
    } finally {
      setLoading(false)
    }
  }

  const placements = ["header", "footer", "sidebar", "between_products"]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">
          {initialData ? "Edit Ad Space" : "Add New Ad Space"}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Header Banner Ad"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Placement</label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          >
            {placements.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Ad Code (HTML/JS)</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="<script>...</script> or <ins>...</ins>"
            rows={5}
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none font-mono"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Sort Order</label>
          <input
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            type="number"
            min="0"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : initialData ? "Update Ad Space" : "Create Ad Space"}
        </button>
      </form>
    </div>
  )
}
