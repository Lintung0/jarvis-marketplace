import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import OrderStatusBadgeClient from "@/components/shared/OrderStatusBadgeClient";
import OrderStatusUpdater from "@/components/orders/OrderStatusUpdater";
import OrderActions from "@/components/orders/OrderActions";
import PayButton from "@/components/orders/PayButton";
import { generateMeta } from "@/lib/seo";
import type { Order, OrderItem } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return generateMeta({
    title: `Order #${id.slice(0, 8).toUpperCase()}`,
    description: `Detail pesanan #${id.slice(0, 8).toUpperCase()} di Modesy`,
    path: `/orders/${id}`,
    noIndex: true,
  });
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { status: queryStatus } = await searchParams;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  if (!order) return notFound();

  const { data: rawItems } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  let items: OrderItem[] = [];
  if (rawItems && rawItems.length > 0) {
    const productIds = rawItems.map((i) => i.product_id).filter(Boolean) as string[];
    let productMap: Record<string, { id: string; slug: string; images: { url: string; is_primary: boolean }[] }> = {};

    if (productIds.length > 0) {
      const { data: products } = await admin
        .from("products")
        .select("id, slug")
        .in("id", productIds);

      if (products) {
        const { data: images } = await admin
          .from("product_images")
          .select("product_id, url, is_primary")
          .in("product_id", productIds);

        const imagesByProduct: Record<string, { url: string; is_primary: boolean }[]> = {};
        if (images) {
          for (const img of images) {
            if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
            imagesByProduct[img.product_id].push({ url: img.url, is_primary: img.is_primary });
          }
        }

        for (const p of products) {
          productMap[p.id] = {
            id: p.id,
            slug: p.slug,
            images: imagesByProduct[p.id] || [],
          };
        }
      }
    }

    items = rawItems.map((item) => ({
      ...item,
      product: item.product_id ? productMap[item.product_id] : undefined,
    })) as unknown as OrderItem[];
  }

  const orderWithItems: Order = {
    ...(order as unknown as Order),
    items,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <OrderStatusUpdater orderId={orderWithItems.id} currentStatus={orderWithItems.status} />
      {queryStatus === "success" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-4xl">🎉</span>
          <div>
            <h2 className="font-bold text-green-800 text-lg">Pembayaran Berhasil!</h2>
            <p className="text-green-600 text-sm">
              Terima kasih sudah belanja di Modesy. Order kamu sedang diproses.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-lg font-bold text-gray-900">
              #{orderWithItems.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(orderWithItems.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <OrderStatusBadgeClient initialStatus={orderWithItems.status} orderId={orderWithItems.id} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Item Pesanan</h2>
        <div className="space-y-4">
          {orderWithItems.items?.map((item) => {
            const thumb =
              item.product?.images?.find((img) => img.is_primary)?.url ??
              item.product?.images?.[0]?.url ??
              null;
            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {thumb ? (
                    <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <p className="text-xs text-gray-400">
                      {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-teal-500 flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900 text-lg">
          <span>Total</span>
          <span className="text-teal-500">{formatCurrency(orderWithItems.total)}</span>
        </div>
      </div>

      {orderWithItems.shipping_address && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Alamat Pengiriman</h2>
          <div className="text-sm text-gray-500 space-y-1">
            <p className="font-medium text-gray-800">{orderWithItems.shipping_address.full_name}</p>
            <p>{orderWithItems.shipping_address.address}</p>
            <p>{orderWithItems.shipping_address.city}, {orderWithItems.shipping_address.state} {orderWithItems.shipping_address.postal_code}</p>
            <p>{orderWithItems.shipping_address.country}</p>
            <p>📞 {orderWithItems.shipping_address.phone}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link
          href="/orders"
          className="flex-1 text-center py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md gradient-brand"
        >
          Lihat Semua Order
        </Link>
        <Link
          href="/"
          className="flex-1 text-center py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-teal-50"
          style={{ borderColor: "#00a99d", color: "#00a99d" }}
        >
          Lanjut Belanja
        </Link>
        <PayButton orderId={orderWithItems.id} status={orderWithItems.status} />
        <OrderActions orderId={orderWithItems.id} status={orderWithItems.status} />
      </div>
    </div>
  );
}
