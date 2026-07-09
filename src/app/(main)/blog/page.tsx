import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*, author: profiles (full_name, avatar_url, username)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blog</h1>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-400 text-sm">Belum ada artikel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(posts as unknown as BlogPost[]).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {post.cover_image && (
                <div className="relative aspect-video overflow-hidden bg-gray-50">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-orange-500 font-medium mb-1">
                  {new Date(post.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <h2 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-500 transition">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
                {post.author && (
                  <p className="text-xs text-gray-400 mt-3">
                    oleh {post.author.full_name ?? post.author.username}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
