import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import WalletClient from "@/components/wallet/WalletClient";
import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";

export const metadata: Metadata = generateMeta({
  title: "My Wallet",
  description: "Manage your Modesy wallet balance",
  path: "/wallet",
  noIndex: true,
});

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  const { data: transactions } = await admin
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const balance = profile?.balance ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
        <WalletClient balance={balance} transactions={transactions ?? []} />
    </div>
  );
}
