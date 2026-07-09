"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const subject = formData.get("subject") as string
  const message = formData.get("message") as string
  const priority = formData.get("priority") as string || "medium"

  const { error } = await supabase.from("tickets").insert({
    user_id: user.id,
    subject,
    message,
    priority,
    status: "open",
  })

  if (error) throw new Error(error.message)
  revalidatePath("/help-center/tickets")
  redirect("/help-center/tickets")
}

export async function getUserTickets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data ?? []
}

export async function getTicket(ticketId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, replies:ticket_replies(*, user:profiles!user_id(id, username, avatar_url, role))")
    .eq("id", ticketId)
    .maybeSingle()

  if (!ticket) return null
  if (ticket.user_id !== user.id) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") return null
  }
  return ticket
}

export async function replyToTicket(ticketId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const message = formData.get("message") as string

  const { error } = await supabase.from("ticket_replies").insert({
    ticket_id: ticketId,
    user_id: user.id,
    message,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/help-center/tickets/${ticketId}`)
}

export async function closeTicket(ticketId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: ticket } = await supabase
    .from("tickets")
    .select("user_id")
    .eq("id", ticketId)
    .single()

  if (!ticket) throw new Error("Ticket not found")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()

  if (ticket.user_id !== user.id && profile?.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("tickets")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", ticketId)

  if (error) throw new Error(error.message)
  revalidatePath(`/help-center/tickets/${ticketId}`)
}

export async function getAllTickets(status?: string, priority?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return []

  let query = supabase
    .from("tickets")
    .select("*, user:profiles!user_id(id, username, avatar_url)")
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)
  if (priority) query = query.eq("priority", priority)

  const { data } = await query
  return data ?? []
}

export async function adminReplyToTicket(ticketId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const message = formData.get("message") as string

  const { error } = await supabase.from("ticket_replies").insert({
    ticket_id: ticketId,
    user_id: user.id,
    message,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/tickets")
}

export async function adminCloseTicket(ticketId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase
    .from("tickets")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", ticketId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/tickets")
}
