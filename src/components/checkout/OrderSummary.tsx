"use client";

import { useState } from "react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import type { ClientCartItem } from "@/types";
import { ShoppingBag, CreditCard, Lock, Package, Tag, X } from "lucide-react";

interface Props {
  items: ClientCartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  couponCode: string | null;
  discountAmount: number;
  couponError: string | null;
  couponLoading: boolean;
  onCheckout?: () => void;
  onContinue?: () => void;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export default function OrderSummary({
  items, total, loading, error,
  couponCode, discountAmount, couponError, couponLoading,
  onCheckout, onContinue, onApplyCoupon, onRemoveCoupon,
}: Props) {
  const [inputCode, setInputCode] = useState("");

  const subtotal = total;
  const shipping = subtotal > 50000 ? 0 : 10000;
  const finalTotal = subtotal + shipping - discountAmount;

  function handleApply() {
    const code = inputCode.trim().toUpperCase();
    if (!code) return;
    onApplyCoupon(code);
  }

  function handleRemove() {
    setInputCode("");
    onRemoveCoupon();
  }

  return (
    <div className="sticky top-4 space-y-4">
      {/* Main Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00a99d] to-[#00b3a1] rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>
        </div>

        {/* Items */}
        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="truncate max-w-[180px] font-medium text-gray-700">
                {item.product_title} <span className="text-teal-500 font-semibold">×{item.quantity}</span>
              </span>
              <span className="font-bold text-gray-900">
                <PriceDisplay amount={item.price * item.quantity} />
              </span>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-4 border-t-2 border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="font-semibold text-gray-900"><PriceDisplay amount={subtotal} /></span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Package className="w-4 h-4" />
              Biaya Pengiriman
            </span>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-green-600 font-bold">GRATIS!</span>
              ) : (
                <PriceDisplay amount={shipping} />
              )}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Diskon Kupon
              </span>
              <span className="font-semibold text-green-600">
                -<PriceDisplay amount={discountAmount} />
              </span>
            </div>
          )}

          {subtotal < 50000 && subtotal > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">
                💡 <span className="font-semibold">Belanja <PriceDisplay amount={50000 - subtotal} /> lagi</span> untuk gratis ongkir!
              </p>
            </div>
          )}
        </div>

        {/* Coupon Input */}
        <div className="pt-4 border-t-2 border-gray-100">
          {couponCode ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">{couponCode}</span>
              </div>
              <button
                onClick={handleRemove}
                className="p-1 rounded-lg hover:bg-green-100 transition text-green-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode kupon"
                className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:border-teal-400 outline-none uppercase"
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
              <button
                onClick={handleApply}
                disabled={couponLoading || !inputCode.trim()}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {couponLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          )}
          {couponError && (
            <p className="text-xs text-red-500 mt-2">{couponError}</p>
          )}
        </div>

        {/* Total */}
        <div className={`flex justify-between items-center pt-4 border-t-2 ${discountAmount > 0 ? "border-green-200" : "border-gray-200"} bg-teal-50 -mx-6 px-6 py-4 rounded-b-2xl`}>
          <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
          <span className="text-2xl font-bold text-teal-500">
            <PriceDisplay amount={finalTotal} />
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Checkout / Continue Button */}
        <button
          onClick={onContinue ?? onCheckout}
          disabled={(!onContinue && !onCheckout) || loading}
          className={`group w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            loading || (!onContinue && !onCheckout)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "gradient-brand text-white hover:shadow-lg hover:scale-105"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : onContinue ? (
            <>
              Lanjut ke Pembayaran →
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Bayar Sekarang
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Pembayaran aman via Xendit</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">Metode Pembayaran:</p>
        <div className="flex flex-wrap gap-2">
          {["BCA", "Mandiri", "BNI", "GoPay", "OVO", "QRIS"].map((method) => (
            <span key={method} className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-gray-500">
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
