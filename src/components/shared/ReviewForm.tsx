"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Props {
  productId: string
}

export default function ReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a rating!")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        review_text: comment || null,
        is_approved: false,
      })

      if (error) throw error
      toast.success("Review submitted! Waiting for approval.")
      setRating(0)
      setComment("")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition hover:scale-110"
          >
            <Star
              className={`w-7 h-7 ${
                star <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {rating > 0 ? `${rating}/5` : "Click to rate"}
        </span>
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#ff6b35] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#e55a2b] transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}