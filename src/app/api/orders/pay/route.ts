import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Order ID diperlukan" }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status, buyer_id, payment_id, notes, total, payment_method")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.buyer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ error: "Pesanan ini sudah dibayar" }, { status: 400 });
    }

    // Xendit re-payment
    let paymentUrl = "";
    try {
      const notes = JSON.parse(order.notes || "{}");
      paymentUrl = notes.payment_url || "";
    } catch {}

    if (!paymentUrl) {
      try {
        const xenditPayload = {
          external_id: order_id,
          amount: order.total,
          payer_email: user.email ?? "",
          description: `Order #${order_id.slice(0, 8).toUpperCase()} - JarvisMarketplace`,
          success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order_id}?status=success`,
          failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=failed`,
          currency: "IDR",
        };

        const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              (process.env.XENDIT_SECRET_KEY || "") + ":"
            ).toString("base64")}`,
          },
          body: JSON.stringify(xenditPayload),
        });

        if (!xenditRes.ok) {
          const errText = await xenditRes.text();
          logger.error("Xendit create invoice failed:", errText);
          return NextResponse.json({ error: "Gagal membuat invoice pembayaran" }, { status: 502 });
        }

        const invoice = await xenditRes.json();
        paymentUrl = invoice.invoice_url;

        await supabase
          .from("orders")
          .update({
            payment_id: invoice.id,
            notes: JSON.stringify({ payment_url: invoice.invoice_url }),
          })
          .eq("id", order_id);
      } catch (xenditErr) {
        logger.error("Xendit error:", xenditErr);
        return NextResponse.json({ error: "Gagal terhubung ke payment gateway" }, { status: 502 });
      }
    }

    if (!paymentUrl) {
      return NextResponse.json({ error: "Gagal mendapatkan link pembayaran. Hubungi support." }, { status: 500 });
    }

    return NextResponse.json({ payment_url: paymentUrl });
  } catch (err) {
    logger.error("Pay order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
