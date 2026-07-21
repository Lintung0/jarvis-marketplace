"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function getWalletBalance() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    return profile?.balance ?? 0;
  } catch (error) {
    console.error("Error in getWalletBalance action:", error);
    return 0;
  }
}
