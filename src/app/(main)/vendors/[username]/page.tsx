import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getActiveVendorIds } from "@/lib/queries";
import ProductGrid from "@/components/shared/ProductGrid";
import FollowButton from "@/components/shared/FollowButton";
import { MapPin, Calendar, Package, Star, BadgeCheck, Users, Crown } from "lucide-react";
import type { Product, Profile } from "@/types";
import { getFollowCounts } from "@/app/actions/follows";
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
  const followCounts = await getFollowCounts(vendor.id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover + Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 gradient-brand" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16 relative">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? profile.username}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center gradient-brand text-white text-5xl font-bold">
                      {(profile.full_name ?? profile.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {profile.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                      {profile.full_name ?? profile.username}
                      {profile.plan_name && profile.plan_name !== "Free" && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                          profile.plan_name === "Pro"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          <Crown className="w-3 h-3" />
                          {profile.plan_name}
                        </span>
                      )}
                      {currentUser && !isOwnProfile && (
                        <FollowButton vendorId={vendor.id} vendorName={profile.full_name ?? profile.username} />
                      )}
                    </h1>
                    <p className="text-gray-500 mt-1">@{profile.username}</p>

                    {/* Location & Join Date */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="flex gap-3">
                    <div className="bg-teal-50 border border-teal-200 rounded-xl px-6 py-3 text-center">
                      <div className="flex items-center gap-2 text-teal-600 mb-1">
                        <Package className="w-4 h-4" />
                        <span className="text-2xl font-bold">{count ?? 0}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Products</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-3 text-center">
                      <div className="flex items-center gap-2 text-purple-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-2xl font-bold">{followCounts.followers}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Followers</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-center">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-2xl font-bold">{followCounts.following}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Following</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-3 text-center">
                      <div className="flex items-center gap-2 text-amber-600 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-2xl font-bold">{avgRating}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Rating</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-600 mt-4 max-w-3xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Website */}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium mt-3"
                  >
                    🔗 {profile.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Products by {profile.full_name ?? profile.username}
            </h2>
            <span className="text-sm text-gray-500">{count ?? 0} items</span>
          </div>
          <ProductGrid
            products={(products ?? []) as unknown as Product[]}
            emptyMessage="This vendor has no active products yet."
          />
        </div>
      </div>
    </div>
  );
}