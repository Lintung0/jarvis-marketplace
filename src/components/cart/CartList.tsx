"use client";

import CartItemCard from "@/components/shared/CartItem";
import type { ClientCartItem } from "@/types";

interface Props {
  items: ClientCartItem[];
}

export default function CartList({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
