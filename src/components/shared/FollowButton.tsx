"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toggleFollow } from "@/app/actions/follows";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  vendorId: string;
  vendorName: string;
  initialFollowing?: boolean;
}

export default function FollowButton({ vendorId, vendorName, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = `/login?redirect=/vendors/${vendorName}`;
      return;
    }

    if (user.id === vendorId) return;

    setToggling(true);
    const previousState = following;

    try {
      setFollowing(!previousState);
      await toggleFollow(vendorId);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      setFollowing(previousState);
      alert("Failed to update follow status. Please try again.");
    } finally {
      setToggling(false);
    }
  }, [vendorId, vendorName, following]);

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        following
          ? "bg-teal-500 text-white hover:bg-teal-600 shadow-sm"
          : "border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
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
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
}
