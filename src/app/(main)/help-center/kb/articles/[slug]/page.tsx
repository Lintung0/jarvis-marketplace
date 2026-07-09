import Link from "next/link"
import { notFound } from "next/navigation"
import { getArticleBySlug, getRelatedArticles, incrementViewCount } from "@/app/actions/kb"
import { ChevronRight, Eye, Clock, ArrowLeft } from "lucide-react"

export default async function KBArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const article: any = await getArticleBySlug(slug)
  if (!article) notFound()

  // Increment view count (fire-and-forget)
  incrementViewCount(article.id).catch(() => {})

  const related: any[] = await getRelatedArticles(article.category_id, article.id)

  const formattedDate = new Date(article.created_at).toLocaleDateString("id-ID", {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/help-center" className="hover:text-orange-600 transition">Pusat Bantuan</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link href="/help-center/kb" className="hover:text-orange-600 transition">Knowledge Base</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link href={`/help-center/kb/${article.category?.slug}`} className="hover:text-orange-600 transition">
          {article.category?.name}
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-gray-900 font-medium truncate">{article.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <article className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views} dilihat
              </span>
            </div>

            {article.excerpt && (
              <p className="text-gray-500 italic mb-6">{article.excerpt}</p>
            )}

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={`/help-center/kb/${article.category?.slug}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke {article.category?.name}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-3">Artikel Terkait</h3>
            {related.length > 0 ? (
              <ul className="space-y-3">
                {related.map((r: any) => (
                  <li key={r.id}>
                    <Link
                      href={`/help-center/kb/articles/${r.slug}`}
                      className="text-sm text-gray-600 hover:text-orange-600 transition line-clamp-2"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Tidak ada artikel terkait</p>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Tidak menemukan jawaban?</p>
              <Link
                href="/help-center/tickets/new"
                className="inline-block w-full text-center px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition"
              >
                Buat Tiket Support
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
