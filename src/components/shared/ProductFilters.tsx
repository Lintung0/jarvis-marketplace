"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Loader2 } from "lucide-react";
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
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

    function handleLocInput(val: string) {
      setLocInput(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!val.trim()) {
        setSuggestions([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d5d7246fcd0f40449b555b02d9de6643"}&limit=5&type=city&format=json&lang=id`
          );
          const data = await res.json();
          setSuggestions(data.results || []);
        } catch {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    }

    function selectLocation(name: string) {
      setLocInput(name);
      setSuggestions([]);
      updateFilter("location", name);
    }

    return (
        <aside className="space-y-6">
      {/* Filter Lokasi */}
      <div>
        <h3 className="text-sm font-semibold text-[#1e293b] mb-3">Lokasi</h3>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input
            value={locInput}
            onChange={(e) => handleLocInput(e.target.value)}
            placeholder="Cari lokasi..."
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-9 pr-9 py-2 text-sm focus:border-orange-400 outline-none"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
          {locInput && !loading && (
            <button
              type="button"
              onClick={() => { setLocInput(""); setSuggestions([]); updateFilter("location", ""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <ul className="bg-white rounded-xl shadow-xl border border-gray-200 mt-1 overflow-hidden">
            {suggestions.map((r: any, i: number) => {
              const name = r.city || r.formatted.split(",")[0]?.trim() || r.formatted;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => selectLocation(name)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{name}</p>
                      <p className="text-xs text-gray-400">{r.formatted}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {activeLocation && suggestions.length === 0 && (
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