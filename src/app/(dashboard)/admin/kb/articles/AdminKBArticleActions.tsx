"use client"

import { deleteKBArticle } from "@/app/actions/kb"

export function AdminKBArticleActions({ articleId, isPublished }: { articleId: string; isPublished: boolean }) {
  async function handleDelete() {
    if (!confirm("Delete this article?")) return
    try { await deleteKBArticle(articleId) }
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
