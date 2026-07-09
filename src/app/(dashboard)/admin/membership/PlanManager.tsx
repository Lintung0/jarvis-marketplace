"use client"

import { useState } from "react"
import { MembershipPlan } from "@/types"
import { adminTogglePlan, adminCreatePlan, adminDeletePlan } from "@/app/actions/membership"
import { useRouter } from "next/navigation"
import { Edit3, Trash2, Plus, Check, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Props {
  plans: MembershipPlan[]
}

export default function PlanManager({ plans }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function togglePlan(planId: string, current: boolean) {
    await adminTogglePlan(planId, !current)
    router.refresh()
  }

  async function deletePlan(planId: string) {
    if (!confirm("Are you sure you want to delete this plan?")) return
    await adminDeletePlan(planId)
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="gradient-brand text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      {showForm && (
        <PlanForm
          onSubmit={async (formData) => {
            await adminCreatePlan(formData)
            setShowForm(false)
            router.refresh()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Product Limit</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Commission</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{plan.name}</td>
                <td className="py-3 px-4">{formatCurrency(plan.price)}</td>
                <td className="py-3 px-4">{plan.duration_days} days</td>
                <td className="py-3 px-4">{plan.product_limit >= 999999 ? "Unlimited" : plan.product_limit}</td>
                <td className="py-3 px-4">{plan.commission_rate}%</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => togglePlan(plan.id, plan.is_active)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      plan.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {plan.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {plan.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingId(editingId === plan.id ? null : plan.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlanForm({
  onSubmit,
  onCancel,
  initial,
}: {
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  initial?: MembershipPlan
}) {
  return (
    <form
      action={onSubmit}
      className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={initial?.price ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
          <input
            name="duration_days"
            type="number"
            required
            defaultValue={initial?.duration_days ?? 30}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Limit</label>
          <input
            name="product_limit"
            type="number"
            required
            defaultValue={initial?.product_limit ?? 5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Products</label>
          <input
            name="featured_products"
            type="number"
            required
            defaultValue={initial?.featured_products ?? 0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
          <input
            name="commission_rate"
            type="number"
            step="0.01"
            required
            defaultValue={initial?.commission_rate ?? 5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initial?.description ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features (one per line)
        </label>
        <textarea
          name="features"
          rows={4}
          defaultValue={(initial?.features as string[])?.join("\n") ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="gradient-brand text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {initial ? "Update Plan" : "Create Plan"}
        </button>
      </div>
    </form>
  )
}
