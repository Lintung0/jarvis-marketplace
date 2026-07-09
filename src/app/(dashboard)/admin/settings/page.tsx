import { createClient } from "@/lib/supabase/server"
import { AdminSettingsForm } from "./AdminSettingsForm"
import { checkOpenAIConfig } from "@/app/actions/ai"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })
  const { data: orders } = await supabase.from("orders").select("total").in("status", ["paid", "processing", "shipped", "delivered"])
  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total), 0) ?? 0
  const storageDriver = process.env.STORAGE_DRIVER || "supabase"
  const aiConfig = await checkOpenAIConfig()

  const { data: watermarkSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "watermark_enabled")
    .single()
  const watermarkEnabled = watermarkSetting?.value === "true"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">System Settings</h1>
      <AdminSettingsForm stats={{ totalUsers: totalUsers ?? 0, totalProducts: totalProducts ?? 0, totalOrders: totalOrders ?? 0, totalRevenue }} storageDriver={storageDriver} aiConfig={aiConfig} watermarkEnabled={watermarkEnabled} />
    </div>
  )
}
