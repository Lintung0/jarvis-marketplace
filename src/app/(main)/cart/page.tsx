"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Keranjang Kosong</h2>
          <p className="text-gray-400 mb-8">Yuk belanja dulu, banyak produk menarik menanti!</p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 gradient-brand text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/products" 
          className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Lanjut Belanja</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Keranjang Belanja
      </h1>
      <p className="text-gray-400 mb-8">
        {items.length} produk siap untuk checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList items={items} />
        </div>
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
