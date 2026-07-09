"use server"

import { createClient } from "@/lib/supabase/server"
import { shouldApplyWatermark, processImage } from "@/lib/watermark"
import { getStorageDriver } from "@/lib/storage/client"

export async function applyWatermark(imageUrl: string): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const enabled = await shouldApplyWatermark()
  if (!enabled) return imageUrl

  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error("Failed to fetch image")

  const buffer = Buffer.from(await response.arrayBuffer())
  const watermarked = await processImage(buffer)

  const urlObj = new URL(imageUrl)
  const pathParts = urlObj.pathname.split("/")
  const filename = pathParts.pop() || "image"
  const ext = filename.split(".").pop() || "png"
  const watermarkPath = `watermarked/${user.id}/${Date.now()}-${filename}`

  const storage = getStorageDriver()
  const { url } = await storage.upload(watermarkPath, watermarked, {
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  })

  return url
}

export async function getWatermarkSetting(): Promise<boolean> {
  const { shouldApplyWatermark } = await import("@/lib/watermark")
  return shouldApplyWatermark()
}
