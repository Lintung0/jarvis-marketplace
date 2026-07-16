"use client";

import { useState } from "react";
import Image from "next/image";

interface BrandLogoProps {
  name: string;
  logo_url: string | null;
}

export default function BrandLogo({ name, logo_url }: BrandLogoProps) {
  const [error, setError] = useState(false);

  if (!logo_url || error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
          {name.substring(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={logo_url}
      alt={name}
      fill
      unoptimized
      className="object-contain p-3 group-hover:scale-105 transition-transform"
      sizes="128px"
      onError={() => setError(true)}
    />
  );
}
