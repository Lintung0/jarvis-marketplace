import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import VendorApplicationCard from "@/components/profile/VendorApplicationCard";
import type { Order, Profile, Wishlist } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Gunakan admin client agar nested order_items terbaca
  const admin = createAdminClient();

  const { data: orders } = await admin
    .from("orders")
    .select(`
      *,
      items: order_items (
        id, title, price, quantity,
        product: products (id, slug, images: product_images (url, is_primary))
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  const { data: wishlistItems } = await admin
    .from("wishlists")
    .select(`
      *,
      product: products (
        *,
        images: product_images (url, is_primary)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader profile={profile as Profile} />
        <VendorApplicationCard profile={profile as Profile} />
        <ProfileTabs 
          profile={profile as Profile}
          orders={(orders as Order[]) ?? []}
          wishlistItems={(wishlistItems as Wishlist[]) ?? []}
        />
      </div>
    </div>
  );
}
