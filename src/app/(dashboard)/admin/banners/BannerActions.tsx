"use client"

import { useState } from "react"
import { toggleBanner, deleteBanner } from "@/app/actions/banners"
import { BannerForm } from "@/components/admin/BannerForm"
import type { Banner } from "@/types"

export function BannerActions({ banner }: { banner: Banner }) {
  const [active, setActive] = useState(banner.is_active)
  const [editing, setEditing] = useState(false)

  async function handleToggle() {
    const newVal = !active
    setActive(newVal)
    try { await toggleBanner(banner.id) }
    catch { setActive(active) }
  }

  async function handleDelete() {
    if (!confirm("Delete this banner?")) return
    try { await deleteBanner(banner.id) }
    catch { alert("Failed to delete") }
  }

  if (editing) {
    return (
      <div className="min-w-[300px]">
        <BannerForm
          initialData={banner}
          onClose={() => setEditing(false)}
        />
      </div>
    )
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
        onClick={() => setEditing(true)}
        className="text-xs px-2 py-1 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition"
      >
        Edit
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
