"use client"

import { useState, useEffect } from "react"
import { createKBArticle } from "@/app/actions/kb"
import { createClient } from "@/lib/supabase/client"
import { generateBlogPost } from "@/app/actions/ai"

export function KBArticleForm() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [aiKeywords, setAiKeywords] = useState("")
  const [aiTone, setAiTone] = useState("professional")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase.from("kb_categories").select("*").order("sort_order")
      if (error) {
        console.warn("Failed to load KB categories:", error.message)
      }
      setCategories(data ?? [])
      if (data && data.length > 0) setCategoryId(data[0].id)
    }
    load()
  }, [])

  async function handleGenerateContent() {
    if (!title) {
      setError("Please enter a title first")
      return
    }
    setAiLoading(true)
    setError(null)
    try {
      const result = await generateBlogPost({
        title,
        keywords: aiKeywords || undefined,
        tone: aiTone,
      })
      setContent(result)
      setShowAiDialog(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const formData = new FormData()
      formData.set("title", title)
      formData.set("excerpt", excerpt)
      formData.set("content", content)
      formData.set("category_id", categoryId)
      formData.set("is_published", String(isPublished))
      await createKBArticle(formData)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 mb-4">Add New Article</h2>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Excerpt</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Content</label>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Article content (supports plain text)"
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none resize-none"
            />
            <button
              type="button"
              onClick={() => setShowAiDialog(true)}
              className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Generate with AI
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">Publish immediately</span>
        </label>
        {showAiDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAiDialog(false)}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-gray-900 mb-4">Generate Content with AI</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Keywords (optional)</label>
                  <input
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    placeholder="e.g. tips, tutorial, 2024"
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Tone</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAiDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={aiLoading}
                    className="px-4 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all"
        >
          Create Article
        </button>
      </form>
    </div>
  )
}
