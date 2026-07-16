import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import SpecialOffers from "@/components/sections/SpecialOffers";
import BannersGrid from "@/components/sections/BannersGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import NewArrivals from "@/components/sections/NewArrivals";
import BrandCarousel from "@/components/sections/BrandCarousel";
import LatestBlog from "@/components/sections/LatestBlog";
import { ProductGridSkeleton } from "@/components/shared/ProductCardSkeleton";

export default function HomePage() {
  return (
    <div className="bg-gray-50 space-y-2">
      {/* 1. Main Slider */}
      <HeroSection />

      {/* 2. Shop By Category */}
      <Suspense fallback={null}>
        <CategoriesSection />
      </Suspense>

      {/* 3. Banners Grid */}
      <BannersGrid />

      {/* 4. Special Offers */}
      <Suspense fallback={null}>
        <SpecialOffers />
      </Suspense>

      {/* 5. Featured Products */}
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <FeaturedProducts />
      </Suspense>

      {/* 6. New Arrivals */}
      <Suspense fallback={null}>
        <NewArrivals />
      </Suspense>

      {/* 7. Brand Carousel */}
      <Suspense fallback={null}>
        <BrandCarousel />
      </Suspense>

      {/* 8. Latest Blog Posts */}
      <Suspense fallback={null}>
        <LatestBlog />
      </Suspense>
    </div>
  );
}
