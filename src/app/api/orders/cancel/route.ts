import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { order_id, reason, reason_detail } = body;

    if (!order_id || !reason) {
      return NextResponse.json({ error: "Order ID dan alasan diperlukan" }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status, buyer_id")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.buyer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ error: "Hanya pesanan dengan status pending yang bisa dibatalkan" }, { status: 400 });
    }

    const cancelInfo = JSON.stringify({
      reason,
      reason_detail: reason_detail || null,
      cancelled_at: new Date().toISOString(),
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        notes: cancelInfo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    if (updateError) {
      logger.error("Cancel order error:", updateError);
      return NextResponse.json({ error: "Gagal membatalkan pesanan" }, { status: 500 });
    }

    return NextResponse.json({ status: "cancelled" });
  } catch (err) {
    logger.error("Cancel order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
