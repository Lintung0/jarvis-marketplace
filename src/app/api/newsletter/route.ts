import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "Email sudah terdaftar!" }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ message: "Berhasil berlangganan newsletter!" }, { status: 200 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
