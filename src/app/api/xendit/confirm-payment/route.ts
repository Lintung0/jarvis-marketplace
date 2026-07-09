import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { decrementOrderStock } from "@/app/actions/stock";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("status, buyer_id")
      .eq("id", order_id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.buyer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status === "paid" || order.status === "processing") {
      return NextResponse.json({ status: "already_updated" });
    }

    // Pakai admin client biar gak ke-block RLS (buyer gak bisa update ke "paid")
    const admin = createAdminClient();

    await admin
      .from("orders")
      .update({
        status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    // Kurangi stok
    await decrementOrderStock(order_id);

    // Hitung & simpan vendor_earning per item
    const { data: orderItems } = await admin
      .from("order_items")
      .select("id, price, quantity, commission_rate")
      .eq("order_id", order_id);

    if (orderItems) {
      for (const item of orderItems) {
        const rate = item.commission_rate ?? 10
        const earning = Math.round(item.price * item.quantity * (1 - rate / 100) * 100) / 100
        await admin
          .from("order_items")
          .update({ vendor_earning: earning })
          .eq("id", item.id)
      }
    }

    // Hapus cart
    await admin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    // Kirim notifikasi ke vendor
    if (orderItems) {
      const { data: items } = await admin
        .from("order_items")
        .select("vendor_id")
        .eq("order_id", order_id);

      if (items) {
        const notified = new Set<string>();
        for (const item of items) {
          if (item.vendor_id && !notified.has(item.vendor_id)) {
            notified.add(item.vendor_id);
            await admin.from("notifications").insert({
              user_id: item.vendor_id,
              type: "paid",
              message: `Pesanan baru #${order_id.slice(0, 8)} telah dibayar! Segera proses pesanan.`,
              order_id,
            });
          }
        }
      }
    }

    return NextResponse.json({ status: "updated" });
  } catch (err) {
    logger.error("Confirm payment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
