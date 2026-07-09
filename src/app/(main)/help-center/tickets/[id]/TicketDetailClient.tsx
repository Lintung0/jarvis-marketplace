"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { replyToTicket, closeTicket as closeTicketAction } from "@/app/actions/tickets"
import { Clock, User, Send, XCircle } from "lucide-react"

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
}

export function TicketDetailClient({ ticket, userId, isAdmin }: { ticket: any; userId: string; isAdmin: boolean }) {
  const router = useRouter()
  const [reply, setReply] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set("message", reply)
      await replyToTicket(ticket.id, formData)
      setReply("")
      router.refresh()
    } catch {
      setError("Gagal mengirim balasan")
    } finally {
      setLoading(false)
    }
  }

  async function handleClose() {
    if (!confirm("Tutup tiket ini?")) return
    try {
      await closeTicketAction(ticket.id)
      router.refresh()
    } catch {
      setError("Gagal menutup tiket")
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(ticket.created_at).toLocaleDateString("id-ID", {
                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              ticket.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {ticket.status === "open" ? "Terbuka" : "Ditutup"}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || ""}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
      </div>

      {/* Replies */}
      {ticket.replies && ticket.replies.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Balasan ({ticket.replies.length})</h2>
          {ticket.replies.map((reply: any) => (
            <div
              key={reply.id}
              className={`bg-white border border-gray-200 rounded-2xl p-5 ${
                reply.user_id === userId ? "" : "border-orange-200 bg-orange-50/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  {reply.user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {reply.user_id === userId ? "Kamu" : (reply.user?.username || "Support")}
                  {reply.user?.role === "admin" && (
                    <span className="ml-1.5 text-xs text-orange-600 font-medium">(Admin)</span>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(reply.created_at).toLocaleDateString("id-ID", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {ticket.status === "open" && (
        <form onSubmit={handleReply} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balas</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
              rows={4}
              placeholder="Tulis balasan kamu..."
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Mengirim..." : "Kirim Balasan"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition"
            >
              <XCircle className="w-4 h-4" />
              Tutup Tiket
            </button>
          </div>
        </form>
      )}

      {ticket.status === "closed" && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500">Tiket ini sudah ditutup.</p>
        </div>
      )}
    </div>
  )
}
