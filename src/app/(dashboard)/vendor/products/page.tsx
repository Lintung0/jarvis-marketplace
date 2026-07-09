import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/dashboard/VendorProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getVendorSubscription, getProductCountForVendor } from "@/app/actions/membership";

export default async function VendorProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [subscription, productCount] = await Promise.all([
    getVendorSubscription(user.id),
    getProductCountForVendor(user.id),
  ]);

  const planLimit = subscription?.plan?.product_limit ?? 5;
  const atLimit = productCount >= planLimit;

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (name, slug),
      images:product_images (url, is_primary)
    `)
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  const productData = products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product listings</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {productCount}/{planLimit} slots used
          </span>
          {atLimit ? (
            <Link href="/membership">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Upgrade to Add More
              </Button>
            </Link>
          ) : (
            <Link href="/vendor/products/new">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      {atLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-sm text-amber-800">
            You&apos;ve reached your product limit.{" "}
            <Link href="/membership" className="font-semibold underline">
              Upgrade your plan
            </Link>{" "}
            to add more products.
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            defaultValue=""
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Hidden</option>
          <option>Draft</option>
        </select>
      </div>

      <ProductTable products={productData} />
    </div>
  );
}
