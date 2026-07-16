import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserTickets } from "@/app/actions/tickets"
import { TicketCheck, Plus, ChevronRight, ArrowLeft, Clock } from "lucide-react"

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/help-center/tickets")

  const tickets: any[] = await getUserTickets()

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-teal-100 text-teal-700",
    urgent: "bg-red-100 text-red-700",
  }

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tiket Support</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola tiket bantuan kamu</p>
        </div>
        <Link
          href="/help-center/tickets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition"
        >
          <Plus className="w-4 h-4" />
          Tiket Baru
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <TicketCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Belum Ada Tiket</h2>
          <p className="text-sm text-gray-500 mb-6">Kamu belum membuat tiket support</p>
          <Link
            href="/help-center/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white hover:shadow-lg hover:shadow-teal-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            Buat Tiket
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: any) => (
            <Link
              key={ticket.id}
              href={`/help-center/tickets/${ticket.id}`}
              className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-teal-200 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.message}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status] || ""}`}>
                    {ticket.status === "open" ? "Terbuka" : "Ditutup"}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || ""}`}>
                    {ticket.priority}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/help-center"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pusat Bantuan
        </Link>
      </div>
    </div>
  )
}
