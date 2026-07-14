"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfileLocation(location: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("profiles")
    .update({ location, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  revalidatePath("/profile")
}
