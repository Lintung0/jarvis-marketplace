import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMessages } from "@/app/actions/messages"
import ChatClient from "@/components/chat/ChatClient"
import type { Profile } from "@/types"

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function ChatDetailPage({ params }: PageProps) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  if (userId === user.id) redirect("/chat")

  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!otherProfile) notFound()

  const initialMessages = await getMessages(user.id, userId)

  return (
    <ChatClient
      currentUserId={user.id}
      otherUser={otherProfile as Profile}
      initialMessages={initialMessages}
    />
  )
}
