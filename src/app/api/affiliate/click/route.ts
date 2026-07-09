import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { referralCode, productId } = await request.json()

    if (!referralCode) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: affiliate } = await supabase
      .from("affiliate_profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .single()

    if (!affiliate) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null
    const ua = request.headers.get("user-agent") ?? null
    const referrer = request.headers.get("referer") ?? null

    const { error } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      ip_address: ip ? ip.split(",")[0].trim() : null,
      user_agent: ua,
      referrer_url: referrer,
      product_id: productId ?? null,
    })

    if (error) throw error

    await supabase.rpc("increment_affiliate_clicks", { affiliate_id: affiliate.id })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    logger.error("Click tracking error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
