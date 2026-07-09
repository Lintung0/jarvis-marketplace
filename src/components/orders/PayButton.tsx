"use client"

import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";

interface Props {
  orderId: string;
  status: string;
}

export default function PayButton({ orderId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status !== "pending") return null;

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pembayaran");
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-w-[200px]">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md gradient-brand flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4" />
            Lanjutkan Pembayaran
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
