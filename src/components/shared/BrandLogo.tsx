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
      <div className="w-full h-full flex items-center justify-center bg-teal-50 rounded-xl">
        <span className="font-bold text-teal-600 text-lg uppercase">
          {name.substring(0, 2)}
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
      className="object-contain group-hover:scale-105 transition-transform"
      sizes="64px"
      onError={() => setError(true)}
    />
  );
}
