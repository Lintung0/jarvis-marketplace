import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Cek auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, coupon_code, discount_amount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart kosong" }, { status: 400 });
    }

    // Hitung total
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const total = subtotal - (discount_amount ?? 0);

    // Ambil profile user
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // Buat order di Supabase dulu
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        status: "pending",
        total,
        shipping_address: shippingAddress ?? null,
        payment_method: "xendit",
        coupon_code: coupon_code ?? null,
        discount_amount: discount_amount ?? 0,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Gagal buat order" }, { status: 500 });
    }

    // Insert order items — pake admin client bypass RLS
    const admin = createAdminClient();

    // Fetch commission rates for all products
    const productIds = items.map((i: { product_id: string }) => i.product_id)
    const { data: products } = await admin
      .from("products")
      .select("id, commission_rate")
      .in("id", productIds.length > 0 ? productIds : [""])

    const rateMap: Record<string, number> = {}
    for (const p of products ?? []) {
      rateMap[p.id] = p.commission_rate ?? 10 // default 10% platform fee
    }

    const orderItems = items.map((item: {
      product_id: string;
      vendor_id: string;
      title: string;
      price: number;
      quantity: number;
      options?: Record<string, string>;
    }) => {
      const rate = rateMap[item.product_id] ?? 10
      return {
        order_id: order.id,
        product_id: item.product_id,
        vendor_id: item.vendor_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        options: item.options ?? null,
        commission_rate: rate,
        vendor_earning: Math.round(item.price * item.quantity * (1 - rate / 100) * 100) / 100,
        created_at: new Date().toISOString(),
      }
    });

    await admin.from("order_items").insert(orderItems);

    // Increment coupon used_count if discount was applied
    if (coupon_code && discount_amount > 0) {
      const { data: coupon } = await admin
        .from("coupons")
        .select("used_count")
        .ilike("code", coupon_code)
        .single();
      if (coupon) {
        await admin
          .from("coupons")
          .update({ used_count: coupon.used_count + 1 })
          .ilike("code", coupon_code);
      }
    }

    // Buat Xendit Invoice
    console.log("[Xendit] Creating invoice for order:", order.id);
    console.log("[Xendit] XENDIT_SECRET_KEY exists:", !!process.env.XENDIT_SECRET_KEY);
    console.log("[Xendit] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    const xenditPayload = {
      external_id: order.id,
      amount: total,
      payer_email: user.email ?? "",
      description: `Order #${order.id.slice(0, 8).toUpperCase()} - Modesy`,
      success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=failed`,
      currency: "IDR",
      items: items.map((item: { title: string; price: number; quantity: number }) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        category: "Product",
      })),
      customer: {
        given_names: profile?.full_name ?? "Customer",
        email: user.email ?? "",
      },
    };

    const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.XENDIT_SECRET_KEY + ":"
        ).toString("base64")}`,
      },
      body: JSON.stringify(xenditPayload),
    });

    console.log("[Xendit] Response status:", xenditRes.status, xenditRes.statusText);
    
    if (!xenditRes.ok) {
      const xenditError = await xenditRes.json();
      console.error("[Xendit] Error response:", xenditError);
      logger.error("Xendit error: ", xenditError);
      return NextResponse.json(
        { error: "Gagal membuat invoice Xendit", details: xenditError },
        { status: 500 }
      );
    }

    const invoice = await xenditRes.json();
    console.log("[Xendit] Invoice created:", invoice.id, invoice.invoice_url);

    // Simpan payment_id & payment_url ke order
    await supabase
      .from("orders")
      .update({
        payment_id: invoice.id,
        notes: JSON.stringify({ payment_url: invoice.invoice_url }),
      })
      .eq("id", order.id);

    return NextResponse.json({
      invoice_url: invoice.invoice_url,
      order_id: order.id,
    });
  } catch (err) {
    logger.error("Create invoice error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
