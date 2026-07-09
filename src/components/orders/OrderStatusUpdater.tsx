"use client"

import { useEffect, useState } from "react";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") !== "success") return;
    if (currentStatus === "paid" || currentStatus === "processing") return;
    if (updating) return;

    setUpdating(true);
    fetch("/api/xendit/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    }).catch(() => {});
  }, [orderId, currentStatus, updating]);

  return null;
}
