"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import ShippingForm from "@/components/forms/ShippingForm";
import SavedAddresses from "@/components/checkout/SavedAddresses";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ShoppingCart, MapPin, CreditCard, CheckCircle, Package, Wallet, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ShippingAddress {
  full_name: string; address: string; city: string;
  state: string; postal_code: string; country: string; phone: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"xendit" | "wallet">("xendit");
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState<ShippingAddress | null>(null);
  const [form, setForm] = useState<ShippingAddress>({
    full_name: "", address: "", city: "", state: "",
    postal_code: "", country: "Indonesia", phone: "",
  });

  const hasPhysical = items.some((item) => item.product_type === "physical");
  const finalTotal = total() - discountAmount;

  useEffect(() => {
    if (!user) return;
    fetch("/api/wallet/balance")
      .then((r) => r.json())
      .then((d) => setWalletBalance(d.balance ?? 0))
      .catch(() => {});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSelectedAddr(null);
  };

  const handleAddressChange = (updates: Partial<ShippingAddress>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setSelectedAddr(null);
  };

  const handleSelectAddress = (addr: ShippingAddress) => {
    setForm({ ...addr });
    setSelectedAddr(addr);
  };

  const handleEditAddress = () => {
    setSelectedAddr(null);
  };

  const handleContinueToPayment = () => {
    if (hasPhysical && !form.full_name) {
      setError("Isi alamat pengiriman dulu ya!");
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  const handleWalletCheckout = async () => {
    if (walletBalance < finalTotal) {
      setError(`Saldo wallet tidak cukup. Saldo: ${formatCurrency(walletBalance)}, Perlu: ${formatCurrency(finalTotal)}`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/wallet/pay", {
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
      if (!res.ok) { setError(data.error ?? "Gagal bayar dengan wallet"); return; }
      clearCart();
      router.push(`/orders/${data.order_id}?status=success`);
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleXenditCheckout = async () => {
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

  const handleCheckout = () => {
    if (paymentMethod === "wallet") return handleWalletCheckout();
    return handleXenditCheckout();
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step.completed || step.id === currentStep
                    ? "bg-gradient-to-br from-[#00a99d] to-[#00b3a1] text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-400"
                }`}>
                  {step.completed ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                </div>
                <span className={`mt-2 text-sm font-medium ${step.id === currentStep ? "text-teal-500" : "text-gray-500"}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded transition-all ${step.completed ? "gradient-brand" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-400 mb-8">Lengkapi data untuk menyelesaikan pembelian</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 2 && hasPhysical && (
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
              <SavedAddresses onSelect={(addr) => handleSelectAddress({
                full_name: addr.full_name,
                phone: addr.phone,
                address: addr.address,
                city: addr.city,
                state: addr.state,
                postal_code: addr.postal_code,
                country: addr.country,
              })} />
              {selectedAddr ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-teal-700">Alamat terpilih</p>
                      <button
                        onClick={handleEditAddress}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        Ganti
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{selectedAddr.full_name} - {selectedAddr.phone}</p>
                    <p className="text-sm text-gray-500">{selectedAddr.address}</p>
                    <p className="text-sm text-gray-500">{selectedAddr.city}, {selectedAddr.state} {selectedAddr.postal_code}</p>
                    <p className="text-sm text-gray-500">{selectedAddr.country}</p>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-xs text-gray-400 mb-3">Atau isi manual:</p>
                  <ShippingForm value={form} onChange={handleChange} onAddressChange={handleAddressChange} />
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && !hasPhysical && (
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

          {currentStep === 3 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h2>
                  <p className="text-sm text-gray-500">Pilih cara bayar yang kamu inginkan</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("xendit")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "xendit"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "xendit" ? "text-teal-500" : "text-gray-400"}`} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Xendit</p>
                      <p className="text-xs text-gray-500">Transfer Bank, E-Wallet, Kartu Kredit</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "wallet"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-teal-500" : "text-gray-400"}`} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Wallet</p>
                      <p className={`text-xs font-medium ${walletBalance >= finalTotal ? "text-green-600" : "text-red-500"}`}>
                        Saldo: {formatCurrency(walletBalance)}
                        {walletBalance < finalTotal && " (tidak cukup)"}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {hasPhysical && form.full_name && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
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
            onCheckout={currentStep === 3 ? handleCheckout : undefined}
            onContinue={currentStep === 2 ? handleContinueToPayment : undefined}
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
                if (!res.ok || data.valid === false) {
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
