import sharp from "sharp"

const WATERMARK_TEXT = "JarvisMarketplace"
const WATERMARK_FONT_SIZE = 48
const WATERMARK_OPACITY = 0.3
const WATERMARK_PADDING = 20

export async function shouldApplyWatermark(): Promise<boolean> {
  const { createAdminClient } = await import("@/lib/supabase/server")
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "watermark_enabled")
    .single()
  return data?.value === "true"
}

export async function setWatermarkEnabled(enabled: boolean): Promise<void> {
  const { createAdminClient } = await import("@/lib/supabase/server")
  const supabase = createAdminClient()
  await supabase
    .from("settings")
    .upsert(
      { key: "watermark_enabled", value: String(enabled) },
      { onConflict: "key" }
    )
}

export async function processImage(buffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata()
  const width = metadata.width || 800

  const svgText = `<svg width="${width}" height="${Math.round(width * 0.08)}">
    <text
      x="${width - WATERMARK_PADDING}"
      y="${Math.round(width * 0.08) - WATERMARK_PADDING}"
      text-anchor="end"
      font-family="Arial, sans-serif"
      font-size="${WATERMARK_FONT_SIZE}"
      font-weight="bold"
      fill="rgba(255, 255, 255, ${WATERMARK_OPACITY})"
    >${WATERMARK_TEXT}</text>
  </svg>`

  const svgBuffer = Buffer.from(svgText)

  const watermarked = await sharp(buffer)
    .composite([
      {
        input: svgBuffer,
        top: Math.round((metadata.height || 600) - (Math.round(width * 0.08))),
        left: 0,
      },
    ])
    .toBuffer()

  return watermarked
}
