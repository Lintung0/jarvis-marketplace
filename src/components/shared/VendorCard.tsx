import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Crown } from "lucide-react";
import type { Profile } from "@/types";

interface Props {
  vendor: Profile & { product_count?: number };
}

export default function VendorCard({ vendor }: Props) {
  return (
    <Link
      href={`/vendors/${vendor.username}`}
      className="group block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-teal-200 transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {vendor.avatar_url ? (
            <Image
              src={vendor.avatar_url}
              alt={vendor.full_name ?? vendor.username}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-gray-900 truncate group-hover:text-teal-500 transition-colors">
              {vendor.full_name ?? vendor.username}
            </p>
            {vendor.is_verified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
            {vendor.plan_name && vendor.plan_name !== "Free" && (
              <Crown className={`w-4 h-4 ${
                vendor.plan_name === "Pro" ? "text-teal-500" : "text-purple-500"
              }`} />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">@{vendor.username}</p>
          {vendor.location && (
            <p className="text-xs text-gray-400 mt-0.5">📍 {vendor.location}</p>
          )}
        </div>

        {/* Product count */}
        {vendor.product_count !== undefined && (
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-gray-900">{vendor.product_count}</p>
            <p className="text-xs text-gray-500">produk</p>
          </div>
        )}
      </div>

      {vendor.bio && (
        <p className="mt-3 text-xs text-gray-500 line-clamp-2">{vendor.bio}</p>
      )}
    </Link>
  );
}
