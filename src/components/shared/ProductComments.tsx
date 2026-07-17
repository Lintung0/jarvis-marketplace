"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Reply, Trash2, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import type { ProductComment } from "@/types"

interface Props {
  productId: string
}

export default function ProductComments({ productId }: Props) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [comments, setComments] = useState<ProductComment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    loadComments()
  }, [productId])

  async function loadComments() {
    const supabase = createClient()
    const { data } = await supabase
      .from("product_comments")
      .select("*, user:profiles!user_id(id, username, full_name, avatar_url)")
      .eq("product_id", productId)
      .order("created_at", { ascending: true })

    if (data) {
      const grouped: ProductComment[] = []
      const map = new Map<string, ProductComment>()
      for (const c of data) {
        map.set(c.id, { ...c, replies: [] } as ProductComment)
      }
      for (const c of map.values()) {
        if (c.parent_id && map.has(c.parent_id)) {
          map.get(c.parent_id)!.replies!.push(c)
        } else if (!c.parent_id) {
          grouped.push(c)
        }
      }
      setComments(grouped)
    }
    setLoading(false)
  }

  async function handleSubmit() {
    if (!user) {
      router.push("/login")
      return
    }
    if (!newComment.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("product_comments").insert({
      product_id: productId,
      user_id: user.id,
      content: newComment.trim(),
    })
    setNewComment("")
    setSubmitting(false)
    loadComments()
  }

  async function handleReply(parentId: string) {
    if (!user) {
      router.push("/login")
      return
    }
    if (!replyText.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("product_comments").insert({
      product_id: productId,
      user_id: user.id,
      content: replyText.trim(),
      parent_id: parentId,
    })
    setReplyText("")
    setReplyTo(null)
    setSubmitting(false)
    loadComments()
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Hapus komentar ini?")) return
    const supabase = createClient()
    await supabase.from("product_comments").delete().eq("id", commentId)
    loadComments()
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "baru saja"
    if (mins < 60) return `${mins}m lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}j lalu`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}h lalu`
    return new Date(date).toLocaleDateString("id-ID")
  }

  return (
    <div>
      {/* New Comment Form */}
      <div className="flex gap-3 mb-6">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
          <AvatarFallback className="rounded-full bg-teal-100 text-teal-700 text-sm">
            {(user?.full_name || user?.username || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={user ? "Tulis komentar..." : "Login untuk berkomentar"}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim() || !user}
            size="icon"
            className="bg-teal-500 hover:bg-teal-600 text-white shrink-0 rounded-xl"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Belum ada diskusi. Jadilah yang pertama!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={comment.user?.avatar_url || ""} alt={comment.user?.full_name || ""} />
                  <AvatarFallback className="rounded-full bg-gray-100 text-gray-600 text-xs">
                    {(comment.user?.full_name || comment.user?.username || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.user?.full_name || comment.user?.username || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 ml-2">
                    {user && (
                      <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="text-xs text-gray-500 hover:text-teal-600 flex items-center gap-1 font-medium"
                      >
                        <Reply className="w-3 h-3" />
                        Balas
                      </button>
                    )}
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className="flex gap-2 mt-2 ml-12 mb-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleReply(comment.id)}
                        placeholder="Tulis balasan..."
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                        autoFocus
                      />
                      <Button
                        onClick={() => handleReply(comment.id)}
                        disabled={submitting || !replyText.trim()}
                        size="icon"
                        className="bg-teal-500 hover:bg-teal-600 text-white shrink-0 rounded-xl"
                      >
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-2 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={reply.user?.avatar_url || ""} alt={reply.user?.full_name || ""} />
                        <AvatarFallback className="rounded-full bg-gray-100 text-gray-600 text-xs">
                          {(reply.user?.full_name || reply.user?.username || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {reply.user?.full_name || reply.user?.username || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{reply.content}</p>
                        </div>
                        {user?.id === reply.user_id && (
                          <button
                            onClick={() => handleDelete(reply.id)}
                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 mt-1 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
