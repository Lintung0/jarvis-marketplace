"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${JSON.stringify(selectedOptions)}`,
      product_id: product.id.toString(),
      product_title: product.title,
      product_slug: product.slug,
      product_image: product.images?.find((img) => img.is_primary)?.url ?? "",
      product_type: product.type,
      vendor_id: product.vendor_id,
      price: product.sale_price ?? product.price,
      quantity,
      options: selectedOptions,
    };
    
    addItem(cartItem);
    setAdded(true);
    toast.success("Ditambahkan ke keranjang!", {
      description: product.title,
    });
    setTimeout(() => setAdded(false), 2000);
  };

    const isOutOfStock = product.type === "physical" && product.stock === 0;

    return (
            <div className="space-y-4">
      {/* Opsi produk */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-3">
          {product.options.map((option) => (
            <div key={option.id}>
                <p className="text-sm font-medium text-gray-700 mb-1">
                {option.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleOptionChange(option.name, val)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      selectedOptions[option.name] === val
                        ? "bg-[#00a99d] text-white border-[#00a99d]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-500"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-700">Qty:</p>
        <div className="flex items-center border rounded-full overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-gray-400 hover:bg-gray-100 transition"
          >
            −
          </button>
          <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
          <button
            onClick={() =>
              setQuantity((q) =>
                product.type === "physical" ? Math.min(product.stock, q + 1) : q + 1
              )
            }
            className="px-3 py-1 text-gray-400 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
        {product.type === "physical" && (
          <p className="text-xs text-gray-400">Stok: {product.stock}</p>
        )}
      </div>

      {/* Tombol */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3 rounded-full font-semibold text-sm transition ${
          isOutOfStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-[#00a99d] text-white hover:bg-[#00998f]"
        }`}
      >
        {isOutOfStock ? "Stok Habis" : added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
      </button>
    </div>

    )
}