"use client"

import { useState } from "react"
import { createCategory } from "@/app/actions/categories"

export function CategoryForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const formData = new FormData()
      formData.set("name", name)
      formData.set("description", description)
      formData.set("icon", icon)
      await createCategory(formData)
      setName("")
      setDescription("")
      setIcon("")
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-gray-900 mb-4">Add New Category</h2>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Category description"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">Icon (emoji)</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="📁"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all"
        >
          Create Category
        </button>
      </form>
    </div>
  )
}
