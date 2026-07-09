"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import type { Category } from "@/types";

interface Props {
    categories: Category[];
    brands?: { id: string; name: string; slug: string }[];
    activeCategory?: string;
    activeType?: string;
    activeBrand?: string;
}

function catName(t: (key: string) => string, slug: string, fallback: string) {
  const translated = t("categories.slugs." + slug);
  return translated !== "categories.slugs." + slug ? translated : fallback;
}

export default function ProductFilters({ categories, brands = [], activeCategory, activeType, activeBrand }: Props ) {
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
        <h3 className="text-sm font-semibold text-gray-200 mb-3">{t("products.product_type_label")}</h3>
        <div className="space-y-1.5">
          {productTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilter("type", type.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                (activeType ?? "") === type.value
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-gray-400 hover:bg-[#0d0d1a]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Brand */}
      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-3">{t("products.brand")}</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("brand", "")}
            className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
              !activeBrand
                ? "bg-indigo-600 text-white font-medium"
                : "text-gray-400 hover:bg-[#0d0d1a]"
            }`}
          >
            {t("products.all_brands")}
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => updateFilter("brand", brand.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                activeBrand === brand.slug
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-gray-400 hover:bg-[#0d0d1a]"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Kategori */}
      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-3">{t("products.category")}</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("category", "")}
            className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
              !activeCategory
                ? "bg-indigo-600 text-white font-medium"
                : "text-gray-400 hover:bg-[#0d0d1a]"
            }`}
          >
            {t("categories.all_categories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                activeCategory === cat.slug
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-gray-400 hover:bg-[#0d0d1a]"
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