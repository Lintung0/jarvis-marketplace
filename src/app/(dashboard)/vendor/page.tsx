import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, TrendingUp, Crown } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/StatsCard";
import { getVendorSubscription, getProductCountForVendor } from "@/app/actions/membership";

export default async function VendorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();

  const [subscription, productsCount, pendingProducts, activeProducts, totalOrders, allItems, recentItems] = await Promise.all([
    getVendorSubscription(user.id),
    getProductCountForVendor(user.id),
    admin.from("products").select("*", { count: "exact", head: true }).eq("vendor_id", user.id).eq("status", "pending").then(r => r.count ?? 0),
    admin.from("products").select("*", { count: "exact", head: true }).eq("vendor_id", user.id).eq("status", "active").then(r => r.count ?? 0),
    admin.from("order_items").select("*", { count: "exact", head: true }).eq("vendor_id", user.id).then(r => r.count ?? 0),
    admin.from("order_items").select("price, quantity, vendor_earning, order_id").eq("vendor_id", user.id).then(r => r.data ?? []),
    admin.from("order_items").select("*, order: orders(id, status, created_at)")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(r => r.data ?? []),
  ]);

  const allOrderIds = [...new Set(allItems.map(i => i.order_id))]
  const { data: paidOrders } = allOrderIds.length > 0 ? await admin
    .from("orders")
    .select("id, status")
    .in("id", allOrderIds)
    .in("status", ["paid", "completed", "delivered", "shipped", "processing"]) : { data: [] }

  const paidOrderIds = new Set(paidOrders?.map(o => o.id) ?? [])
  const totalEarnings = allItems?.reduce((sum, item) => {
    return paidOrderIds.has(item.order_id) ? sum + (item.vendor_earning ?? 0) : sum
  }, 0) || 0

  const pendingEarnings = allItems?.reduce((sum, item) => {
    return paidOrderIds.has(item.order_id) ? sum : sum + (item.vendor_earning ?? 0)
  }, 0) || 0

  const planName = subscription?.plan?.name ?? "Free"
  const planLimit = subscription?.plan?.product_limit ?? 5
  const expiryDate = subscription?.end_date
  const isExpiringSoon = expiryDate && new Date(expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-6">
      {/* Subscription Status Badge */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 gradient-brand rounded-xl flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="font-semibold text-gray-900">{planName}</p>
          </div>
          <div className="text-sm text-gray-500">
            {productsCount}/{planLimit} products used
          </div>
        </div>
        <div className="flex items-center gap-3">
          {expiryDate && (
            <span className={`text-xs ${isExpiringSoon ? "text-red-500" : "text-gray-400"}`}>
              Expires {new Date(expiryDate).toLocaleDateString("id-ID")}
            </span>
          )}
          <Link href="/membership">
            <button className="gradient-brand text-white text-xs font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition">
              Upgrade Plan
            </button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link href="/vendor/products/new">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add New Product
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeProducts ?? 0} active, {pendingProducts ?? 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders ?? 0}</div>
            <p className="text-xs text-gray-500 mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</div>
            <p className="text-xs text-gray-500 mt-1">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{formatCurrency(pendingEarnings)}</div>
            <p className="text-xs text-gray-500 mt-1">Waiting for payment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent orders</p>
              <p className="text-sm">When customers buy your products, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item: any) => (
                <Link key={item.id} href={`/vendor/orders`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} &middot; {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="text-sm font-semibold text-teal-500">{formatCurrency(item.price * item.quantity)}</span>
                    <StatusBadge status={item.order?.status ?? "pending"} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-500">Add, edit, or delete your products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Earnings</h3>
                <p className="text-sm text-gray-500">Check your payouts and earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
