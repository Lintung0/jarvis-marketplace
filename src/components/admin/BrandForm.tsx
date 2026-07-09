"use client"

import { useState } from "react"
import { createBrand, updateBrand } from "@/app/actions/brands"
import type { Brand } from "@/types"

interface BrandFormProps {
  initialData?: Brand
  onClose?: () => void
}

export function BrandForm({ initialData, onClose }: BrandFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url ?? "")
  const [website, setWebsite] = useState(initialData?.website ?? "")
  const [autoSlug, setAutoSlug] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (autoSlug) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: description || undefined,
        logo_url: logoUrl || undefined,
        website: website || undefined,
      }

      if (initialData) {
        await updateBrand(initialData.id, payload)
        onClose?.()
      } else {
        await createBrand(payload)
        setName("")
        setSlug("")
        setDescription("")
        setLogoUrl("")
        setWebsite("")
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save brand")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">
          {initialData ? "Edit Brand" : "Add New Brand"}
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
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Brand name"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">
            Slug
            <button
              type="button"
              onClick={() => setAutoSlug(!autoSlug)}
              className={`ml-2 text-xs px-2 py-0.5 rounded-full border transition ${
                autoSlug
                  ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
                  : "bg-gray-500/10 text-gray-400 border-gray-500/30"
              }`}
            >
              {autoSlug ? "Auto" : "Manual"}
            </button>
          </label>
          <input
            value={slug}
            onChange={(e) => { setAutoSlug(false); setSlug(e.target.value) }}
            placeholder="brand-name"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none font-mono"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brand description"
            rows={3}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Logo URL</label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
          {logoUrl && (
            <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Website</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://brand-website.com"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : initialData ? "Update Brand" : "Create Brand"}
        </button>
      </form>
    </div>
  )
}
