import Link from "next/link";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

interface Props {
    order: Order;
}

export default function OrderCard({ order }: Props) {
    return (
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
        <p className="font-bold text-orange-500">{formatCurrency(order.total)}</p>
      </div>
    </Link>
    );
} 