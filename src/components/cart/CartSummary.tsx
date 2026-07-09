"use client";

import Link from "next/link";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, Trash2, ArrowRight, Package } from "lucide-react";

export default function CartSummary() {
  const { items, total, clearCart } = useCartStore();

  const subtotal = total();
  const shipping = subtotal > 50000 ? 0 : 10000; // Free shipping > 50k
  const finalTotal = subtotal + shipping;

  return (
    <div className="sticky top-4 space-y-4">
      {/* Main Summary Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            Ringkasan Pesanan
          </h2>
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Kosongkan
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl">
              <span className="truncate max-w-[180px] font-medium text-gray-700">
                {item.product_title} <span className="text-orange-500">×{item.quantity}</span>
              </span>
              <span className="font-semibold text-gray-900">
                <PriceDisplay amount={item.price * item.quantity} />
              </span>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium"><PriceDisplay amount={subtotal} /></span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              Ongkir
            </span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600 font-semibold">GRATIS</span>
              ) : (
                <PriceDisplay amount={shipping} />
              )}
            </span>
          </div>
          {subtotal < 50000 && subtotal > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
              💡 Belanja <PriceDisplay amount={50000 - subtotal} /> lagi untuk gratis ongkir!
            </p>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total Bayar</span>
          <span className="text-2xl font-bold text-orange-500">
            <PriceDisplay amount={finalTotal} />
          </span>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="group block w-full text-center gradient-brand text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          Lanjut ke Checkout
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Trust Badge */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-500">🔒 Pembayaran aman dengan enkripsi SSL</p>
      </div>
    </div>
  );
}
