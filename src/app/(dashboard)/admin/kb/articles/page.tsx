import { createClient } from "@/lib/supabase/server"
import { AdminKBArticleActions } from "./AdminKBArticleActions"
import { KBArticleForm } from "./KBArticleForm"

export default async function AdminKBArticlesPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!category_id(name)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KB Articles</h1>
          <p className="text-sm text-gray-500">{articles?.length ?? 0} articles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Views</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles?.map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{article.title}</td>
                      <td className="px-4 py-3 text-gray-500">{article.category?.name || "-"}</td>
                      <td className="px-4 py-3 text-gray-500">{article.views}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          article.is_published
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {article.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <AdminKBArticleActions articleId={article.id} isPublished={article.is_published} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <KBArticleForm />
        </div>
      </div>
    </div>
  )
}
