"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isFollowing, toggleFollow } from "@/app/actions/follows";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  vendorId: string;
  vendorName: string;
}

export default function FollowButton({ vendorId, vendorName }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const result = await isFollowing(user.id, vendorId);
      setFollowing(result);
      setLoading(false);
    }
    check();
  }, [vendorId]);

  const handleToggle = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setToggling(true);
    setFollowing((prev) => !prev);

    try {
      await toggleFollow(user.id, vendorId);
    } catch {
      setFollowing((prev) => !prev);
    } finally {
      setToggling(false);
    }
  }, [vendorId]);

  if (loading) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-600 text-sm font-semibold text-gray-400 cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        following
          ? "bg-[#00a99d] text-white hover:bg-[#00998f] shadow-sm"
          : "border-2 border-[#00a99d] text-[#00a99d] hover:bg-[#00a99d] hover:text-white"
      )}
    >
      {toggling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : following ? (
        <>
          <Check className="w-4 h-4" />
          Following
        </>
      ) : (
        "Follow"
      )}
    </button>
  );
}
