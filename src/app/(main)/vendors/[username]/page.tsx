import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import ProductGrid from "@/components/shared/ProductGrid";
import FollowButton from "@/components/shared/FollowButton";
import { MapPin, Calendar, Package, BadgeCheck, Crown, ShieldCheck } from "lucide-react";
import type { Product, Profile } from "@/types";
import { getFollowStats, checkIsFollowing } from "@/app/actions/follows";
import { generateMeta } from "@/lib/seo";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("profiles")
    .select("full_name, username, bio, avatar_url")
    .eq("username", username)
    .eq("role", "vendor")
    .single();

  if (!vendor) return {};

  const name = vendor.full_name ?? vendor.username;
  const description = vendor.bio?.slice(0, 160) ?? `Toko ${name} di Modesy - Jual produk digital, fisik, dan lisensi`;

  return generateMeta({
    title: name,
    description,
    image: vendor.avatar_url,
    path: `/vendors/${username}`,
  });
}

export default async function VendorProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("role", "vendor")
    .single();

  if (!vendor) return notFound();

  if (vendor.is_banned) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Tidak Tersedia</h1>
        <p className="text-gray-500">Akun vendor ini telah dinonaktifkan.</p>
      </div>
    )
  }

  const activeVendorIds = await getActiveVendorIds(supabase)

  const { data: vendorProducts } = await supabase
    .from("products")
    .select("id")
    .eq("vendor_id", vendor.id)
    .eq("status", "active")

  const vendorProductIds = vendorProducts?.map(p => p.id) ?? []
  let avgRating = "0.0"
  if (vendorProductIds.length > 0) {
    const { data: reviews } = await supabase
      .from("product_reviews")
      .select("rating")
      .in("product_id", vendorProductIds)

    if (reviews && reviews.length > 0) {
      avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    }
  }

  const { data: products, count } = await supabase
    .from("products")
    .select(
      `*,
      images: product_images (id, url, alt, is_primary),
      vendor: profiles (id, username, full_name, avatar_url)`,
      { count: "exact" }
    )
    .eq("vendor_id", vendor.id)
    .eq("status", "active")
    .in("vendor_id", activeVendorIds.length > 0 ? activeVendorIds : [null])
    .order("created_at", { ascending: false });

  const profile = vendor as Profile;

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwnProfile = currentUser?.id === vendor.id;
  const followCounts = await getFollowStats(vendor.id);
  const isFollowing = await checkIsFollowing(vendor.id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* IG-style Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-teal-400 overflow-hidden">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name ?? profile.username}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center gradient-brand text-white text-5xl font-bold">
                    {(profile.full_name ?? profile.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {profile.is_verified && (
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              {/* Name row + follow button */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {profile.username}
                </h1>
                {profile.plan_name && profile.plan_name !== "Free" && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    profile.plan_name === "Pro"
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}>
                    <Crown className="w-3 h-3" />
                    {profile.plan_name}
                  </span>
                )}
                {currentUser && !isOwnProfile && (
                  <FollowButton vendorId={vendor.id} vendorName={profile.full_name ?? profile.username} initialFollowing={isFollowing} />
                )}
              </div>

              {/* Stats row — IG style */}
              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-gray-900">{count ?? 0}</span>
                  <span className="text-gray-600 ml-1">produk</span>
                </div>
                <Link href={`/vendors/${profile.username}/followers`} className="text-center sm:text-left hover:opacity-70 transition">
                  <span className="font-bold text-gray-900">{followCounts.followers}</span>
                  <span className="text-gray-600 ml-1">followers</span>
                </Link>
                <Link href={`/vendors/${profile.username}/following`} className="text-center sm:text-left hover:opacity-70 transition">
                  <span className="font-bold text-gray-900">{followCounts.following}</span>
                  <span className="text-gray-600 ml-1">following</span>
                </Link>
                <div className="text-center sm:text-left">
                  <span className="font-bold text-gray-900">{avgRating}</span>
                  <span className="text-gray-600 ml-1">⭐ rating</span>
                </div>
              </div>

              {/* Full name */}
              {profile.full_name && (
                <p className="font-semibold text-gray-900 text-sm mb-1">{profile.full_name}</p>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-700 text-sm leading-relaxed mb-2 whitespace-pre-line">
                  {profile.bio}
                </p>
              )}

              {/* Location */}
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Website */}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {profile.website}
                </a>
              )}

              {/* Join date */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Bergabung {new Date(profile.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Policies */}
        {profile.shop_policies && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              Kebijakan Toko
            </h2>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {profile.shop_policies}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-500" />
              Produk
            </h2>
            <span className="text-sm text-gray-500">{count ?? 0} item</span>
          </div>
          <ProductGrid
            products={(products ?? []) as unknown as Product[]}
            emptyMessage="Vendor ini belum punya produk aktif."
          />
        </div>
      </div>
    </div>
  );
}