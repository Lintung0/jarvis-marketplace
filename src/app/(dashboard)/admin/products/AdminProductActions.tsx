"use client"

import { useState } from "react"
import { adminUpdateProductStatus, adminDeleteProduct, toggleFeaturedProduct } from "@/app/actions/products"

const statuses = ["active", "pending", "hidden", "draft", "rejected"]

export function AdminProductActions({ productId, currentStatus }: { productId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [deleting, setDeleting] = useState(false)

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setStatus(newStatus)
    try {
      await adminUpdateProductStatus(productId, newStatus)
    } catch {
      setStatus(currentStatus)
      alert("Failed to update status")
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this product?")) return
    setDeleting(true)
    try {
      await adminDeleteProduct(productId)
    } catch {
      alert("Failed to delete")
    }
    setDeleting(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        className="bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1 text-xs focus:border-orange-400 outline-none"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  )
}

export function FeaturedToggle({ productId, isFeatured }: { productId: string; isFeatured: boolean }) {
  const [featured, setFeatured] = useState(isFeatured)
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    setToggling(true)
    try {
      await toggleFeaturedProduct(productId)
      setFeatured(!featured)
    } catch {
      alert("Failed to toggle featured")
    }
    setToggling(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
      title={featured ? "Remove from featured" : "Mark as featured"}
    >
      <svg
        className={`w-5 h-5 ${featured ? "text-[#ff6b35]" : "text-gray-400"}`}
        fill={featured ? "#ff6b35" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={featured ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    </button>
  )
}
