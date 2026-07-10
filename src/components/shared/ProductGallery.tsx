"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import type { ProductImage } from "@/types";

interface Props{
    images: ProductImage[];
    title: string;
}

export default function ProductGallery({ images, title}: Props) {
    const sorted = [...images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        const sortDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (sortDiff !== 0) return sortDiff;
        return (a.url || "").localeCompare(b.url || "");
    });
    const primary = sorted[0];
    const hasImage = !!primary?.url;
    const [selected, setSelected] = useState<string>(
        primary?.url ?? ""
    );

    return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={selected || primary.url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img.url)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                (selected || primary.url) === img.url
                  ? "border-orange-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
    );
}
