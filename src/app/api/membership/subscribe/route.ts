import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription_id, plan, user } = body;

    if (!subscription_id || !plan || !user) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const xenditPayload = {
      external_id: subscription_id,
      amount: plan.price,
      payer_email: user.email ?? "",
      description: `Langganan ${plan.name} - Modesy`,
      success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/membership/subscribe/callback?subscription_id=${subscription_id}&status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/membership?status=failed`,
      currency: "IDR",
      items: [
        {
          name: `Paket ${plan.name} - ${plan.duration_days} Hari`,
          quantity: 1,
          price: plan.price,
          category: "Membership",
        },
      ],
      customer: {
        given_names: user.email?.split("@")[0] ?? "Vendor",
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

    if (!xenditRes.ok) {
      const xenditError = await xenditRes.json();
      logger.error("Xendit error:", xenditError);
      return NextResponse.json({ error: "Failed to create Xendit invoice" }, { status: 500 });
    }

    const invoice = await xenditRes.json();

    const admin = createAdminClient();
    await admin
      .from("vendor_subscriptions")
      .update({ payment_id: invoice.id })
      .eq("id", subscription_id);

    return NextResponse.json({ invoice_url: invoice.invoice_url });
  } catch (err) {
    logger.error("Subscribe error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
