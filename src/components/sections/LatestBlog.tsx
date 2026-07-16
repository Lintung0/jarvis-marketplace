import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function LatestBlog() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*, author: profiles (full_name, avatar_url, username)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Latest Blog Posts</h2>
          <p className="text-gray-500 text-sm mt-0.5">Explore guides, tips, and articles from our editors.</p>
        </div>
        <Link href="/blog" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(posts as unknown as BlogPost[]).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
          >
            {post.cover_image && (
              <div className="relative aspect-video w-full overflow-hidden bg-gray-50">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400">
                <span>By {post.author?.full_name ?? post.author?.username ?? "Admin"}</span>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
