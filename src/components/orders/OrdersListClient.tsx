"use client"

import { useState } from "react";
import Link from "next/link";
import OrderCard from "@/components/shared/OrderCard";
import type { Order } from "@/types";

const ORDER_TABS = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Belum Dibayar" },
  { id: "paid", label: "Dibayar" },
  { id: "processing", label: "Diproses" },
  { id: "shipped", label: "Dikirim" },
  { id: "delivered", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
];

interface Props {
  orders: Order[];
}

function shouldShowOrder(order: Order): boolean {
  if (order.status === "delivered") {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(order.updated_at || order.created_at).getTime() > weekAgo;
  }
  return true;
}

export default function OrdersListClient({ orders }: Props) {
  const [activeTab, setActiveTab] = useState("all");

  const visibleOrders = orders.filter(shouldShowOrder);

  const filteredOrders =
    activeTab === "all"
      ? visibleOrders
      : visibleOrders.filter((o) => o.status === activeTab);

  return (
    <div>
      <div className="flex overflow-x-auto gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {ORDER_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? visibleOrders.length
              : visibleOrders.filter((o) => o.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛍️</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {activeTab === "all"
              ? "Belum ada transaksi"
              : `Tidak ada pesanan "${ORDER_TABS.find((t) => t.id === activeTab)?.label}"`}
          </h2>
          <p className="text-gray-400 mb-6">Yuk mulai belanja di JarvisMarketplace!</p>
          <Link
            href="/"
            className="inline-block gradient-brand text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
