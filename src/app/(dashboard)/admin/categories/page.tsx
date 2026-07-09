import { createClient } from "@/lib/supabase/server"
import { AdminCategoryActions } from "./AdminCategoryActions"
import { CategoryForm } from "./CategoryForm"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*, parent: categories!parent_id(name)")
    .order("name")

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Icon</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Slug</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Parent</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Active</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories?.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xl">{cat.icon || "📁"}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.parent?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cat.is_active ? "bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                          {cat.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminCategoryActions categoryId={cat.id} isActive={cat.is_active} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <CategoryForm />
        </div>
      </div>
    </div>
  )
}
