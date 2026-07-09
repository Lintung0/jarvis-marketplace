import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subscription_id = searchParams.get("subscription_id");
    const status = searchParams.get("status");

    if (!subscription_id || status !== "success") {
      return NextResponse.redirect(new URL("/membership?status=failed", req.url));
    }

    const admin = createAdminClient();

    const { data: sub } = await admin
      .from("vendor_subscriptions")
      .select("id, status, payment_id")
      .eq("id", subscription_id)
      .single();

    if (!sub) {
      return NextResponse.redirect(new URL("/membership?status=not_found", req.url));
    }

    if (sub.payment_id) {
      const xenditRes = await fetch(`https://api.xendit.co/v2/invoices/${sub.payment_id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.XENDIT_SECRET_KEY + ":"
          ).toString("base64")}`,
        },
      });

      if (xenditRes.ok) {
        const invoice = await xenditRes.json();
        if (invoice.status === "PAID") {
          await admin
            .from("vendor_subscriptions")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("id", subscription_id);

          return NextResponse.redirect(new URL("/vendor?subscribed=success", req.url));
        }
      }
    }

    return NextResponse.redirect(new URL("/membership?status=pending", req.url));
  } catch (err) {
    logger.error("Callback error:", err);
    return NextResponse.redirect(new URL("/membership?status=error", req.url));
  }
}
