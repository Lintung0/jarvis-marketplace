import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import { getActiveVendorIds } from "@/lib/queries";
import ProductGrid from "@/components/shared/ProductGrid";
import SortSelect from "@/components/shared/SortSelect";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";
import { generateMeta } from "@/lib/seo";
import type { Product, Category } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, description, image_url")
    .eq("slug", slug)
    .single();

  if (!category) return {};

  return generateMeta({
    title: category.name,
    description: category.description?.slice(0, 160) ?? `Produk di kategori ${category.name} | JarvisMarketplace`,
    image: category.image_url,
    path: `/categories/${slug}`,
  });
}

function catFromDict(dict: Record<string, unknown>, slug: string, fallback: string) {
  const key = `categories.slugs.${slug}`;
  const keys = key.split(".");
  let current: unknown = dict;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      current = undefined;
      break;
    }
  }
  return typeof current === "string" ? current : fallback;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { q, sort = "newest", page = "1" } = await searchParams;

  const { t, dict } = await getTranslation();
  const supabase = await createClient();
  const activeVendorIds = await getActiveVendorIds(supabase);
  const pageSize = 20;
  const currentPage = Math.max(1, parseInt(page));
  const offset = (currentPage - 1) * pageSize;

  // Fetch kategori
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description, icon, image_url")
    .eq("slug", slug)
    .single();

  if (!category) return notFound();

  const translatedName = catFromDict(dict, category.slug, category.name);

  // Fetch sub-categories
  const { data: subCategories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .eq("parent_id", category.id)
    .eq("is_active", true)
    .order("name");

  // Build query produk
  let query = supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary, sort_order),
      vendor: profiles (id, username, full_name, avatar_url)`,
      { count: "exact" }
    )
    .eq("status", "active")
    .eq("category_id", category.id)
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null]);

  if (q) query = query.ilike("title", `%${q}%`);

  switch (sort) {
    case "price_asc":  query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "popular":    query = query.order("sold_count", { ascending: false }); break;
    default:           query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header Kategori */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          {(category as Category).icon && (
            <span className="text-2xl">{(category as Category).icon}</span>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{translatedName}</h1>
        </div>
        {category.description && (
          <p className="text-sm text-gray-500">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">{t("categories.product_count", { count: count ?? 0 })}</p>
      </div>

      {/* Sub-categories */}
      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {subCategories.map((sub) => (
            <a
              key={sub.id}
              href={`/categories/${sub.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
            >
              {sub.icon && <span>{sub.icon}</span>}
              {catFromDict(dict, sub.slug, sub.name)}
            </a>
          ))}
        </div>
      )}

      {/* Sort only */}
      <div className="flex justify-end mb-6">
        <Suspense>
          <SortSelect current={sort} />
        </Suspense>
      </div>

      {/* Products */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductGrid
          products={(products ?? []) as unknown as Product[]}
          emptyMessage={t("categories.empty_products", { name: translatedName })}
        />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/categories/${slug}?page=${p}${q ? `&q=${q}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}`}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${
                p === currentPage
                  ? "bg-[#ff6b35] text-white"
                  : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
