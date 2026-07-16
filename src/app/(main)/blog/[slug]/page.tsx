import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { generateMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { BlogPost } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_image, created_at, author: profiles (full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return {};

  return generateMeta({
    title: data.title,
    description: data.excerpt?.slice(0, 160) ?? data.title,
    image: data.cover_image,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*, author: profiles (full_name, avatar_url, username)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return notFound();

  const post = data as unknown as BlogPost;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author?.full_name ?? post.author?.username ?? "Admin",
    },
    publisher: {
      "@type": "Organization",
      name: "Modesy",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Link href="/blog" className="text-sm text-teal-500 hover:underline mb-6 inline-block">
        ← Kembali ke Blog
      </Link>

      {post.cover_image && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 mb-6">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          {post.author?.avatar_url && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={post.author.avatar_url}
                alt={post.author.full_name ?? ""}
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
          )}
          <span>{post.author?.full_name ?? post.author?.username ?? "Admin"}</span>
          <span>•</span>
          <span>
            {new Date(post.created_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </span>
        </div>
      </div>

      {post.content ? (
        <div
          className="prose prose-gray max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <p className="text-gray-400 text-sm">Konten tidak tersedia.</p>
      )}
    </div>
  );
}
