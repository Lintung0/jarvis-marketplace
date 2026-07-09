import { createClient } from "@/lib/supabase/server";
import VendorCard from "@/components/shared/VendorCard";
import type { Profile } from "@/types";

export default async function VendorsPage() {
  const supabase = await createClient();

  // Fetch semua vendor + hitung jumlah produk aktif mereka
  const { data: vendors } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "vendor")
    .eq("is_banned", false)
    .order("created_at", { ascending: false });

  // Fetch product count per vendor
  const vendorIds = (vendors ?? []).map((v) => v.id);
  const { data: productCounts } = await supabase
    .from("products")
    .select("vendor_id")
    .in("vendor_id", vendorIds.length > 0 ? vendorIds : [""])
    .eq("status", "active");

  // Hitung jumlah produk per vendor
  const countMap: Record<string, number> = {};
  (productCounts ?? []).forEach((p) => {
    countMap[p.vendor_id] = (countMap[p.vendor_id] ?? 0) + 1;
  });

  const vendorsWithCount = (vendors ?? []).map((v) => ({
    ...v,
    product_count: countMap[v.id] ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Semua Vendor</h1>
        <p className="text-sm text-gray-400 mt-1">
          {vendors?.length ?? 0} vendor terdaftar
        </p>
      </div>

      {!vendors || vendors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-gray-500 text-sm">Belum ada vendor terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorsWithCount.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor as Profile & { product_count: number }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
  