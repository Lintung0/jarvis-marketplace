import { createClient, createAdminClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"

const VendorOrdersTable = dynamic(() => import("@/components/dashboard/VendorOrdersTable"))

export default async function VendorOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: orderItems } = await admin
    .from("order_items")
    .select("*, order: orders(id, status, total, created_at, buyer_id)")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Incoming Orders</h1>
        <p className="text-sm text-gray-500">{orderItems?.length ?? 0} order items</p>
      </div>

      {!orderItems || orderItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">🛒</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Orders will appear here when customers purchase your products.</p>
        </div>
      ) : (
        <VendorOrdersTable initialData={orderItems as any} vendorId={user.id} />
      )}
    </div>
  )
}
