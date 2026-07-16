"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { Trash2, Package } from "lucide-react";
import type { ClientCartItem } from "@/types";

interface CartItemProps {
  item: ClientCartItem;
}

export default function CartItemCard({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-teal-500/40 transition-colors shadow-sm">
      {/* Image */}
      <Link href={`/products/${item.product_slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
        {item.product_image ? (
          <Image
            src={item.product_image}
            alt={item.product_title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product_slug}`} className="font-semibold text-gray-900 hover:text-teal-500 transition-colors line-clamp-2">
          {item.product_title}
        </Link>
        {item.options && Object.keys(item.options).length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {Object.entries(item.options).map(([key, val]) => `${key}: ${val}`).join(", ")}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2">
          <span className="text-lg font-bold text-teal-500">
            <PriceDisplay amount={item.price} />
          </span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="px-3 py-1 hover:bg-gray-100 transition"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
