export default function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10 animate-pulse">
      {/* Gallery skeleton */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Info skeleton */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-4/5" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>

        {/* Price */}
        <div className="bg-[#0d0d1a] p-6 rounded-2xl space-y-2">
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>

        {/* Vendor */}
        <div className="flex items-center gap-3 p-4 bg-[#0a0a15] rounded-xl">
          <div className="h-12 w-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
