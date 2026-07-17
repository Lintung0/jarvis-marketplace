import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getFollowers } from "@/app/actions/follows";
import FollowButton from "@/components/shared/FollowButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users } from "lucide-react";
import { generateMeta } from "@/lib/seo";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return generateMeta({
    title: `Followers of ${username}`,
    description: `People following ${username} on Modesy`,
    path: `/vendors/${username}/followers`,
    noIndex: true,
  });
}

export default async function FollowersPage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .eq("username", username)
    .eq("role", "vendor")
    .single();

  if (!vendor) return notFound();

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const followers = await getFollowers(vendor.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Link href={`/vendors/${username}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900">Followers</h1>
            <p className="text-xs text-gray-500">{followers.length} followers</p>
          </div>
        </div>

        {followers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada followers</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {followers.map((follower: any) => (
              <div key={follower.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <Link href={`/vendors/${follower.username}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={follower.avatar_url} alt={follower.full_name || follower.username} />
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {(follower.full_name || follower.username || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link href={`/vendors/${follower.username}`} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {follower.full_name || follower.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{follower.username}</p>
                  {follower.bio && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{follower.bio}</p>
                  )}
                </Link>
                {currentUser && currentUser.id !== follower.id && (
                  <FollowButton vendorId={follower.id} vendorName={follower.full_name || follower.username} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
