import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { items, shippingAddress, coupon_code, discount_amount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart kosong" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity, 0
    );
    const total = subtotal - (discount_amount ?? 0);

    const admin = createAdminClient();

    // Cek saldo wallet
    const { data: profile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.balance < total) {
      return NextResponse.json({ error: "Saldo wallet tidak mencukupi" }, { status: 400 });
    }

    // Gunakan SECURITY DEFINER function untuk create order (bypass RLS)
    const { data: orderId, error: orderError } = await supabase
      .rpc('create_order', {
        p_buyer_id: user.id,
        p_total: total,
        p_shipping_address: shippingAddress ?? null,
        p_payment_method: "wallet",
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
      return NextResponse.json({
        error: "Gagal buat order",
        details: orderError?.message || orderError,
        code: orderError?.code,
      }, { status: 500 });
    }

    const orderIdStr = orderId as string;

    // Deduct wallet balance
    const newBalance = profile.balance - total;
    await admin
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", user.id);

    // Catat transaksi wallet (payment)
    await admin
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        amount: total,
        type: "payment",
        status: "success",
        notes: `Pembayaran order #${orderIdStr.slice(0, 8)}`,
      });

    // Update order status to paid
    await admin
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", orderIdStr);

    // Calculate & store vendor earnings
    const { data: orderItems } = await admin
      .from("order_items")
      .select("id, price, quantity, commission_rate, vendor_id")
      .eq("order_id", orderIdStr);

    if (orderItems) {
      for (const item of orderItems) {
        const rate = item.commission_rate ?? 10;
        const earning = Math.round(item.price * item.quantity * (1 - rate / 100) * 100) / 100;
        await admin
          .from("order_items")
          .update({ vendor_earning: earning })
          .eq("id", item.id);

        // Transfer earning ke vendor wallet
        if (item.vendor_id && earning > 0) {
          const { data: vendor } = await admin
            .from("profiles")
            .select("balance")
            .eq("id", item.vendor_id)
            .single();

          const vendorNewBalance = (vendor?.balance ?? 0) + earning;
          await admin
            .from("profiles")
            .update({ balance: vendorNewBalance })
            .eq("id", item.vendor_id);

          await admin
            .from("wallet_transactions")
            .insert({
              user_id: item.vendor_id,
              amount: earning,
              type: "payment",
              status: "success",
              notes: `Earning dari order #${orderIdStr.slice(0, 8)}`,
            });
        }
      }
    }

    // Increment coupon used_count
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

    // Clear cart
    await admin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, order_id: orderIdStr });
  } catch (err) {
    console.error("Wallet pay error:", err);
    return NextResponse.json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
