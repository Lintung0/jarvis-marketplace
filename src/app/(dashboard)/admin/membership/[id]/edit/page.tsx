import { createClient } from "@/lib/supabase/server"
import { adminUpdatePlan, getAllPlansAdmin } from "@/app/actions/membership"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plans = await getAllPlansAdmin()
  const plan = plans?.find((p: any) => p.id === id)
  if (!plan) redirect("/admin/membership")

  const featuresText = Array.isArray(plan.features) ? plan.features.join("\n") : ""

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/membership" className="text-sm text-teal-500 hover:text-teal-600 mb-2 inline-block">&larr; Back to Plans</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
        <p className="text-sm text-gray-500 mt-1">{plan.name}</p>
      </div>

      <form action={adminUpdatePlan.bind(null, plan.id)} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Plan Name</label>
            <input name="name" defaultValue={plan.name} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (IDR)</label>
            <input name="price" type="number" defaultValue={plan.price} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input name="description" defaultValue={plan.description ?? ""} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration (days)</label>
            <input name="duration_days" type="number" defaultValue={plan.duration_days} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Limit</label>
            <input name="product_limit" type="number" defaultValue={plan.product_limit} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Commission Rate (%)</label>
            <input name="commission_rate" type="number" step="0.01" defaultValue={plan.commission_rate} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Featured Products</label>
            <input name="featured_products" type="number" defaultValue={plan.featured_products} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Features (one per line)</label>
          <textarea
            name="features"
            rows={6}
            defaultValue={featuresText}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/membership" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition">Cancel</Link>
          <button type="submit" className="px-6 py-2 text-sm font-medium rounded-lg gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all">Update Plan</button>
        </div>
      </form>
    </div>
  )
}
