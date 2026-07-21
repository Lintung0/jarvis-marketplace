"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Package, Shield, TrendingUp, Store, BadgeCheck, MessageCircle, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { toast } from "sonner";
import type { Product } from "@/types";
import ProductGalleryZoom from "./ProductGalleryZoom";
import ReviewForm from "./ReviewForm";
import ProductComments from "./ProductComments";

interface Props {
  product: Product;
  userReferralCode?: string | null;
}

export default function ProductDetailClient({ product, userReferralCode }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "comments">("description");
  const addItem = useCartStore((state) => state.addItem);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${JSON.stringify(selectedOptions)}`,
      product_id: product.id.toString(),
      product_title: product.title,
      product_slug: product.slug,
      product_image: product.images?.find((img) => img.is_primary)?.url ?? "",
      product_type: product.type,
      vendor_id: product.vendor_id,
      price: product.sale_price ?? product.price,
      quantity,
      options: selectedOptions,
    };
    
    addItem(cartItem);
    toast.success("Produk ditambahkan ke keranjang!", {
      description: `${product.title} (${quantity}x)`,
      action: {
        label: "Lihat Keranjang",
        onClick: () => window.location.href = "/cart",
      },
    });
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: `${product.id}-${JSON.stringify(selectedOptions)}`,
      product_id: product.id.toString(),
      product_title: product.title,
      product_slug: product.slug,
      product_image: product.images?.find((img) => img.is_primary)?.url ?? "",
      product_type: product.type,
      vendor_id: product.vendor_id,
      price: product.sale_price ?? product.price,
      quantity,
      options: selectedOptions,
    };
    
    addItem(cartItem);
    router.push("/checkout");
  };

  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Left: Gallery */}
      <ProductGalleryZoom images={product.images ?? []} title={product.title} />

      {/* Right: Product Info */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.slug}`} className="hover:text-foreground">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* Title & Rating */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= avgRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {avgRating > 0 ? avgRating.toFixed(1) : "Belum ada rating"} 
                {product.reviews && product.reviews.length > 0 && ` (${product.reviews.length} ulasan)`}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {product.sold_count ?? 0} terjual
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-end gap-3 mb-2">
            <div className="text-4xl font-bold text-teal-500">
              <PriceDisplay amount={product.sale_price ?? product.price} className="text-3xl font-bold text-teal-500" />
            </div>
            {product.sale_price && (
              <>
                <div className="text-xl text-gray-400 line-through">
                  <PriceDisplay amount={product.price} />
                </div>
                <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </div>
              </>
            )}
          </div>
          {product.type === "digital" && (
            <div className="flex items-center gap-2 text-sm text-teal-500">
              <Package className="w-4 h-4" />
              <span>Produk Digital - Langsung Dapat Akses</span>
            </div>
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <Link href={`/vendors/${product.vendor?.username}`} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00a99d] to-[#00b3a1] flex items-center justify-center text-white font-bold relative">
              {product.vendor?.avatar_url ? (
                <Image src={product.vendor.avatar_url} alt={product.vendor.full_name ?? "Vendor"} fill className="object-cover rounded-full" />
              ) : (
                product.vendor?.full_name?.charAt(0) ?? "V"
              )}
            </div>
            <div>
              <div className="font-semibold flex items-center gap-1">
                {product.vendor?.full_name ?? "Unknown Vendor"}
                {product.vendor?.is_verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
                {(product.vendor as any)?.plan_name && (product.vendor as any).plan_name !== "Free" && (
                  <Crown className={`w-4 h-4 ${
                    (product.vendor as any).plan_name === "Pro" ? "text-teal-500" : "text-purple-500"
                  }`} />
                )}
              </div>
              <div className="text-sm text-muted-foreground">Lihat Toko</div>
            </div>
          </Link>
          <Link href={`/chat/${product.vendor_id}`}>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </Link>
        </div>

        {/* Stock */}
        {product.stock !== undefined && (
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-500" />
            <span className="text-sm">
              Stok: <span className="font-semibold">{product.stock > 0 ? product.stock : "Habis"}</span>
            </span>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Jumlah:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100 transition"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-x border-gray-300 py-2"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleBuyNow}
            size="lg"
            className="flex-1 h-12 text-base bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0"
            disabled={product.stock === 0}
          >
            <Zap className="w-5 h-5 mr-2" />
            Beli Sekarang
          </Button>
          <Button
            onClick={handleAddToCart}
            size="lg"
            variant="outline"
            className="h-12 text-base"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Keranjang
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-5 h-5 text-green-600" />
            <span>100% Original</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Package className="w-5 h-5 text-blue-600" />
            <span>Gratis Retur</span>
          </div>
        </div>

        {/* Share & Earn */}
        {userReferralCode && (
          <ShareEarnSection
            referralCode={userReferralCode}
            productSlug={product.slug}
            productTitle={product.title}
          />
        )}
      </div>

      {/* Full Width: Tabs Section */}
      <div className="md:col-span-2 mt-8">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            {["description", "specs", "reviews", "comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-semibold text-sm transition-all relative ${
                  activeTab === tab
                    ? "text-teal-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "description" && "Deskripsi"}
                {tab === "specs" && "Spesifikasi"}
                {tab === "reviews" && `Ulasan (${product.reviews?.length ?? 0})`}
                {tab === "comments" && "Diskusi"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a99d]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="prose max-w-none">
          {activeTab === "description" && (
            <div className="text-gray-300 whitespace-pre-line">
              {product.description || "Tidak ada deskripsi."}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="space-y-2">
              {(product as any).specs && typeof (product as any).specs === "object" && Object.keys((product as any).specs).length > 0 ? (
                Object.entries((product as any).specs).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-200">
                    <div className="w-1/3 font-semibold text-gray-300">{key}</div>
                    <div className="w-2/3 text-gray-400">{String(value)}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada spesifikasi.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review Form */}
              <ReviewForm productId={product.id} />

              {/* Existing Reviews */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  (product.reviews as any[]).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00a99d] to-[#00b3a1] flex items-center justify-center text-white font-bold text-sm">
                          {review.user?.full_name?.charAt(0) ?? "U"}
                        </div>
                        <div>
                          <div className="font-semibold">{review.user?.full_name ?? "Anonymous"}</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.review_text}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <ProductComments productId={product.id} />
          )}
        </div>
      </div>
    </div>
  );
}

function ShareEarnSection({
  referralCode, productSlug, productTitle,
}: {
  referralCode: string
  productSlug: string
  productTitle: string
}) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== "undefined" ? window.location.origin + "/products/" + productSlug : ""
  const referralLink = baseUrl ? `${baseUrl}?ref=${referralCode}` : ""
  const shareText = encodeURIComponent(`Check out ${productTitle} on Modesy!`)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success("Referral link copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-teal-50 to-amber-50 border border-teal-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-teal-500" />
        <h3 className="font-bold text-gray-900">Share & Earn</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Share this product with your friends and earn commissions!
      </p>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 select-all"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className="shrink-0 px-4 py-2.5 gradient-brand text-white text-xs font-semibold rounded-xl hover:opacity-90 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/?text=${shareText}%0A${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
        >
          X (Twitter)
        </a>
      </div>
    </div>
  )
}
