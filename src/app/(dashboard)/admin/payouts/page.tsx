import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import PayoutActions from "@/components/admin/PayoutActions";

export const metadata = {
  title: "Payouts - Admin Dashboard",
  description: "Manage vendor payout requests",
};

export default async function AdminPayoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "moderator") redirect("/");

  const admin = createAdminClient();

  const { data: payouts } = await admin
    .from("payouts")
    .select(`
      *,
      vendor:profiles!vendor_id(username, full_name, email)
    `)
    .order("created_at", { ascending: false });

  const pendingCount = payouts?.filter((p) => p.status === "pending").length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts?.map((payout: any) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {payout.vendor?.full_name || payout.vendor?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">{payout.vendor?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(payout.amount)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{payout.bank_name}</p>
                      <p className="text-xs text-gray-500">{payout.account_number}</p>
                      <p className="text-xs text-gray-500">{payout.account_holder}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === "pending" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                    {payout.status === "approved" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Approved
                      </span>
                    )}
                    {payout.status === "completed" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Completed
                      </span>
                    )}
                    {payout.status === "rejected" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600">
                      {new Date(payout.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === "pending" && (
                      <PayoutActions payoutId={payout.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
