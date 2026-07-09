"use client"

import { useState } from "react"
import { createBanner, updateBanner } from "@/app/actions/banners"
import type { Banner } from "@/types"

interface BannerFormProps {
  initialData?: Banner
  onClose?: () => void
}

export function BannerForm({ initialData, onClose }: BannerFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "")
  const [link, setLink] = useState(initialData?.link ?? "")
  const [placement, setPlacement] = useState<string>(initialData?.placement ?? "hero")
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        title,
        image_url: imageUrl,
        link: link || undefined,
        placement,
        sort_order: parseInt(sortOrder) || 0,
      }

      if (initialData) {
        await updateBanner(initialData.id, payload)
        onClose?.()
      } else {
        await createBanner(payload)
        setTitle("")
        setImageUrl("")
        setLink("")
        setPlacement("hero")
        setSortOrder("0")
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save banner")
    } finally {
      setLoading(false)
    }
  }

  const placements = ["hero", "top", "middle", "bottom", "sidebar"]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">
          {initialData ? "Edit Banner" : "Add New Banner"}
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
          <label className="text-sm font-medium text-gray-300 block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summer Sale Banner"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
          {imageUrl && (
            <div className="mt-2 w-full h-24 rounded-lg overflow-hidden bg-gray-100">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Link (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/categories/clothing"
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
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
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
          {loading ? "Saving..." : initialData ? "Update Banner" : "Create Banner"}
        </button>
      </form>
    </div>
  )
}
