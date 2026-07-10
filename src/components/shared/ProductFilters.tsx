"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import type { Category } from "@/types";

interface Props {
    categories: Category[];
    activeCategory?: string;
}

function catName(t: (key: string) => string, slug: string, fallback: string) {
  const translated = t("categories.slugs." + slug);
  return translated !== "categories.slugs." + slug ? translated : fallback;
}

export default function ProductFilters({ categories, activeCategory }: Props ) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname= usePathname();
    const searchParams = useSearchParams();

    function updateFilter(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key)
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <aside className="space-y-6">
      {/* Filter Kategori */}
      <div>
        <h3 className="text-sm font-semibold text-[#1e293b] mb-3">{t("products.category")}</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug === activeCategory ? "" : cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                activeCategory === cat.slug
                  ? "bg-orange-500 text-white font-medium"
                  : "text-gray-700 hover:bg-orange-50"
              }`}
            >
              {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
              {catName(t, cat.slug, cat.name)}
            </button>
          ))}
        </div>
      </div>
    </aside>
    );
}