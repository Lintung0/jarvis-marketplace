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

    // Check if this is a wallet top-up (prefix: WALLET-)
    if (externalId.startsWith("WALLET-")) {
      const transactionId = externalId.replace("WALLET-", "");
      
      const { data: tx } = await supabase
        .from("wallet_transactions")
        .select("user_id, amount")
        .eq("id", transactionId)
        .single();

      if (tx) {
        // Update transaction to success
        await supabase
          .from("wallet_transactions")
          .update({ status: "success", updated_at: new Date().toISOString() })
          .eq("id", transactionId);

        // Update user's wallet balance
        const { data: profile } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", tx.user_id)
          .single();

        const newBalance = (profile?.balance ?? 0) + tx.amount;
        await supabase
          .from("profiles")
          .update({ balance: newBalance })
          .eq("id", tx.user_id);

        // Send notification
        await supabase.from("notifications").insert({
          user_id: tx.user_id,
          type: "wallet_topup",
          message: `Top up wallet Rp${tx.amount.toLocaleString("id-ID")} berhasil! Saldo: Rp${newBalance.toLocaleString("id-ID")}`,
        });

        return NextResponse.json({ received: true });
      }
    }

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
      .select("id, price, quantity, commission_rate, vendor_id")
      .eq("order_id", externalId);

    if (orderItems) {
      for (const item of orderItems) {
        const rate = item.commission_rate ?? 10
        const earning = Math.round(item.price * item.quantity * (1 - rate / 100) * 100) / 100
        await supabase
          .from("order_items")
          .update({ vendor_earning: earning })
          .eq("id", item.id)

        // Transfer earning ke wallet vendor
        if (item.vendor_id && earning > 0) {
          // Tambah balance vendor
          const { data: vendor } = await supabase
            .from("profiles")
            .select("balance")
            .eq("id", item.vendor_id)
            .single()

          const newBalance = (vendor?.balance ?? 0) + earning
          await supabase
            .from("profiles")
            .update({ balance: newBalance })
            .eq("id", item.vendor_id)

          // Catat transaksi wallet
          await supabase
            .from("wallet_transactions")
            .insert({
              user_id: item.vendor_id,
              amount: earning,
              type: "payment",
              status: "success",
              notes: `Earning dari order #${externalId.slice(0, 8)}`,
            })
        }
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
