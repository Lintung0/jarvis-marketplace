"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { buyerConfirmReceived } from "@/app/actions/orders";

interface Props {
  orderId: string;
  status: string;
}

export default function OrderActions({ orderId, status }: Props) {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (status === "shipped") {
    return (
      <button
        onClick={async () => {
          setConfirming(true);
          try {
            await buyerConfirmReceived(orderId);
            router.refresh();
          } catch (e) {
            alert("Gagal konfirmasi penerimaan");
          } finally {
            setConfirming(false);
          }
        }}
        disabled={confirming}
        className="flex-1 min-w-[200px] text-center py-3 rounded-xl font-semibold text-sm transition text-white shadow-md"
        style={{ background: "linear-gradient(135deg, #00a99d, #00897b)" }}
      >
        {confirming ? "Memproses..." : "Konfirmasi Diterima"}
      </button>
    );
  }

  if (status === "pending") {
    return (
      <>
        <button
          onClick={() => setShowCancel(true)}
          className="flex-1 min-w-[200px] text-center py-3 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition"
        >
          Batalkan Pesanan
        </button>
        <CancelOrderModal
          orderId={orderId}
          isOpen={showCancel}
          onClose={() => setShowCancel(false)}
        />
      </>
    );
  }

  if (status === "delivered") {
    return (
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={() => setShowReturn(true)}
          className="flex-1 min-w-[200px] text-center py-3 rounded-xl border-2 border-teal-200 text-teal-600 hover:bg-teal-50 font-semibold text-sm transition"
        >
          Ajukan Pengembalian
        </button>
        <ReturnOrderModal
          orderId={orderId}
          isOpen={showReturn}
          onClose={() => setShowReturn(false)}
        />
      </div>
    );
  }

  return null;
}
