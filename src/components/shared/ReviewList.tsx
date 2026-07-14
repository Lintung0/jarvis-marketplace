import type { Review } from "@/types"

interface Props{
    reviews: Review[];
}

export default function ReviewList({ reviews }: Props ) {
    if (reviews.length === 0) return null ;

    return (
            <div className="mt-14">
      <h2 className="text-xl font-bold text-gray-200 mb-6">
        Ulasan ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-2xl border border-[#2a2a4a] bg-[#0d0d1a]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-sm">
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </span>
              <span className="text-sm font-medium text-gray-300">
                {review.user?.full_name ?? "Anonim"}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(review.created_at).toLocaleDateString("id-ID")}
              </span>
            </div>
            {review.review_text && (
              <p className="text-sm text-gray-400">{review.review_text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    );
}