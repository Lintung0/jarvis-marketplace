"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, RotateCcw } from "lucide-react";

const RETURN_REASONS = [
  { id: "damaged", label: "Produk rusak/cacat" },
  { id: "wrong_item", label: "Barang tidak sesuai pesanan" },
  { id: "not_as_described", label: "Tidak sesuai deskripsi" },
  { id: "wrong_size", label: "Ukuran tidak cocok" },
  { id: "defective", label: "Produk tidak berfungsi" },
  { id: "other", label: "Lainnya" },
];

interface Props {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnOrderModal({ orderId, isOpen, onClose }: Props) {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Pilih alasan pengembalian");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          reason: selectedReason,
          description: description.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengajukan pengembalian");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengajukan pengembalian");
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
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Ajukan Pengembalian</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            Ajukan pengembalian untuk pesanan <span className="font-semibold text-gray-700">#{orderId.slice(0, 8).toUpperCase()}</span>
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Alasan pengembalian</p>
            {RETURN_REASONS.map((reason) => (
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
                  name="return_reason"
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

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Deskripsi tambahan (opsional)</p>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              placeholder="Jelaskan detail masalah..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
              rows={3}
            />
          </div>

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
            className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Ajukan Pengembalian"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
