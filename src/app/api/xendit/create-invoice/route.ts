import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // GUARD: Cek env vars PALING AWAL
  if (!process.env.XENDIT_SECRET_KEY) {
    return NextResponse.json({ 
      error: "XENDIT_SECRET_KEY tidak di-set di Vercel Environment Variables",
      fix: "Vercel Dashboard → Settings → Environment Variables → Add XENDIT_SECRET_KEY"
    }, { status: 500 });
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ 
      error: "NEXT_PUBLIC_APP_URL tidak di-set",
      fix: "Vercel Dashboard → Settings → Environment Variables → Add NEXT_PUBLIC_APP_URL=https://jarvis-marketplace.vercel.app"
    }, { status: 500 });
  }

  console.log("[Xendit] Request received");
  console.log("[Xendit] XENDIT_SECRET_KEY exists:", !!process.env.XENDIT_SECRET_KEY);
  console.log("[Xendit] XENDIT_SECRET_KEY length:", process.env.XENDIT_SECRET_KEY?.length || 0);
  console.log("[Xendit] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

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

    // Gunakan SECURITY DEFINER function untuk create order (bypass RLS)
    const { data: orderId, error: orderError } = await supabase
      .rpc('create_order', {
        p_buyer_id: user.id,
        p_total: total,
        p_shipping_address: shippingAddress ?? null,
        p_payment_method: "xendit",
        p_coupon_code: coupon_code ?? null,
        p_discount_amount: discount_amount ?? 0,
        p_items: items.map((item: any) => ({
          product_id: item.product_id,
          vendor_id: item.vendor_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          options: item.options ?? null,
        })),
      });

    if (orderError || !orderId) {
      console.error("[ORDER ERROR]", orderError);
      return NextResponse.json({ 
        error: "Gagal buat order", 
        details: orderError?.message || orderError,
        code: orderError?.code,
        hint: orderError?.hint
      }, { status: 500 });
    }

    const orderIdStr = orderId as string;
    console.log("[Xendit] Order created via RPC:", orderIdStr);

    // Ambil order detail untuk Xendit
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderIdStr)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 500 });
    }

    // Ambil profile user
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // Buat Xendit Invoice
    const xenditPayload = {
      external_id: orderIdStr,
      amount: total,
      payer_email: userProfile?.email ?? user.email ?? "",
      description: `Order #${orderIdStr.slice(0, 8).toUpperCase()} - Modesy`,
      success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderIdStr}?status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=failed`,
      currency: "IDR",
      items: items.map((item: { title: string; price: number; quantity: number }) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        category: "Product",
      })),
      customer: {
        given_names: userProfile?.full_name ?? "Customer",
        email: userProfile?.email ?? user.email ?? "",
      },
    };

    console.log("[Xendit] Creating invoice for order:", orderIdStr);
    console.log("[Xendit] XENDIT_SECRET_KEY exists:", !!process.env.XENDIT_SECRET_KEY);
    console.log("[Xendit] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

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
      .eq("id", orderIdStr);

    return NextResponse.json({
      invoice_url: invoice.invoice_url,
      order_id: orderIdStr,
    });
  } catch (err) {
    console.error("Create invoice error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    console.error("Error stack:", errorStack);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: errorMessage,
      stack: errorStack 
    }, { status: 500 });
  }
}