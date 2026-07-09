"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch semua wishlist user saat mount
  useEffect(() => {
    async function fetchWishlist() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

      if (data) {
        setWishlistIds(new Set(data.map((w) => w.product_id)));
      }
    }
    fetchWishlist();
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const toggle = useCallback(async (productId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    const alreadyWishlisted = wishlistIds.has(productId);

    // Optimistic update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (alreadyWishlisted) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    if (alreadyWishlisted) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    } else {
      await supabase
        .from("wishlists")
        .insert({ user_id: user.id, product_id: productId });
    }

    setLoading(false);
  }, [wishlistIds]);

  return { isWishlisted, toggle, loading };
}