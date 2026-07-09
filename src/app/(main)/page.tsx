import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoriesSection from "@/components/sections/CategoriesSection";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroSection />

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
