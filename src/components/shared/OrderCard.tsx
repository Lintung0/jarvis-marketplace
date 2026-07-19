"use client"

import { useState } from "react"
import Link from "next/link"
import OrderStatusBadge from "@/components/shared/OrderStatusBadge"
import { formatCurrency } from "@/lib/utils"
import type { Order, OrderItem } from "@/types"
import { Package, MapPin, Clock, CreditCard, Check, X, Loader2, Truck } from "lucide-react"

interface Props {
    order: Order & { items?: OrderItem[] };
}

export default function OrderCard({ order }: Props) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="w-4 h-4 text-green-600" />
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-600" />
      case "delivered":
        return <Check className="w-4 h-4 text-teal-600" />
      case "cancelled":
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Menunggu Pembayaran",
      paid: "Dibayar",
      processing: "Diproses",
      shipped: "Dikirim",
      delivered: "Selesai",
      cancelled: "Dibatalkan",
      refunded: "Dikembalikan",
    }
    return labels[status] || status
  }

  return (
    <div>
      <Link
        href={`/orders/${order.id}`}
        className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono text-sm font-semibold text-gray-900">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>

        <div className="text-sm text-gray-500 mb-3 line-clamp-1">
          {order.items?.slice(0, 2).map((item) => (
            <span key={item.id} className="mr-2">• {item.title}</span>
          ))}
          {(order.items?.length ?? 0) > 2 && (
            <span className="text-gray-400">+{(order.items?.length ?? 0) - 2} lainnya</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{order.items?.length} item</p>
          <p className="font-bold text-teal-500">{formatCurrency(order.total)}</p>
        </div>
      </Link>

      {/* Quick View Modal */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <p className="font-mono text-sm font-semibold text-gray-500">Order ID</p>
                <p className="font-mono text-xl font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <OrderStatusBadge status={order.status} />
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Items */}
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-xs text-gray-400">
                          {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-teal-500 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    Alamat Pengiriman
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                    <p>{order.shipping_address.country}</p>
                    <p>📞 {order.shipping_address.phone}</p>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-500" />
                  Info Pembayaran
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Metode</p>
                    <p className="font-medium text-gray-900">{order.payment_method || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-teal-500">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Timeline</h4>
                <div className="space-y-3">
                  {[
                    { status: "pending", label: "Pesanan Dibuat", time: order.created_at, icon: <Package className="w-4 h-4" /> },
                    { status: "paid", label: "Pembayaran Berhasil", time: order.updated_at, icon: <Check className="w-4 h-4" /> },
                    { status: "processing", label: "Diproses", time: order.updated_at, icon: <Package className="w-4 h-4" /> },
                    { status: "shipped", label: "Dikirim", time: order.updated_at, icon: <Truck className="w-4 h-4" /> },
                    { status: "delivered", label: "Selesai", time: order.updated_at, icon: <Check className="w-4 h-4" /> },
                    { status: "cancelled", label: "Dibatalkan", time: order.updated_at, icon: <X className="w-4 h-4" /> },
                  ].map((step) => {
                    const isActive = order.status === step.status || 
                      (step.status === "paid" && ["processing", "shipped", "delivered"].includes(order.status)) ||
                      (step.status === "processing" && ["shipped", "delivered"].includes(order.status)) ||
                      (step.status === "shipped" && order.status === "delivered")

                    const isCompleted = ["pending", "paid", "processing", "shipped"].includes(step.status) && 
                      ["paid", "processing", "shipped", "delivered"].includes(order.status) &&
                      ["pending", "paid", "processing", "shipped"].indexOf(step.status) <= 
                      ["pending", "paid", "processing", "shipped", "delivered"].indexOf(order.status)

                    return (
                      <div key={step.status} className="flex items-start gap-3">
                        <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-teal-500 text-white" : isActive ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-400"
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`font-medium text-sm ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {step.time ? new Date(step.time).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            }) : "-"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              <Link
                href={`/orders/${order.id}`}
                onClick={() => setIsDetailOpen(false)}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl text-center font-medium transition"
              >
                Lihat Detail Lengkap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}