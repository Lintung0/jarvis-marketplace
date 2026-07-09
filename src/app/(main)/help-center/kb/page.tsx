import Link from "next/link"
import { getPublishedCategories } from "@/app/actions/kb"
import { Search, BookOpen, ChevronRight } from "lucide-react"

export default async function KnowledgeBasePage() {
  const categories = await getPublishedCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="gradient-brand rounded-2xl p-8 md:p-12 text-white mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">Knowledge Base</h1>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          Cari panduan, tutorial, dan informasi lengkap seputar JarvisMarketplace.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            className="w-full bg-white text-gray-900 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/help-center/kb/${cat.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-orange-200 transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {cat.kb_articles?.[0]?.count ?? 0} artikel
                </p>
              </div>
              <BookOpen className="w-5 h-5 text-orange-400 shrink-0 mt-1" />
            </div>
          </Link>
        ))}
        {categories.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada kategori</p>
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link
          href="/help-center"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Kembali ke Pusat Bantuan
        </Link>
      </div>
    </div>
  )
}
