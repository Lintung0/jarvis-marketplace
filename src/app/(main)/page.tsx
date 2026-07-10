import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroSection />

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
