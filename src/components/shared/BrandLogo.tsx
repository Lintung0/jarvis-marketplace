"use client";

import { useState } from "react";
import Image from "next/image";

const LOCAL_LOGOS: Record<string, string> = {
  samsung: "/brands/samsung.png",
  apple: "/brands/apple.png",
  sony: "/brands/sony.png",
  nike: "/brands/nike.png",
  adidas: "/brands/adidas.png",
  asus: "/brands/asus.png",
  xiaomi: "/brands/xiaomi.png",
  logitech: "/brands/logitech.png",
  lg: "/brands/lg.png",
  lenovo: "/brands/lenovo.png",
  gucci: "/brands/gucci.png",
  puma: "/brands/puma.png",
  levis: "/brands/levis.png",
  zara: "/brands/zara.png",
  "under-armour": "/brands/under-armour.png",
};

interface BrandLogoProps {
  name: string;
  logo_url: string | null;
  slug?: string;
}

export default function BrandLogo({ name, logo_url, slug }: BrandLogoProps) {
  const [error, setError] = useState(false);

  const localSrc = slug ? LOCAL_LOGOS[slug.toLowerCase()] : null;
  const src = localSrc || logo_url;

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-teal-50 rounded-xl">
        <span className="font-bold text-teal-600 text-lg uppercase">
          {name.substring(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      unoptimized
      className="object-contain group-hover:scale-105 transition-transform"
      sizes="64px"
      onError={() => setError(true)}
    />
  );
}
