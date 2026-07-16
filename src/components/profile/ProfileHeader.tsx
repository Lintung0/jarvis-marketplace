"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, Mail, BadgeCheck, Shield, Star, Crown, Award, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./EditProfileModal";
import type { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { icon: Crown, label: "Admin", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" };
      case "moderator":
        return { icon: Shield, label: "Moderator", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200" };
      case "vendor":
        return { icon: Award, label: "Vendor", color: "bg-teal-500", textColor: "text-teal-700", bgColor: "bg-teal-50", borderColor: "border-teal-200" };
      default:
        return { icon: Star, label: "Member", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    }
  };

  const roleBadge = getRoleBadge(profile.role);
  const RoleIcon = roleBadge.icon;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-36 gradient-brand" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-5 -mt-14 relative">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name ?? profile.username}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center gradient-brand text-white text-4xl font-bold">
                    {(profile.full_name ?? profile.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {profile.is_verified && (
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 pt-4 sm:pt-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.full_name ?? profile.username}
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">@{profile.username}</p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${roleBadge.bgColor} ${roleBadge.textColor} ${roleBadge.borderColor}`}>
                      <RoleIcon className="w-3.5 h-3.5" />
                      {roleBadge.label}
                    </span>
                    {profile.is_verified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border bg-green-50 text-green-700 border-green-200">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                    {profile.plan_name && profile.plan_name !== "Free" && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
                        profile.plan_name === "Pro"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}>
                        <Crown className="w-3.5 h-3.5" />
                        {profile.plan_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{profile.email}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 mt-3 max-w-2xl text-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsEditOpen(true)} className="text-sm">
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal profile={profile} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}
