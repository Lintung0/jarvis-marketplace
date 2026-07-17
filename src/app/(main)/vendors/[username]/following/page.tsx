import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getFollowing } from "@/app/actions/follows";
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
    title: `${username} is following`,
    description: `People ${username} follows on Modesy`,
    path: `/vendors/${username}/following`,
    noIndex: true,
  });
}

export default async function FollowingPage({ params }: PageProps) {
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
  const following = await getFollowing(vendor.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Link href={`/vendors/${username}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900">Following</h1>
            <p className="text-xs text-gray-500">{following.length} following</p>
          </div>
        </div>

        {following.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Tidak mengikuti siapapun</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {following.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition">
                <Link href={`/vendors/${item.username}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.avatar_url} alt={item.full_name || item.username} />
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {(item.full_name || item.username || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link href={`/vendors/${item.username}`} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.full_name || item.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{item.username}</p>
                  {item.bio && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.bio}</p>
                  )}
                </Link>
                {currentUser && currentUser.id !== item.id && (
                  <FollowButton vendorId={item.id} vendorName={item.full_name || item.username} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
