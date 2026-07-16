import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import Link from "next/link";

const categoryColors: Record<string, string> = {
  Clothing: "#fff3e0",
  Shoes: "#e8f5e9",
  "Home & Living": "#e3f2fd",
  Jewelry: "#fce4ec",
  Electronics: "#ede7f6",
  Sports: "#e0f7fa",
  Toys: "#fff8e1",
  Books: "#efebe9",
};

const categoryCounts: Record<string, string> = {
  Clothing: "24.5k",
  Shoes: "18.2k",
  "Home & Living": "31.7k",
  Jewelry: "9.8k",
  Electronics: "15.3k",
  Sports: "11.4k",
  Toys: "7.6k",
  Books: "22.1k",
};

export default async function CategoriesSection() {
  const { t, dict } = await getTranslation();
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .is("parent_id", null)
    .order("name")
    .limit(8);

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
    emoji: cat.icon || "🏷️",
    bgColor: categoryColors[cat.name] || "#f3f4f6",
    count: categoryCounts[cat.name] || "",
    translatedName: catName(cat.slug, cat.name),
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("categories.title")}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{t("categories.subtitle")}</p>
        </div>
        <Link href="/categories" className="text-sm font-semibold text-teal-500 hover:text-teal-600 flex items-center gap-1">
          {t("categories.view_all")} →
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-transparent transition-all hover:shadow-md hover:scale-105 cursor-pointer group"
            style={{ background: cat.bgColor }}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{cat.translatedName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
