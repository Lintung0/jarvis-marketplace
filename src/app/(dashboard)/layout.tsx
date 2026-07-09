import { redirect } from "next/navigation"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, is_banned, full_name, email, avatar_url")
    .eq("id", user.id)
    .single()

  if (profile?.is_banned) redirect("/banned")

  const role = (profile?.role as "vendor" | "moderator" | "admin") ?? "vendor"

  const admin = createAdminClient()
  const badgeCounts: Record<string, number> = {}

  const [{ count: pendingReturns }, { count: pendingApps }, { count: pendingProducts }, { count: unreadTickets }, { count: pendingPayouts }] = await Promise.all([
    admin.from("return_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("vendor_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("products").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    admin.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  if (pendingReturns && pendingReturns > 0) badgeCounts["/moderator/returns"] = pendingReturns
  if (pendingApps && pendingApps > 0) badgeCounts["/admin/vendor-applications"] = pendingApps
  if (pendingProducts && pendingProducts > 0) badgeCounts["/moderator/products"] = pendingProducts
  if (pendingProducts && pendingProducts > 0) badgeCounts["/admin/products"] = pendingProducts
  if (pendingPayouts && pendingPayouts > 0) badgeCounts["/admin/payouts"] = pendingPayouts

  const cookieStore = await cookies()
  const defaultOpen =
    cookieStore.get("sidebar_state")?.value === "true" ||
    cookieStore.get("sidebar_state") === undefined

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
          "--content-padding": "calc(var(--spacing) * 4)",
          "--content-margin": "calc(var(--spacing) * 2)",
          "--content-full-height":
            "calc(100vh - var(--header-height) - (var(--content-padding) * 2) - (var(--content-margin) * 2))"
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" role={role} badges={badgeCounts} />
      <SidebarInset>
        <SiteHeader userId={user.id} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main p-[var(--content-padding)]">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
