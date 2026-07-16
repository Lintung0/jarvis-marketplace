"use client"

import { useState, useEffect } from "react"
import { Store, Loader2, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { getUserApplication, applyAsVendor } from "@/app/actions/vendor-application"
import type { Profile } from "@/types"

interface Props {
  profile: Profile
}

export default function VendorApplicationCard({ profile }: Props) {
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [description, setDescription] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getUserApplication(profile.id)
      .then((app) => {
        setApplication(app)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [profile.id])

  if (profile.role === "vendor" || profile.role === "admin" || profile.role === "moderator") {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-40" />
        </div>
      </div>
    )
  }

  if (application?.status === "pending") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <Clock className="w-8 h-8 text-amber-500" />
        <div>
          <h3 className="font-semibold text-amber-800">Pengajuan Vendor Sedang Diproses</h3>
          <p className="text-sm text-amber-600">Admin akan mereview pengajuan kamu. Kami akan memberitahu hasilnya.</p>
        </div>
      </div>
    )
  }

  if (application?.status === "rejected") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-3">
          <XCircle className="w-8 h-8 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-800">Pengajuan Ditolak</h3>
            {application.admin_note && (
              <p className="text-sm text-red-600">{application.admin_note}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Ajukan Ulang →
        </button>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-teal-500" />
          Daftar Jadi Vendor
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Toko Elektronik Jaya"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Toko</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang toko kamu..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Ingin Jadi Vendor</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Kenapa kamu ingin berjualan di Modesy?"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                if (!storeName.trim()) { setError("Nama toko wajib diisi"); return }
                setSubmitting(true)
                setError("")
                try {
                  await applyAsVendor(storeName.trim(), description.trim(), reason.trim())
                  setShowForm(false)
                  // Re-fetch from DB instead of optimistic
                  const app = await getUserApplication(profile.id)
                  setApplication(app)
                } catch (e: any) {
                  setError(e.message)
                }
                setSubmitting(false)
              }}
              disabled={submitting}
              className="gradient-brand text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin inline mr-1" /> Mengirim...</>
              ) : "Kirim Pengajuan"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Store className="w-6 h-6 text-teal-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Jualan di Modesy?</h3>
          <p className="text-sm text-gray-600 mb-4">Daftar jadi vendor dan mulai jualan produk kamu! Proses cepat, komisi kompetitif.</p>
          <button
            onClick={() => setShowForm(true)}
            className="gradient-brand text-white px-5 py-2 rounded-xl font-semibold text-sm hover:shadow-lg transition-all inline-flex items-center gap-1"
          >
            Daftar Jadi Vendor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
