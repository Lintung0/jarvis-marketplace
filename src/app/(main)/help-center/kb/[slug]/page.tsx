import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getPublishedArticlesByCategory } from "@/app/actions/kb"
import { FileText, ChevronRight, ArrowLeft } from "lucide-react"

export default async function KBCategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const articles = await getPublishedArticlesByCategory(category.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/help-center" className="hover:text-orange-600 transition">Pusat Bantuan</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/help-center/kb" className="hover:text-orange-600 transition">Knowledge Base</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{category.name}</span>
      </div>

      {/* Header */}
      <div className="gradient-brand rounded-2xl p-8 text-white mb-8">
        <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-white/80 text-sm">{category.description}</p>
        )}
        <p className="text-white/60 text-xs mt-2">{articles.length} artikel</p>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {articles.map((article: any) => (
          <Link
            key={article.id}
            href={`/help-center/kb/articles/${article.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-orange-200 transition"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-500 mt-1">{article.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {article.views} x dilihat
                </p>
              </div>
            </div>
          </Link>
        ))}
        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-2xl">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada artikel di kategori ini</p>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/help-center/kb"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Knowledge Base
        </Link>
      </div>
    </div>
  )
}
