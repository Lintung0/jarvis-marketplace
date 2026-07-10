import { createClient } from "@/lib/supabase/server"
import { AdminProductActions, FeaturedToggle } from "./AdminProductActions"
import { formatCurrency } from "@/lib/utils"
import { StatusBadge } from "@/components/dashboard/StatsCard"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, vendor: profiles(full_name, username), images: product_images(url, is_primary)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500">{products?.length ?? 0} products</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Vendor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Featured</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500">{p.vendor?.full_name ?? p.vendor?.username ?? "-"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(p.sale_price ?? p.price)}</td>
                  <td className="px-4 py-3">
                    <FeaturedToggle productId={p.id} isFeatured={p.is_featured ?? false} />
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3"><AdminProductActions productId={p.id} currentStatus={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
