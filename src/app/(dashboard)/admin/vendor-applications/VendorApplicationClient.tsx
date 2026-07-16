"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Clock, Store, Loader2 } from "lucide-react"
import { approveApplication, rejectApplication } from "@/app/actions/vendor-application"

interface Application {
  id: string
  user_id: string
  store_name: string
  description: string | null
  reason: string | null
  status: string
  admin_note: string | null
  created_at: string
  user: { id: string; full_name: string | null; email: string; avatar_url: string | null } | null
}

interface Props {
  applications: Application[]
}

export default function VendorApplicationClient({ applications }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState("")

  async function handleApprove(id: string) {
    if (!confirm("Approve pengajuan vendor ini?")) return
    setLoading(id)
    try {
      await approveApplication(id)
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleReject(id: string) {
    if (!rejectNote.trim()) return
    setLoading(id)
    try {
      await rejectApplication(id, rejectNote.trim())
      setRejectId(null)
      setRejectNote("")
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-400">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Store Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Description</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Reason</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{app.user?.full_name || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{app.user?.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-teal-500" />
                    <span className="font-medium text-gray-900">{app.store_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{app.description || "—"}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{app.reason || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    app.status === "approved" ? "bg-green-50 text-green-700" :
                    app.status === "rejected" ? "bg-red-50 text-red-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {app.status === "approved" ? <CheckCircle className="w-3 h-3" /> :
                     app.status === "rejected" ? <XCircle className="w-3 h-3" /> :
                     <Clock className="w-3 h-3" />}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(app.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={loading === app.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                      >
                        {loading === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                      </button>
                      {rejectId === app.id ? (
                        <div className="flex gap-1">
                          <input
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="Alasan..."
                            className="w-28 px-2 py-1 text-xs border border-gray-200 rounded-lg"
                          />
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={loading === app.id || !rejectNote.trim()}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                          >
                            {loading === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setRejectId(app.id); setRejectNote("") }}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
