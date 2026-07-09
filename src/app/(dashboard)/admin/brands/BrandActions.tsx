"use client"

import { useState } from "react"
import { toggleBrand, deleteBrand } from "@/app/actions/brands"
import { BrandForm } from "@/components/admin/BrandForm"
import type { Brand } from "@/types"

export function BrandActions({ brand }: { brand: Brand }) {
  const [active, setActive] = useState(brand.is_active)
  const [editing, setEditing] = useState(false)

  async function handleToggle() {
    const newVal = !active
    setActive(newVal)
    try { await toggleBrand(brand.id) }
    catch { setActive(active) }
  }

  async function handleDelete() {
    if (!confirm("Delete this brand?")) return
    try { await deleteBrand(brand.id) }
    catch { alert("Failed to delete") }
  }

  if (editing) {
    return (
      <div className="min-w-[300px]">
        <BrandForm
          initialData={brand}
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
