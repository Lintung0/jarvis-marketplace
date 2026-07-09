"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTicket } from "@/app/actions/tickets"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const priorities = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
  { value: "urgent", label: "Darurat" },
]

export default function NewTicketPage() {
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("medium")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set("subject", subject)
      formData.set("message", message)
      formData.set("priority", priority)
      await createTicket(formData)
    } catch (err: any) {
      setError(err.message || "Gagal membuat tiket")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/help-center/tickets"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tiket
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Tiket Baru</h1>
        <p className="text-sm text-gray-500 mt-1">Kami akan merespon tiket kamu secepatnya</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Contoh: Saya mengalami masalah pembayaran"
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="Jelaskan masalah kamu secara detail..."
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Tiket"}
        </button>
      </form>
    </div>
  )
}
