"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import type { Category } from "@/types";

interface Props {
    categories: Category[];
    activeCategory?: string;
    activeType?: string;
}

function catName(t: (key: string) => string, slug: string, fallback: string) {
  const translated = t("categories.slugs." + slug);
  return translated !== "categories.slugs." + slug ? translated : fallback;
}

export default function ProductFilters({ categories, activeCategory, activeType }: Props ) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname= usePathname();
    const searchParams = useSearchParams();

    const productTypes = [
      { value: "", label: t("products.all_types") },
      { value: "physical", label: t("products.physical") },
      { value: "digital", label: t("products.digital") },
      { value: "license_key", label: t("products.license_key") },
    ];

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
      {/* Filter Tipe */}
      <div>
        <h3 className="text-sm font-semibold text-[#1e293b] mb-3">{t("products.product_type_label")}</h3>
        <div className="space-y-1.5">
          {productTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilter("type", type.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                (activeType ?? "") === type.value
                  ? "bg-orange-500 text-white font-medium"
                  : "text-gray-700 hover:bg-orange-50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

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