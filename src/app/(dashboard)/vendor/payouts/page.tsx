import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import PayoutRequestForm from "@/components/vendor/PayoutRequestForm";
import PayoutsList from "@/components/vendor/PayoutsList";

export const metadata = {
  title: "Payouts - Vendor Dashboard",
  description: "Manage your payout requests",
};

export default async function VendorPayoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, balance")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "vendor") redirect("/");

  const admin = createAdminClient();

  const { data: payouts } = await admin
    .from("payouts")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-sm text-gray-500 mt-1">Request withdrawal dari earnings Anda</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-90 mb-2">Available Balance</p>
        <h2 className="text-4xl font-bold">{formatCurrency(profile?.balance ?? 0)}</h2>
        <p className="text-xs opacity-75 mt-3">Minimum payout: Rp 50.000</p>
      </div>

      {/* Request Form */}
      <PayoutRequestForm balance={profile?.balance ?? 0} />

      {/* Payout History */}
      <PayoutsList payouts={payouts ?? []} />
    </div>
  );
}
