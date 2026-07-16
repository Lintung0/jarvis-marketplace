"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

interface EditProfileModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ profile, isOpen, onClose }: EditProfileModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name ?? "",
    username: profile.username,
    location: profile.location ?? "",
    bio: profile.bio ?? "",
    website: profile.website ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          location: formData.location,
          bio: formData.bio,
          website: formData.website,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#0d0d1a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2a2a4a]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a4a]">
          <h2 className="text-2xl font-bold text-gray-200">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a15] border border-[#2a2a4a] rounded-xl text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a15] border border-[#2a2a4a] rounded-xl text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="johndoe"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a15] border border-[#2a2a4a] rounded-xl text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="Jakarta, Indonesia"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#0a0a15] border border-[#2a2a4a] rounded-xl text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a15] border border-[#2a2a4a] rounded-xl text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="https://example.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2a2a4a] text-gray-400 hover:text-gray-200 hover:bg-[#12122a]"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
