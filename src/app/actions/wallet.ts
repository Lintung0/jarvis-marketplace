"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function getWalletBalance(userId: string) {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    return profile?.balance ?? 0;
  } catch (error) {
    console.error("Error in getWalletBalance action:", error);
    return 0;
  }
}
