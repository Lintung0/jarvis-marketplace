"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminReplyToTicket, adminCloseTicket } from "@/app/actions/tickets"
import { Clock, Send, XCircle, ChevronDown, ChevronUp } from "lucide-react"

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
}

export function AdminTicketList({
  tickets,
  currentStatus,
  currentPriority,
}: {
  tickets: any[]
  currentStatus?: string
  currentPriority?: string
}) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  async function handleReply(ticketId: string) {
    const message = replies[ticketId]
    if (!message) return
    setLoading((prev) => ({ ...prev, [ticketId]: true }))
    try {
      const formData = new FormData()
      formData.set("message", message)
      await adminReplyToTicket(ticketId, formData)
      setReplies((prev) => ({ ...prev, [ticketId]: "" }))
      router.refresh()
    } catch {
      alert("Failed to send reply")
    } finally {
      setLoading((prev) => ({ ...prev, [ticketId]: false }))
    }
  }

  async function handleClose(ticketId: string) {
    if (!confirm("Close this ticket?")) return
    try {
      await adminCloseTicket(ticketId)
      router.refresh()
    } catch {
      alert("Failed to close ticket")
    }
  }

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/admin/tickets?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={currentStatus || ""}
          onChange={(e) => applyFilter("status", e.target.value)}
          className="bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:border-orange-400 outline-none"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={currentPriority || ""}
          onChange={(e) => applyFilter("priority", e.target.value)}
          className="bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-1.5 text-sm focus:border-orange-400 outline-none"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Tickets */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-2xl">
          <p>No tickets found</p>
        </div>
      ) : (
        tickets.map((ticket: any) => (
          <div key={ticket.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
              className="w-full flex items-start justify-between p-5 text-left hover:bg-gray-50 transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{ticket.subject}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {ticket.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || ""}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{ticket.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{ticket.user?.username || "Unknown"}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
              {expandedId === ticket.id ? (
                <ChevronUp className="w-5 h-5 text-gray-300 shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-300 shrink-0 ml-4" />
              )}
            </button>

            {expandedId === ticket.id && ticket.status === "open" && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                <textarea
                  value={replies[ticket.id] || ""}
                  onChange={(e) => setReplies((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                  placeholder="Type your reply..."
                  rows={3}
                  className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReply(ticket.id)}
                    disabled={loading[ticket.id] || !replies[ticket.id]}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {loading[ticket.id] ? "Sending..." : "Reply"}
                  </button>
                  <button
                    onClick={() => handleClose(ticket.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Close
                  </button>
                </div>
              </div>
            )}

            {expandedId === ticket.id && ticket.status === "closed" && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-400">Ticket closed</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
