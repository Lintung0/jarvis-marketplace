import type { SupabaseClient } from "@supabase/supabase-js"

export async function getActiveVendorIds(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "vendor")
    .eq("is_banned", false)

  return (data ?? []).map((p) => p.id)
}
