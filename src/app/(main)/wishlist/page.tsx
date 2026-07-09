import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shared/ProductGrid";
import type { Product } from "@/types";

export default async function WishlistPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: wishlists } = await supabase
    .from("wishlists")
    .select(`
      id,
      product: products (
        *,
        images: product_images (id, url, alt, is_primary),
        vendor: profiles (id, username, full_name, avatar_url)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (wishlists ?? [])
    .map((w) => w.product)
    .filter(Boolean) as unknown as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} produk</p>
        </div>
        <Link
          href="/products"
          className="text-sm text-orange-500 hover:underline"
        >
          Lanjut belanja →
        </Link>
      </div>

      <ProductGrid
        products={products}
        emptyMessage="Wishlist kamu masih kosong. Yuk tambahkan produk favorit!"
      />
    </div>
  );
}

