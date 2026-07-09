"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, Package } from "lucide-react";
import type { ProductImage } from "@/types";

interface Props {
  images: ProductImage[];
  title: string;
}

export default function ProductGalleryZoom({ images, title }: Props) {
  const primary = images.find((img) => img.is_primary) ?? images[0];
  const hasImage = !!primary?.url;
  const [selected, setSelected] = useState<string>(
    primary?.url ?? ""
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in group"
          onMouseEnter={() => setIsZoomed(hasImage)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => hasImage && setLightboxOpen(true)}
        >
          {hasImage ? (
            <Image
              src={selected}
              alt={title}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }
                  : {}
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelected(img.url)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                  selected === img.url
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] aspect-square">
            <Image
              src={selected}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}
    </>
  );
}
