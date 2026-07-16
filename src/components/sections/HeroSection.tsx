"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";

const slides = [
  {
    title: "Buy Nice and Unique Clothes",
    description: "Discover quality premium basics and trendy essentials at surprisingly affordable prices",
    cta: "Explore Now",
    ctaLink: "/products?category=clothing",
    image: "https://modesy.codingest.com/uploads/slider/202508/slider_1920x600_68b028713e9588-19411744.webp",
  },
  {
    title: "Find Backpacks That Best Suit You",
    description: "Timeless, modern, and feminine pieces made with quality materials and craftsmanship",
    cta: "Explore Now",
    ctaLink: "/products",
    image: "https://modesy.codingest.com/uploads/slider/202508/slider_1920x600_68b028a0cbc3d9-48789346.webp",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-gray-950 h-[320px] sm:h-[450px] md:h-[600px] group">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover object-center select-none"
            sizes="100vw"
          />

          {/* Dark Overlay for better contrast */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Caption */}
          <div className="absolute inset-0 flex items-center justify-start z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-left space-y-4 md:space-y-6">
                <h1 
                  className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md select-none transform translate-y-0 transition-all duration-700"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed max-w-xl drop-shadow-sm select-none">
                  {slide.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={slide.ctaLink}
                    className="inline-block px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-lg bg-white text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all cursor-pointer"
            style={{
              width: i === active ? 28 : 8,
              background: i === active ? "#00a99d" : "rgba(255, 255, 255, 0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
