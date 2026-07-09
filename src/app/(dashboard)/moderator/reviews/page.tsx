import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export default async function ModeratorReviewsPage() {
  const adminSupabase = createAdminClient()
  
  const { data: reviews } = await adminSupabase
    .from("product_reviews")
    .select("*, profiles!user_id(full_name, username), products!product_id(title, slug)")
    .eq("is_approved", false)
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Moderation</h1>

      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">✅</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Reviews Approved</h3>
          <p className="text-gray-500">No reviews pending moderation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{r.profiles?.full_name ?? r.profiles?.username ?? "Anonymous"}</p>
                  <p className="text-xs text-gray-500">on {r.products?.title ?? "Unknown product"}</p>
                </div>
                <div className="flex gap-2">
                  <form action={async () => {
                    "use server"
                    const supabase = createAdminClient()
                    await supabase.from("product_reviews").update({ is_approved: true }).eq("id", r.id)
                    revalidatePath("/moderator/reviews")
                  }}>
                    <button type="submit" className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition">Approve</button>
                  </form>
                  <form action={async () => {
                    "use server"
                    const supabase = createAdminClient()
                    await supabase.from("product_reviews").delete().eq("id", r.id)
                    revalidatePath("/moderator/reviews")
                  }}>
                    <button type="submit" className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition">Delete</button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-gray-400">{r.review_text || "No comment"}</p>
              <p className="text-xs text-gray-400 mt-2">Rating: {"⭐".repeat(r.rating)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}