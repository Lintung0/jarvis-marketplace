import { createClient } from "@/lib/supabase/server"
import { BanUserButton } from "./BanUserButton"

export default async function ModeratorReportsPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender: profiles!sender_id(id, full_name, username, is_banned), receiver: profiles!receiver_id(full_name, username)")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports & Messages</h1>
      <p className="text-sm text-gray-500 mb-8">Monitor user communications.</p>

      {!messages || messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">💬</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages</h3>
          <p className="text-gray-500">No messages to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m: any) => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{m.sender?.full_name ?? m.sender?.username ?? "Unknown"}</p>
                    {m.sender?.is_banned && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">Banned</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">to {m.receiver?.full_name ?? m.receiver?.username ?? "Unknown"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {m.sender?.id && <BanUserButton userId={m.sender.id} isBanned={m.sender.is_banned} />}
                  <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-3">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
