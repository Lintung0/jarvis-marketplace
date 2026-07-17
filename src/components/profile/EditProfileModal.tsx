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
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar_url || "");
  const [formData, setFormData] = useState({
    full_name: profile.full_name ?? "",
    username: profile.username,
    location: profile.location ?? "",
    bio: profile.bio ?? "",
    website: profile.website ?? "",
    shop_policies: profile.shop_policies ?? "",
  });

  const isVendor = profile.role === "vendor";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return profile.avatar_url || null;

    setUploading(true);
    try {
      const supabase = createClient();
      
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          location: formData.location,
          bio: formData.bio,
          website: formData.website,
          shop_policies: formData.shop_policies || null,
          avatar_url: avatarUrl,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-gray-400 text-sm text-center px-2">
                      No photo
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatar-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`inline-block cursor-pointer px-5 py-3 rounded-xl border ${
                    uploading
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  } transition`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Choose Photo"
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="johndoe"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="Jakarta, Indonesia"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="https://example.com"
            />
          </div>

          {/* Shop Policies (Vendor only) */}
          {isVendor && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Policies
              </label>
              <textarea
                value={formData.shop_policies}
                onChange={(e) => setFormData({ ...formData, shop_policies: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-y"
                placeholder={`Contoh:
• Pengembangan: 14 hari setelah barang diterima
• Pengiriman: 1-3 hari kerja
• Pembayaran: Transfer bank / E-Wallet`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Aturan toko kamu — akan tampil di halaman profil vendor.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
