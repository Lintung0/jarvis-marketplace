"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { Message, Profile } from "@/types"

export interface Conversation {
  otherUser: Profile
  lastMessage: Message
  unreadCount: number
}

export async function sendMessage(receiverId: string, content: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const admin = createAdminClient()
  await admin.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content,
  })
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const admin = createAdminClient()

  const { data: messages } = await admin
    .from("messages")
    .select("*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (!messages) return []

  const grouped = new Map<string, { messages: Message[]; profile: Profile }>()

  for (const msg of messages) {
    const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
    const otherProfile = msg.sender_id === userId ? msg.receiver : msg.sender
    if (!grouped.has(otherId)) {
      grouped.set(otherId, { messages: [], profile: otherProfile })
    }
    grouped.get(otherId)!.messages.push(msg)
  }

  const conversations: Conversation[] = []

  for (const [, data] of grouped) {
    const lastMessage = data.messages[0]
    const unreadCount = data.messages.filter(
      (m) => m.receiver_id === userId && !m.is_read
    ).length

    conversations.push({
      otherUser: data.profile,
      lastMessage,
      unreadCount,
    })
  }

  return conversations.sort(
    (a, b) =>
      new Date(b.lastMessage.created_at).getTime() -
      new Date(a.lastMessage.created_at).getTime()
  )
}

export async function getMessages(
  userId: string,
  otherUserId: string
): Promise<Message[]> {
  const admin = createAdminClient()

  const { data } = await admin
    .from("messages")
    .select("*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
    )
    .order("created_at", { ascending: true })

  return (data ?? []) as unknown as Message[]
}

export async function markAsRead(senderId: string, currentUserId: string): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from("messages")
    .update({ is_read: true })
    .eq("sender_id", senderId)
    .eq("receiver_id", currentUserId)
    .eq("is_read", false)
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  const admin = createAdminClient()
  const { count } = await admin
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("is_read", false)

  return count ?? 0
}
