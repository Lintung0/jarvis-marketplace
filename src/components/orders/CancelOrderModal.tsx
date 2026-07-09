"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, AlertTriangle } from "lucide-react";

const CANCEL_REASONS = [
  { id: "duplicate", label: "Pesanan duplikat" },
  { id: "change_address", label: "Ingin mengubah alamat pengiriman" },
  { id: "cheaper_price", label: "Menemukan harga yang lebih murah" },
  { id: "change_mind", label: "Tidak jadi membeli" },
  { id: "long_wait", label: "Proses terlalu lama" },
  { id: "other", label: "Lainnya" },
];

interface Props {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelOrderModal({ orderId, isOpen, onClose }: Props) {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Pilih alasan pembatalan");
      return;
    }
    if (selectedReason === "other" && !reasonDetail.trim()) {
      setError("Tuliskan alasan pembatalan");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          reason: selectedReason,
          reason_detail: selectedReason === "other" ? reasonDetail.trim() : reasonDetail.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membatalkan pesanan");
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Batalkan Pesanan</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            Yakin ingin membatalkan pesanan <span className="font-semibold text-gray-700">#{orderId.slice(0, 8).toUpperCase()}</span>?
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Alasan pembatalan</p>
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  selectedReason === reason.id
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="cancel_reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    setError("");
                  }}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>

          {selectedReason === "other" && (
            <textarea
              value={reasonDetail}
              onChange={(e) => {
                setReasonDetail(e.target.value);
                setError("");
              }}
              placeholder="Tuliskan alasan kamu..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
              rows={3}
            />
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedReason}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Membatalkan...
              </>
            ) : (
              "Batalkan Pesanan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
