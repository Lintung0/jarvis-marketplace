import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { decrementOrderStock } from "@/app/actions/stock";

export async function POST(req: NextRequest) {
  try {
    const webhookToken = req.headers.get("x-callback-token");
    if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    logger.info("Xendit webhook received:", body);

    if (body.status !== "PAID") {
      return NextResponse.json({ received: true });
    }

    const externalId = body.external_id;
    const supabase = createAdminClient();

    // Check if this is a subscription payment
    const { data: sub } = await supabase
      .from("vendor_subscriptions")
      .select("id")
      .eq("id", externalId)
      .single();

    if (sub) {
      await supabase
        .from("vendor_subscriptions")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", externalId);

      const { data: updatedSub } = await supabase
        .from("vendor_subscriptions")
        .select("vendor_id, plan:membership_plans(name)")
        .eq("id", externalId)
        .single();
      if (updatedSub) {
        const planName = (updatedSub.plan as any)?.name ?? null;
        await supabase.from("profiles").update({ plan_name: planName }).eq("id", updatedSub.vendor_id);
      }

      return NextResponse.json({ received: true });
    }

    // Fallback: treat as order payment
    const { error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", externalId);

    if (error) {
      logger.error("Update order error:", error);
      return NextResponse.json({ error: "Gagal update order" }, { status: 500 });
    }

    await decrementOrderStock(externalId);

    // Hitung & simpan vendor_earning per item
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id, price, quantity, commission_rate")
      .eq("order_id", externalId);

    if (orderItems) {
      for (const item of orderItems) {
        const rate = item.commission_rate ?? 10
        const earning = Math.round(item.price * item.quantity * (1 - rate / 100) * 100) / 100
        await supabase
          .from("order_items")
          .update({ vendor_earning: earning })
          .eq("id", item.id)
      }
    }

    const { data: order } = await supabase
      .from("orders")
      .select("buyer_id")
      .eq("id", externalId)
      .single();

    if (order?.buyer_id) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", order.buyer_id);
    }

    // Kirim notifikasi ke vendor
    if (orderItems) {
      const { data: items } = await supabase
        .from("order_items")
        .select("vendor_id")
        .eq("order_id", externalId);

      if (items) {
        const notified = new Set<string>();
        for (const item of items) {
          if (item.vendor_id && !notified.has(item.vendor_id)) {
            notified.add(item.vendor_id);
            await supabase.from("notifications").insert({
              user_id: item.vendor_id,
              type: "paid",
              message: `Pesanan baru #${externalId.slice(0, 8)} telah dibayar! Segera proses pesanan.`,
              order_id: externalId,
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
