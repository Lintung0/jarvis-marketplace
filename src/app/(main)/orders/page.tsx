import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import OrdersListClient from "@/components/orders/OrdersListClient";
import type { Order, OrderItem } from "@/types";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: orders } = await admin
    .from("orders")
    .select("*")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  let ordersWithItems: Order[] = [];

  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { data: items } = await admin
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    const itemsByOrderId: Record<string, OrderItem[]> = {};
    if (items) {
      for (const item of items) {
        if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
        itemsByOrderId[item.order_id].push(item as unknown as OrderItem);
      }
    }

    ordersWithItems = (orders as unknown as Order[]).map((order) => ({
      ...order,
      items: itemsByOrderId[order.id] || [],
    }));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pembelian</h1>
      <OrdersListClient orders={ordersWithItems} />
    </div>
  );
}
