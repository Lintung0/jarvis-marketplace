import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import BrandLogo from "@/components/shared/BrandLogo";
import type { Brand } from "@/types";

export default async function BrandCarousel() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name")
    .limit(10);

  if (!brands || brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shop By Brand</h2>
          <p className="text-gray-500 text-sm mt-0.5 font-normal">Featured brands on our marketplace</p>
        </div>
        <Link href="/brands" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View All &rarr;
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {(brands as unknown as Brand[]).map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-2xl bg-white hover:shadow-md hover:border-teal-100 transition-all w-32 group cursor-pointer"
          >
            <div className="w-16 h-16 relative flex items-center justify-center mb-2">
              <BrandLogo name={brand.name} logo_url={brand.logo_url} />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-teal-600 transition-colors text-center leading-tight">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
