"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { MapPin } from "lucide-react";
import type { Category } from "@/types";

interface Props {
    categories: Category[];
    activeCategory?: string;
    activeLocation?: string;
}

function catName(t: (key: string) => string, slug: string, fallback: string) {
  const translated = t("categories.slugs." + slug);
  return translated !== "categories.slugs." + slug ? translated : fallback;
}

export default function ProductFilters({ categories, activeCategory, activeLocation }: Props ) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname= usePathname();
    const searchParams = useSearchParams();
    const [locInput, setLocInput] = useState(activeLocation || "");

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

    function handleLocationSearch(e: React.FormEvent) {
      e.preventDefault();
      updateFilter("location", locInput.trim());
    }

    return (
        <aside className="space-y-6">
      {/* Filter Lokasi */}
      <div>
        <h3 className="text-sm font-semibold text-[#1e293b] mb-3">Lokasi</h3>
        <form onSubmit={handleLocationSearch} className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={locInput}
            onChange={(e) => setLocInput(e.target.value)}
            placeholder="Cari lokasi..."
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-9 pr-9 py-2 text-sm focus:border-orange-400 outline-none"
          />
          {locInput && (
            <button
              type="button"
              onClick={() => { setLocInput(""); updateFilter("location", ""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </form>
        {activeLocation && (
          <p className="text-xs text-orange-500 mt-1 font-medium">
            Filter: {activeLocation}
          </p>
        )}
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