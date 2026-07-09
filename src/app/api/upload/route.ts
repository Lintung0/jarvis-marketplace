import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { getStorageDriver } from "@/lib/storage/client"
import sharp from "sharp"

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "audio/mpeg",
]

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

async function isWatermarkEnabled(): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "watermark_enabled")
      .single()
    return data?.value === "true"
  } catch {
    return false
  }
}

async function applyWatermarkToBuffer(buffer: Buffer, ext: string): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 600
  const fontSize = Math.max(24, Math.round(width * 0.06))
  const padding = Math.max(10, Math.round(width * 0.025))
  const svgHeight = fontSize + padding * 2

  const svg = `<svg width="${width}" height="${svgHeight}">
    <text
      x="${width - padding}"
      y="${svgHeight - padding}"
      text-anchor="end"
      font-family="Arial, sans-serif"
      font-size="${fontSize}"
      font-weight="bold"
      fill="rgba(255,255,255,0.3)"
    >JarvisMarketplace</text>
  </svg>`

  return sharp(buffer)
    .composite([{ input: Buffer.from(svg), top: height - svgHeight, left: 0 }])
    .toBuffer()
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB" },
        { status: 400 }
      )
    }

    const ext = file.name.split(".").pop() || "bin"
    const timestamp = Date.now()
    const randomId = crypto.randomUUID().slice(0, 8)
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40)
    const path = `uploads/${user.id}/${timestamp}-${randomId}-${sanitizedName}.${ext}`

    const storage = getStorageDriver()

    const watermarkEnabled = IMAGE_TYPES.includes(file.type) && await isWatermarkEnabled()

    if (watermarkEnabled) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const watermarked = await applyWatermarkToBuffer(buffer, ext)
      const watermarkedFile = new File([new Uint8Array(watermarked)], file.name, { type: file.type })
      const { url } = await storage.upload(path, watermarkedFile, {
        contentType: file.type,
      })
      return NextResponse.json({ url, watermarked: true })
    }

    const { url } = await storage.upload(path, file, {
      contentType: file.type,
    })

    return NextResponse.json({ url })
  } catch (err) {
    logger.error("Upload error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
