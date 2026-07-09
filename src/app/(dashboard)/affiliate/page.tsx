import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAffiliateStats, getAffiliateTransactions, getAffiliateClicks } from "@/app/actions/affiliates"
import AffiliateDashboardClient from "./AffiliateDashboardClient"

export default async function AffiliatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const stats = await getAffiliateStats(user.id)
  const transactions = await getAffiliateTransactions(user.id)
  const clicks = await getAffiliateClicks(user.id)

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Affiliate Program</h2>
          <p className="text-gray-500">Your affiliate profile is being set up.</p>
        </div>
      </div>
    )
  }

  return (
    <AffiliateDashboardClient
      stats={stats}
      transactions={transactions}
      clicks={clicks}
    />
  )
}
