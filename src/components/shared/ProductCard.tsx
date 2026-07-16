"use client"

import Link from "next/link";
import WishlistButton from "@/components/shared/WishlistButton";
import PriceDisplay from "@/components/ui/PriceDisplay";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const sorted = [...(product.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.url || "").localeCompare(b.url || "");
  });
  const primaryImageUrl = sorted[0]?.url;

  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const avgRating = product.avg_rating ?? 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-teal-100">
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-gray-50" style={{ height: 220 }}>
          <img
            src={primaryImageUrl || "/placeholder-product.png"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png"
            }}
          />
          {product.sale_price && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{discountPercent}%
            </span>
          )}
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {product.location ?? "Indonesia"}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-teal-500 transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={i <= Math.round(avgRating) ? "#f59e0b" : "none"}
              stroke={i <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex flex-col min-w-0">
            <PriceDisplay amount={product.sale_price ?? product.price} className="text-sm sm:text-base font-bold text-teal-600 truncate" />
            {product.sale_price && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through truncate">
                <PriceDisplay amount={product.price} />
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const cartItem = {
                id: `${product.id}-{}`,
                product_id: product.id.toString(),
                product_title: product.title,
                product_slug: product.slug,
                product_image: primaryImageUrl || "",
                product_type: product.type,
                vendor_id: product.vendor_id,
                price: product.sale_price ?? product.price,
                quantity: 1,
                options: {},
              };
              addItem(cartItem);
              toast.success("Ditambahkan ke keranjang!", {
                description: product.title,
              });
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm gradient-brand cursor-pointer shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        <Link href={`/vendors/${product.vendor?.username}`} className="block mt-2">
          <p className="text-xs text-gray-600">
            oleh <span className="text-teal-500 font-medium hover:underline">{product.vendor?.full_name ?? "Vendor"}</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
