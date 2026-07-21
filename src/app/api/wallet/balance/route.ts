import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ balance: profile?.balance ?? 0 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
