import { createClient } from "@/lib/supabase/server"
import { getAllAffiliates, getAffiliateConversions } from "@/app/actions/affiliates"
import { formatCurrency } from "@/lib/utils"
import AdminAffiliateClient from "./AdminAffiliateClient"

export default async function AdminAffiliatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const affiliates = await getAllAffiliates()
  const conversions = await getAffiliateConversions()

  return (
    <AdminAffiliateClient
      affiliates={affiliates}
      conversions={conversions}
    />
  )
}
