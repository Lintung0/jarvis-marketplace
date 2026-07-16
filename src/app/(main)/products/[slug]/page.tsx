import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import ProductDetailClient from "@/components/shared/ProductDetailClient";
import ProductGrid from "@/components/shared/ProductGrid";
import ProductDetailSkeleton from "@/components/shared/ProductDetailSkeleton";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";
import { generateMeta } from "@/lib/seo";
import type { Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, description, images: product_images(url, is_primary)")
    .eq("slug", slug)
    .single();

  if (!product) return {};

  const primaryImage = product.images?.find((img: any) => img.is_primary)?.url ?? product.images?.[0]?.url;

  return generateMeta({
    title: product.title,
    description: product.description?.slice(0, 160) ?? `${product.title} di Modesy`,
    image: primaryImage,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product with all relations
  const { data: product } = await supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url, is_verified),
      category: categories (id, name, slug),
      reviews: product_reviews (
        id, rating, review_text, created_at,
        user: profiles (id, username, full_name, avatar_url)
      )`
    )
    .eq("slug", slug)
    .single();

  // Check logged-in user's referral code for Share & Earn
  const { data: { user } } = await supabase.auth.getUser()
  let userReferralCode: string | null = null
  if (user) {
    const { data: aff } = await supabase
      .from("affiliate_profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single()
    userReferralCode = aff?.referral_code ?? null
  }

  if (!product || product.status !== "active") {
    return notFound();
  }

  // Check if vendor is banned
  const activeVendorIds = await getActiveVendorIds(supabase)
  if (!activeVendorIds.includes(product.vendor_id)) {
    return notFound()
  }

  // Fetch related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url)`
    )
    .eq("category_id", product.category_id)
    .eq("status", "active")
    .neq("id", product.id)
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])
    .order("created_at", { ascending: false })
    .limit(4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.[0]?.url,
    sku: product.id,
    mpn: product.id,
    brand: { "@type": "Brand", name: product.vendor?.full_name ?? product.vendor?.username },
    offers: {
      "@type": "Offer",
      price: product.sale_price ?? product.price,
      priceCurrency: "IDR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://modesy.com"}/products/${slug}`,
    },
    aggregateRating: product.reviews?.length > 0 ? {
      "@type": "AggregateRating",
      ratingValue: (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length).toFixed(1),
      reviewCount: product.reviews.length,
    } : undefined,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient 
          product={product as unknown as Product} 
          userReferralCode={userReferralCode}
        />
      </Suspense>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <ProductGrid 
              products={(relatedProducts ?? []) as unknown as Product[]} 
              emptyMessage="Tidak ada produk terkait"
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
