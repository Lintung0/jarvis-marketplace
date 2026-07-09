"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending:    { label: "Menunggu Bayar", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: "⏳" },
  paid:       { label: "Dibayar",        color: "text-green-600 bg-green-50 border-green-200",   icon: "✅" },
  processing: { label: "Diproses",       color: "text-blue-600 bg-blue-50 border-blue-200",      icon: "⚙️" },
  shipped:    { label: "Dikirim",        color: "text-orange-500 bg-orange-50 border-orange-200",icon: "🚚" },
  delivered:  { label: "Diterima",       color: "text-green-700 bg-green-50 border-green-200",   icon: "📦" },
  cancelled:  { label: "Dibatalkan",     color: "text-red-600 bg-red-50 border-red-200",         icon: "❌" },
  refunded:   { label: "Dikembalikan",   color: "text-gray-500 bg-gray-50 border-gray-200",      icon: "↩️" },
};

interface Props {
  initialStatus: string;
  orderId: string;
  size?: "sm" | "md";
}

export default function OrderStatusBadgeClient({ initialStatus, orderId, size = "md" }: Props) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      setStatus("paid");
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        const newStatus = payload.new?.status as string;
        if (newStatus) setStatus(newStatus);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  const config = statusConfig[status] ?? statusConfig.pending;
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClass} ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}
