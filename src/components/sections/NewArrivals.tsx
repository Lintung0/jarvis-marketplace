import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import type { Product } from "@/types";
import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";

export default async function NewArrivals() {
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

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
          <p className="text-gray-500 text-sm mt-0.5">Check out the latest products added by our vendors.</p>
        </div>
        <Link href="/products?sort=newest" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(products as unknown as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
