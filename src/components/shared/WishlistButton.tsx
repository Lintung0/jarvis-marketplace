"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  const { isWishlisted, toggle, loading } = useWishlist();
  const wishlisted = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      disabled={loading}
      className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-all hover:scale-110"
      aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart
        className="w-4 h-4"
        fill={wishlisted ? "#ff6b35" : "none"}
        stroke={wishlisted ? "#ff6b35" : "#9ca3af"}
        strokeWidth={2}
      />
    </button>
  );
}
