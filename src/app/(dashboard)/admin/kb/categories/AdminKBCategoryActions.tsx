"use client"

import { deleteKBCategory } from "@/app/actions/kb"

export function AdminKBCategoryActions({ categoryId }: { categoryId: string }) {
  async function handleDelete() {
    if (!confirm("Delete this category? Articles in it will also be deleted.")) return
    try { await deleteKBCategory(categoryId) }
    catch { alert("Failed to delete") }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDelete}
        className="text-xs px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
      >
        Delete
      </button>
    </div>
  )
}
