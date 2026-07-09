import { createClient } from "@/lib/supabase/server"
import { AdminKBCategoryActions } from "./AdminKBCategoryActions"
import { KBCategoryForm } from "./KBCategoryForm"

export default async function AdminKBCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(count)")
    .order("sort_order")

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KB Categories</h1>
          <p className="text-sm text-gray-500">{categories?.length ?? 0} categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Slug</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Articles</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Sort</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories?.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.kb_articles?.[0]?.count ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                      <td className="px-4 py-3">
                        <AdminKBCategoryActions categoryId={cat.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <KBCategoryForm />
        </div>
      </div>
    </div>
  )
}
