"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleFollow(followingId: string) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Authentication required")
  }

  // Check if already following
  const { data: existingFollow, error: checkError } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(`Failed to check follow status: ${checkError.message}`)
  }

  try {
    if (existingFollow) {
      // Unfollow
      const { error: deleteError } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", followingId)

      if (deleteError) throw deleteError
      
      revalidatePath(`/[username]`, "page")
      return { action: "unfollowed", success: true }
    } else {
      // Follow
      const { error: insertError } = await supabase
        .from("followers")
        .insert({
          follower_id: user.id,
          following_id: followingId
        })

      if (insertError) throw insertError
      
      revalidatePath(`/[username]`, "page")
      return { action: "followed", success: true }
    }
  } catch (error: any) {
    console.error("Toggle follow error:", error)
    throw new Error(`Failed to toggle follow: ${error.message}`)
  }
}

export async function getFollowStats(profileId: string) {
  const supabase = await createClient()
  
  const { count: followerCount, error: followerError } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId)

  const { count: followingCount, error: followingError } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileId)

  if (followerError || followingError) {
    console.error("Error fetching follow stats:", followerError || followingError)
    return { followers: 0, following: 0 }
  }

  return {
    followers: followerCount ?? 0,
    following: followingCount ?? 0
  }
}

export async function checkIsFollowing(profileId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  if (user.id === profileId) return false

  const { data, error } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", profileId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error checking follow:", error)
    return false
  }

  return !!data
}

export async function getFollowers(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("followers")
    .select("follower_id, created_at, follower:profiles!follower_id(id, username, full_name, avatar_url, bio, is_verified)")
    .eq("following_id", profileId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching followers:", error)
    return []
  }

  return data.map((item: any) => ({
    ...item.follower,
    followed_at: item.created_at,
  }))
}

export async function getFollowing(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("followers")
    .select("following_id, created_at, following:profiles!following_id(id, username, full_name, avatar_url, bio, is_verified)")
    .eq("follower_id", profileId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching following:", error)
    return []
  }

  return data.map((item: any) => ({
    ...item.following,
    followed_at: item.created_at,
  }))
}