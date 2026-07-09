import { createClient } from "@/lib/supabase/server"
import { AdminTicketList } from "./AdminTicketList"

export default async function AdminTicketsPage(props: {
  searchParams: Promise<{ status?: string; priority?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  let query = supabase
    .from("tickets")
    .select("*, user:profiles!user_id(id, username, avatar_url)")
    .order("created_at", { ascending: false })

  if (searchParams.status) query = query.eq("status", searchParams.status)
  if (searchParams.priority) query = query.eq("priority", searchParams.priority)

  const { data: tickets } = await query

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500">{tickets?.length ?? 0} tickets</p>
        </div>
      </div>

      <AdminTicketList tickets={tickets ?? []} currentStatus={searchParams.status} currentPriority={searchParams.priority} />
    </div>
  )
}
