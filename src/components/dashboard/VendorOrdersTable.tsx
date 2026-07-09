"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/dashboard/StatsCard"
import { formatCurrency } from "@/lib/utils"
import { VendorOrderActions } from "@/components/dashboard/VendorOrderActions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useRealtimeSubscription } from "@/hooks/useRealtime"
import { vendorUpdateOrderStatus } from "@/app/actions/orders"

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
    buyer_id: string
  } | null
}

export interface VendorOrdersTableProps {
  initialData: OrderItemData[]
  vendorId: string
}

const actionableStatuses = new Set(["paid", "processing"])

export default function VendorOrdersTable({ initialData: data, vendorId }: VendorOrdersTableProps) {
  const router = useRouter()
  const timers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    for (const item of data) {
      if (item.order?.status === "shipped" && !timers.current.has(item.order_id)) {
        const timer = setTimeout(async () => {
          try {
            await vendorUpdateOrderStatus(item.order_id, "delivered")
          } catch {}
          timers.current.delete(item.order_id)
          router.refresh()
        }, 5000)
        timers.current.set(item.order_id, timer)
      }
    }
    return () => {
      for (const timer of timers.current.values()) clearTimeout(timer)
      timers.current.clear()
    }
  }, [data, router])

  useRealtimeSubscription({
    table: "order_items",
    filter: `vendor_id=eq.${vendorId}`,
    callback: () => {
      router.refresh()
    },
  })

  useRealtimeSubscription({
    table: "orders",
    event: "UPDATE",
    callback: () => {
      router.refresh()
    },
  })

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.quantity}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.order?.status ?? "pending"} />
                </TableCell>
                <TableCell>
                  {item.order && actionableStatuses.has(item.order.status) ? (
                    <VendorOrderActions orderId={item.order_id} currentStatus={item.order.status} />
                  ) : (
                    <span className="text-xs text-muted-foreground">&mdash;</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
