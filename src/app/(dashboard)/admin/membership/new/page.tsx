import { createClient } from "@/lib/supabase/server"
import { adminCreatePlan } from "@/app/actions/membership"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function NewPlanPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/membership" className="text-sm text-teal-500 hover:text-teal-600 mb-2 inline-block">&larr; Back to Plans</Link>
        <h1 className="text-2xl font-bold text-gray-900">New Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new membership plan</p>
      </div>

      <form action={adminCreatePlan} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Plan Name</label>
            <input name="name" required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (IDR)</label>
            <input name="price" type="number" required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input name="description" className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration (days)</label>
            <input name="duration_days" type="number" defaultValue={30} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Limit</label>
            <input name="product_limit" type="number" defaultValue={5} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Commission Rate (%)</label>
            <input name="commission_rate" type="number" step="0.01" defaultValue={5} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Featured Products</label>
            <input name="featured_products" type="number" defaultValue={0} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Features (one per line)</label>
          <textarea
            name="features"
            rows={6}
            placeholder="5 produk aktif&#10;0 produk featured&#10;Komisi 5% per penjualan"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/membership" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition">Cancel</Link>
          <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all">Create Plan</button>
        </div>
      </form>
    </div>
  )
}
