import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";

const categoryImages: Record<string, string> = {
  "clothing": "https://modesy.codingest.com/uploads/category/category_64fa3284422356-62618554.webp",
  "home-living": "https://modesy.codingest.com/uploads/category/category_64fa32d947a2c2-95720633.webp",
  "toys-entertainment": "https://modesy.codingest.com/uploads/category/category_64fa33016cd3d5-22961515.webp",
  "womens-clothing": "https://modesy.codingest.com/uploads/category/category_64fa33130537d7-29441060.webp",
  "mens-clothing": "https://modesy.codingest.com/uploads/category/category_64fa3334490a07-19765633.webp",
  "furniture": "https://modesy.codingest.com/uploads/category/category_64fa3341655123-11031908.webp",
  "necklaces-accessories": "https://modesy.codingest.com/uploads/category/category_64fa335861cdd2-08512447.webp",
  "graphics": "https://modesy.codingest.com/uploads/category/category_64fa33817aca32-54738529.webp",
  "graphics-photos": "https://modesy.codingest.com/uploads/category/category_64fa33817aca32-54738529.webp",
  "painting": "https://modesy.codingest.com/uploads/category/category_64fa33c32d65d7-74266909.webp",
  "boots": "https://modesy.codingest.com/uploads/category/category_64fa33e7271260-26824134.webp",
  "decorative-pillows": "https://modesy.codingest.com/uploads/category/category_64fa33f6b755e4-34777699.webp",
  "handbags": "https://modesy.codingest.com/uploads/category/category_64fa340bbb1f36-33117053.webp",
  "shoes": "https://modesy.codingest.com/uploads/category/category_64fa33e7271260-26824134.webp",
};

export default async function CategoriesSection() {
  const { t, dict } = await getTranslation();
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .is("parent_id", null)
    .order("name")
    .limit(12);

  if (!categories || categories.length === 0) return null;

  function catName(slug: string, fallback: string) {
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

  const displayCategories = categories.map((cat) => ({
    ...cat,
    imageUrl: categoryImages[cat.slug] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    translatedName: catName(cat.slug, cat.name),
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("categories.title") || "Shop By Category"}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{t("categories.subtitle") || "Browse our top categories"}</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
          {t("categories.view_all") || "View All"} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative border border-gray-100 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md">
              <Image
                src={cat.imageUrl}
                alt={cat.translatedName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
              <div className="absolute inset-0 bg-[#00a99d]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  Shop Now
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-teal-600 transition-colors text-center max-w-[120px] line-clamp-2">
              {cat.translatedName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
