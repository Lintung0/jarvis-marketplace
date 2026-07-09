import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./NavbarClient";
import { getUnreadMessageCount } from "@/app/actions/messages";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let unreadMessages = 0;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, role, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
    unreadMessages = await getUnreadMessageCount(user.id);
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .order("name")
    .limit(8);

  return (
    <NavbarClient user={user} profile={profile} categories={categories ?? []} unreadMessages={unreadMessages} />
  );
}
