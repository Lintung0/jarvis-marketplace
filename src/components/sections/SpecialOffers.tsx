import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import type { Product } from "@/types";
import ProductCard from "@/components/shared/ProductCard";

export default async function SpecialOffers() {
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
    .not("sale_price", "is", null)
    .order("created_at", { ascending: false })
    .limit(8);

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Special Offers</h2>
        <p className="text-gray-500 text-sm mt-0.5">Explore deals, discounts and on-sale items.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(products as unknown as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
