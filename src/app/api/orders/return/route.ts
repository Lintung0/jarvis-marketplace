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
    const { order_id, reason, description } = body;

    if (!order_id || !reason) {
      return NextResponse.json({ error: "Order ID and reason required" }, { status: 400 });
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

    if (order.status !== "delivered") {
      return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("return_requests")
      .select("id")
      .eq("order_id", order_id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You already have a pending return request for this order" }, { status: 400 });
    }

    const { error } = await supabase.from("return_requests").insert({
      order_id,
      user_id: user.id,
      reason,
      description: description || null,
    });

    if (error) {
      logger.error("Return request error:", error);
      return NextResponse.json({ error: "Failed to create return request" }, { status: 500 });
    }

    // Notifikasi moderator
    const { data: mods } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["moderator", "admin"])

    if (mods) {
      const notifPayload = mods.map((m: any) => ({
        user_id: m.id,
        type: "return_request",
        message: `New return request for order #${order_id.slice(0, 8)}: ${reason}`,
        order_id,
      }))
      await supabase.from("notifications").insert(notifPayload)
    }

    return NextResponse.json({ status: "created" });
  } catch (err) {
    logger.error("Return request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
