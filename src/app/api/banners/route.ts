import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const placement = req.nextUrl.searchParams.get("placement")
    const admin = createAdminClient()

    let query = admin
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (placement) {
      query = query.eq("placement", placement)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
