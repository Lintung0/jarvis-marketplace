import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getTicket, closeTicket } from "@/app/actions/tickets"
import { TicketDetailClient } from "./TicketDetailClient"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function TicketDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const ticket: any = await getTicket(id)
  if (!ticket) redirect("/help-center/tickets")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.role === "admin"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href={isAdmin ? "/admin/tickets" : "/help-center/tickets"}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
      </div>

      <TicketDetailClient ticket={ticket} userId={user.id} isAdmin={isAdmin} />
    </div>
  )
}
