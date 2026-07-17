import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount < 10000) {
      return NextResponse.json({ error: "Minimum top up Rp 10.000" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const admin = createAdminClient();

    // Buat wallet_transactions record
    const { data: tx, error: txError } = await admin
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        amount,
        type: "topup",
        status: "pending",
      })
      .select()
      .single();

    if (txError) throw new Error(txError.message);

    const externalId = `WALLET-${tx.id}`;

    // Buat Xendit invoice
    const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        amount,
        payer_email: profile?.email ?? user.email,
        description: `Top Up Wallet Rp${amount.toLocaleString("id-ID")} - Modesy`,
        success_redirect_url: `${APP_URL}/wallet?status=success`,
        failure_redirect_url: `${APP_URL}/wallet?status=failed`,
        currency: "IDR",
        customer: {
          given_names: profile?.full_name ?? user.email?.split("@")[0] ?? "User",
          email: profile?.email ?? user.email,
        },
        items: [
          {
            name: "Top Up Wallet Modesy",
            quantity: 1,
            price: amount,
            category: "Wallet",
          },
        ],
      }),
    });

    const invoice = await xenditRes.json();
    if (!xenditRes.ok) throw new Error(invoice.message || "Gagal buat invoice Xendit");

    // Simpan payment_id ke transaksi
    await admin
      .from("wallet_transactions")
      .update({ payment_id: invoice.id })
      .eq("id", tx.id);

    return NextResponse.json({ payment_url: invoice.invoice_url, transaction_id: tx.id });
  } catch (error: any) {
    console.error("Wallet topup error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
