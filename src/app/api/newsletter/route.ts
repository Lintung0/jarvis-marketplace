import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email })

    if (error?.code === "23505") {
      return NextResponse.json({ message: "Email sudah terdaftar" })
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Berhasil berlangganan!" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
