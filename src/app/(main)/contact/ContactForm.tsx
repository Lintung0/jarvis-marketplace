"use client"

import { useState } from "react"
import { submitContact } from "@/app/actions/contact"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const formData = new FormData()
    formData.set("name", name)
    formData.set("email", email)
    formData.set("message", message)
    try {
      await submitContact(formData)
      setSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setError("Failed to send message")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
          Pesan berhasil dikirim! Kami akan menghubungi kamu segera.
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nama kamu"
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@kamu.com"
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tulis pesanmu di sini..."
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold text-sm gradient-brand text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
      >
        Kirim Pesan
      </button>
    </form>
  )
}
