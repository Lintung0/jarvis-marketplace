import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getConversations } from "@/app/actions/messages"
import { MessageCircle } from "lucide-react"
import type { Conversation } from "@/app/actions/messages"

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/chat")

  const conversations = await getConversations(user.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-brand" />
        <h1 className="text-2xl font-bold">Pesan</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Belum ada percakapan</p>
          <p className="text-sm mt-1">Mulai chat dengan vendor dari halaman produk</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <ConversationCard key={conv.otherUser.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConversationCard({ conversation }: { conversation: Conversation }) {
  const { otherUser, lastMessage, unreadCount } = conversation

  const timeAgo = getTimeAgo(new Date(lastMessage.created_at))

  return (
    <Link
      href={`/chat/${otherUser.id}`}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
        unreadCount > 0
          ? "bg-orange-50/50 border-orange-200"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {otherUser.avatar_url ? (
          <img
            src={otherUser.avatar_url}
            alt={otherUser.full_name ?? otherUser.username}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          (otherUser.full_name ?? otherUser.username ?? "U").charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate ${
              unreadCount > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"
            }`}
          >
            {otherUser.full_name ?? otherUser.username ?? "Unknown"}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className={`text-sm truncate ${
              unreadCount > 0 ? "font-semibold text-gray-800" : "text-gray-500"
            }`}
          >
            {lastMessage.content}
          </span>
          {unreadCount > 0 && (
            <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Baru saja"
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}j`
  if (diffDays < 7) return `${diffDays}h`

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
}
