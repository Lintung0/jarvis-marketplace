import ProductCard from "@/components/shared/ProductCard"
import EmptyState from "@/components/shared/EmptyState"
import { PackageX } from "lucide-react"
import type { Product } from "@/types";

interface Props {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = "Produk tidak ditemukan" }: Props) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageX}
        title="Tidak Ada Produk"
        description={emptyMessage}
        actionLabel="Lihat Semua Produk"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}