"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import ShippingForm from "@/components/forms/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ShoppingCart, MapPin, CreditCard, CheckCircle, Package } from "lucide-react";

interface ShippingAddress {
  full_name: string; address: string; city: string;
  state: string; postal_code: string; country: string; phone: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    full_name: "", address: "", city: "", state: "",
    postal_code: "", country: "Indonesia", phone: "",
  });

  const hasPhysical = items.some((item) => item.product_type === "physical");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToPayment = () => {
    if (hasPhysical && !form.full_name) {
      setError("Isi alamat pengiriman dulu ya!");
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/xendit/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            vendor_id: item.vendor_id,
            title: item.product_title,
            price: item.price,
            quantity: item.quantity,
            options: item.options,
          })),
          shippingAddress: hasPhysical ? form : null,
          coupon_code: couponCode,
          discount_amount: discountAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Gagal membuat invoice"); return; }
      clearCart();
      window.location.href = data.invoice_url;
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00a99d] to-[#00b3a1] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Keranjang Kosong</h2>
          <p className="text-gray-400 mb-8">Tambahkan produk dulu sebelum checkout</p>
          <button 
            onClick={() => router.push("/products")} 
            className="gradient-brand text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Keranjang", icon: ShoppingCart, completed: true },
    { id: 2, name: "Pengiriman", icon: MapPin, completed: currentStep > 2 },
    { id: 3, name: "Pembayaran", icon: CreditCard, completed: false },
  ];

  const isStep2 = currentStep === 2;
  const isStep3 = currentStep === 3;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.completed || step.id === currentStep
                      ? "bg-gradient-to-br from-[#00a99d] to-[#00b3a1] text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step.id === currentStep ? "text-teal-500" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded transition-all ${
                    step.completed ? "gradient-brand" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-400 mb-8">Lengkapi data untuk menyelesaikan pembelian</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isStep2 && hasPhysical && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                  <p className="text-sm text-gray-500">Isi alamat untuk pengiriman produk fisik</p>
                </div>
              </div>
              <ShippingForm value={form} onChange={handleChange} />
            </div>
          )}

          {isStep2 && !hasPhysical && (
            <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#00a99d] rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Produk Digital</h3>
                  <p className="text-sm text-gray-600">
                    Semua produk kamu adalah digital. Tidak perlu alamat pengiriman. 
                    Akses produk akan langsung tersedia setelah pembayaran berhasil.
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinueToPayment}
                className="mt-4 px-8 py-3 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                style={{ background: "linear-gradient(135deg, #00a99d, #00b3a1)" }}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          )}

          {isStep3 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Konfirmasi Pembayaran</h2>
                  <p className="text-sm text-gray-500">Klik tombol di bawah untuk melanjutkan ke pembayaran</p>
                </div>
              </div>
              {hasPhysical && form.full_name && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1 mb-4">
                  <p className="font-semibold text-gray-800">Alamat Pengiriman</p>
                  <p>{form.full_name}</p>
                  <p>{form.address}, {form.city}</p>
                  <p>{form.state} {form.postal_code}</p>
                  <p>{form.country} - {form.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            total={total()}
            loading={loading}
            error={error}
            couponCode={couponCode}
            discountAmount={discountAmount}
            couponError={couponError}
            couponLoading={couponLoading}
            onCheckout={isStep3 ? handleCheckout : undefined}
            onContinue={isStep2 ? handleContinueToPayment : undefined}
            onApplyCoupon={async (code) => {
              setCouponLoading(true);
              setCouponError(null);
              try {
                const res = await fetch("/api/coupons/validate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code, total: total() }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setCouponError(data.error ?? "Invalid coupon");
                } else {
                  setCouponCode(code);
                  setDiscountAmount(data.coupon?.discount_amount ?? 0);
                }
              } catch {
                setCouponError("Failed to validate coupon");
              }
              setCouponLoading(false);
            }}
            onRemoveCoupon={() => {
              setCouponCode(null);
              setDiscountAmount(0);
              setCouponError(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
