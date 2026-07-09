"use client"

import { VendorSubscription } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface Props {
  subscriptions: VendorSubscription[]
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  expired: "destructive",
  cancelled: "outline",
}

export default function SubscriptionList({ subscriptions }: Props) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No subscriptions yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Start Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">End Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{sub.vendor?.full_name ?? sub.vendor?.username ?? "Unknown"}</p>
                  <p className="text-xs text-gray-400">{sub.vendor?.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">{sub.plan?.name ?? "Unknown"}</td>
              <td className="py-3 px-4">
                <Badge variant={statusColors[sub.status] ?? "outline"}>
                  {sub.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(sub.start_date).toLocaleDateString("id-ID")}
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(sub.end_date).toLocaleDateString("id-ID")}
              </td>
              <td className="py-3 px-4">
                {sub.plan ? formatCurrency(sub.plan.price) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
