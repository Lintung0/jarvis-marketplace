import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import type { Product } from "@/types";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  const supabase = await createClient();
  const activeVendorIds = await getActiveVendorIds(supabase);

  const { data: products } = await supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url)`
    )
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])
    .order("created_at", { ascending: false })
    .limit(8);

  if (!products || products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900">Produk Trending</h2>
        <p className="text-gray-500 text-sm mt-2">Belum ada produk tersedia.</p>
      </section>
    );
  }

  return <FeaturedProductsClient products={products as unknown as Product[]} />;
}
