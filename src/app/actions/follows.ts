"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const admin = createAdminClient()
  const { data } = await admin
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle()

  return !!data
}

export async function getFollowCounts(profileId: string): Promise<{ followers: number; following: number }> {
  const admin = createAdminClient()

  const { count: followers } = await admin
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId)

  const { count: following } = await admin
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileId)

  return { followers: followers ?? 0, following: following ?? 0 }
}

export async function toggleFollow(followerId: string, followingId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  if (followerId !== user.id) throw new Error("Forbidden")

  const admin = createAdminClient()

  const { data: existing } = await admin
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle()

  if (existing) {
    const { error } = await admin
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await admin
      .from("follows")
      .insert({ follower_id: followerId, following_id: followingId })
    if (error) throw new Error(error.message)
  }
}
