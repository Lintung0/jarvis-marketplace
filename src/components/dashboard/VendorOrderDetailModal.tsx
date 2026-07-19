"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { StatusBadge } from "@/components/dashboard/StatsCard"
import { VendorOrderActions } from "@/components/dashboard/VendorOrderActions"
import { MapPin, CreditCard, Package, Check, X, Loader2, Truck } from "lucide-react"

export interface OrderItemData {
  id: string
  order_id: string
  title: string
  price: number
  quantity: number
  created_at: string
  order: {
    id: string
    status: string
    total: number
    created_at: string
    updated_at?: string
    buyer_id: string
    shipping_address: any
    payment_method: string
    items?: any[]
  } | null
}

export interface VendorOrdersTableProps {
  initialData: OrderItemData[]
  vendorId: string
}

const actionableStatuses = new Set(["paid", "processing"])

export default function VendorOrdersTable({ initialData: data, vendorId }: VendorOrdersTableProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<OrderItemData | null>(null)

  const openDetail = (item: OrderItemData) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

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
        return <Loader2 className="w-4 h-4 text-yellow-600" />
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
      {isDetailOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <p className="font-mono text-sm font-semibold text-gray-500">Order Item ID</p>
                <p className="font-mono text-xl font-bold text-gray-900">#{selectedItem.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">{selectedItem.title}</p>
                  <p className="text-sm text-gray-500">Qty: {selectedItem.quantity} × {formatCurrency(selectedItem.price)}</p>
                </div>
                <p className="font-semibold text-teal-500 text-right">
                  {formatCurrency(selectedItem.price * selectedItem.quantity)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium text-gray-900">#{selectedItem.order?.id?.slice(0, 8).toUpperCase() ?? "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-gray-900">{getStatusLabel(selectedItem.order?.status ?? "pending")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Order Date</span>
                      <span className="font-medium text-gray-900">{new Date(selectedItem.order?.created_at ?? selectedItem.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Item Total</span>
                      <span className="font-bold text-teal-500">{formatCurrency(selectedItem.price * selectedItem.quantity)}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.order?.shipping_address && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      Alamat Pengiriman
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{selectedItem.order.shipping_address.full_name}</p>
                      <p>{selectedItem.order.shipping_address.address}</p>
                      <p>{selectedItem.order.shipping_address.city}, {selectedItem.order.shipping_address.state} {selectedItem.order.shipping_address.postal_code}</p>
                      <p>{selectedItem.order.shipping_address.country}</p>
                      <p>📞 {selectedItem.order.shipping_address.phone}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-500" />
                    Info Pembayaran
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Order Total</p>
                      <p className="font-bold text-teal-500">{formatCurrency(selectedItem.order?.total ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Item Total</p>
                      <p className="font-semibold text-teal-500">{formatCurrency(selectedItem.price * selectedItem.quantity)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Timeline</h4>
                  <div className="space-y-3">
                    {[
                      { status: "pending", label: "Pesanan Dibuat", time: selectedItem.order?.created_at, icon: <Package className="w-4 h-4" /> },
                      { status: "paid", label: "Pembayaran Berhasil", time: selectedItem.order?.updated_at, icon: <Check className="w-4 h-4" /> },
                      { status: "processing", label: "Diproses", time: selectedItem.order?.updated_at, icon: <Package className="w-4 h-4" /> },
                      { status: "shipped", label: "Dikirim", time: selectedItem.order?.updated_at, icon: <Truck className="w-4 h-4" /> },
                      { status: "delivered", label: "Selesai", time: selectedItem.order?.updated_at, icon: <Check className="w-4 h-4" /> },
                      { status: "cancelled", label: "Dibatalkan", time: selectedItem.order?.updated_at, icon: <X className="w-4 h-4" /> },
                    ].map((step) => {
                      const orderStatus = selectedItem.order?.status ?? "pending"
                      const isActive = step.status === orderStatus ||
                        (step.status === "paid" && ["processing", "shipped", "delivered"].includes(orderStatus)) ||
                        (step.status === "processing" && ["shipped", "delivered"].includes(orderStatus)) ||
                        (step.status === "shipped" && orderStatus === "delivered")

                      const isCompleted = ["pending", "paid", "processing", "shipped"].includes(step.status) &&
                        ["paid", "processing", "shipped", "delivered"].includes(orderStatus) &&
                        ["pending", "paid", "processing", "shipped"].indexOf(step.status) <=
                        ["pending", "paid", "processing", "shipped", "delivered"].indexOf(orderStatus)

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
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl font-medium transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}