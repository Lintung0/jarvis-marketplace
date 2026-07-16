import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import ProductGrid from "@/components/shared/ProductGrid";
import ProductFilters from "@/components/shared/ProductFilters";
import SortSelect from "@/components/shared/SortSelect";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";
import AdSlot from "@/components/shared/AdSlot";
import type { Product, Category } from "@/types";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    brand?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q, category, type, brand, location, sort = "newest", page = "1" } = await searchParams;

  const supabase = await createClient();
  const pageSize = 20;
  const currentPage = Math.max(1, parseInt(page));
  const offset = (currentPage - 1) * pageSize;

  // Fetch categories untuk filter
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("name");

  const activeVendorIds = await getActiveVendorIds(supabase);

  // Build query produk
  let query = supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url)`,
      { count: "exact" }
    )
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null]);

  // Filter search
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  // Filter type
  if (type) {
    query = query.eq("type", type);
  }

  // Filter lokasi
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  // Filter brand
  if (brand) {
    const { data: br } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brand)
      .single();
    if (br) {
      query = query.eq("brand_id", br.id);
    }
  }

  // Filter kategori
  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  // Sort
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("sold_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data: products, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / pageSize);

  const chunkSize = 8;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Hasil pencarian: "${q}"` : location ? `Produk di "${location}"` : "Semua Produk"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {count ?? 0} produk ditemukan
        </p>
      </div>

      {/* Sort only */}
      <div className="flex justify-end mb-6">
        <Suspense>
          <SortSelect current={sort} />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filter */}
        <div className="hidden lg:block w-52 flex-shrink-0 sticky top-24 self-start">
          <Suspense>
            <ProductFilters
              categories={(categories ?? []) as Category[]}
              activeCategory={category}
              activeLocation={location}
            />
          </Suspense>
        </div>

        {/* Product Grid + Pagination */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            {(() => {
              const items = products ?? [];
              const chunks: Product[][] = [];
              for (let i = 0; i < items.length; i += chunkSize) {
                chunks.push(items.slice(i, i + chunkSize) as unknown as Product[]);
              }
              return chunks.map((chunk, idx) => (
                <div key={idx}>
                  <ProductGrid products={chunk} />
                  {idx < chunks.length - 1 && (
                    <div className="my-6">
                      <AdSlot placement="between_products" />
                    </div>
                  )}
                </div>
              ));
            })()}
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <Suspense>
              <Pagination current={currentPage} total={totalPages} searchParams={{ q, category, type, brand, location, sort }} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number;
  total: number;
  searchParams: Record<string, string | undefined>;
}) {
  function buildUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  }

  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 2
  );

  return (
    <div className="flex justify-center gap-2 mt-8">
      {pages.map((page, idx) => {
        const prev = pages[idx - 1];
        return (
          <div key={page} className="flex items-center gap-2">
            {prev && page - prev > 1 && (
              <span className="text-gray-400 px-1">...</span>
            )}
            <a
              href={buildUrl(page)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${
                page === current
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50"
              }`}
            >
              {page}
            </a>
          </div>
        );
      })}
    </div>
  );
}
