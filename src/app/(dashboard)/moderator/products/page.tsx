import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { StatusBadge } from "@/components/dashboard/StatsCard"
import { formatCurrency } from "@/lib/utils"

export default async function ModeratorProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from("products")
    .select("*, vendor: profiles(full_name, username), images: product_images(url, is_primary)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Products Pending Review</h1>

      {!products || products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">✅</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-500">No products pending review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500">by {p.vendor?.full_name ?? p.vendor?.username ?? "Unknown"}</p>
                <p className="text-sm font-semibold text-teal-500 mt-1">{formatCurrency(p.price)}</p>
              </div>
              <div className="flex gap-2">
                <form action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.from("products").update({ status: "active" }).eq("id", p.id)
                }}>
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition">Approve</button>
                </form>
                <form action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.from("products").update({ status: "rejected" }).eq("id", p.id)
                }}>
                  <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition">Reject</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}