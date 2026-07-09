"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendMessage, markAsRead } from "@/app/actions/messages"
import type { Message, Profile } from "@/types"
import { ArrowLeft, Send, Loader2, Check, CheckCheck } from "lucide-react"

interface Props {
  currentUserId: string
  otherUser: Profile
  initialMessages: Message[]
}

export default function ChatClient({ currentUserId, otherUser, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    markAsRead(otherUser.id, currentUserId)
  }, [currentUserId, otherUser.id])

  async function handleSend() {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    try {
      await sendMessage(otherUser.id, content)
      setInput("")

      const optimistic: Message = {
        id: crypto.randomUUID(),
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, optimistic])
      router.refresh()
    } catch {
      // silently fail
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
        <Link
          href="/chat"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden bg-gray-100">
          {otherUser.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              alt={otherUser.full_name ?? otherUser.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center gradient-brand text-white font-bold text-sm">
              {(otherUser.full_name ?? otherUser.username ?? "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {otherUser.full_name ?? otherUser.username ?? "Unknown"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? "gradient-brand text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <div className={`flex items-center gap-0.5 mt-1 ${isMine ? "justify-end" : ""}`}>
                  <span
                    className={`text-[10px] ${
                      isMine ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMine && (
                    msg.is_read
                      ? <CheckCheck className="w-3 h-3 text-white/70" />
                      : <Check className="w-3 h-3 text-white/70" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            rows={1}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 bg-white"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="h-11 w-11 rounded-full gradient-brand text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
