import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_banned")
    .eq("id", user.id)
    .single();

  if (profile?.is_banned) redirect("/banned");
  if (profile?.role !== "vendor") redirect("/products");

  return <>{children}</>;
}
