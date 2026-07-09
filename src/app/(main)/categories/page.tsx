import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/lib/i18n/server";
import type { Category } from "@/types";

function catName(dict: Record<string, unknown>, slug: string, fallback: string) {
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

export default async function CategoriesPage() {
  const { t, dict } = await getTranslation();
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, children: categories!parent_id (id, name, slug, icon)")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("name");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("categories.all_categories")}</h1>

      {!categories || categories.length === 0 ? (
        <p className="text-gray-400 text-sm">{t("categories.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(categories as unknown as Category[]).map((cat) => (
            <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <Link
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 mb-3 group"
              >
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <h2 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                  {catName(dict, cat.slug, cat.name)}
                </h2>
              </Link>

              {cat.children && cat.children.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/categories/${sub.slug}`}
                      className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition"
                    >
                      {sub.icon && <span className="mr-1">{sub.icon}</span>}
                      {catName(dict, sub.slug, sub.name)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
