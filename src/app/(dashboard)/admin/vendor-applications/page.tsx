import { logger } from "@/lib/logger"
import { createAdminClient } from "@/lib/supabase/server"
import VendorApplicationClient from "./VendorApplicationClient"

export default async function AdminVendorApplicationsPage() {
  const admin = createAdminClient()
  const { data: applications, error } = await admin
    .from("vendor_applications")
    .select("*, user:user_id(id, full_name, email, avatar_url)")
    .order("created_at", { ascending: false })

  if (error) {
    logger.error("[vendor-applications] query error:", error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-red-700">Error loading applications</h2>
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
        <p className="text-xs text-red-400 mt-2">Code: {error.code}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
        <p className="text-sm text-gray-500">{applications?.length ?? 0} total applications</p>
      </div>
      <VendorApplicationClient applications={(applications ?? []) as any[]} />
    </div>
  )
}
