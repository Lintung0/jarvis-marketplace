"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  color?: "indigo" | "orange" | "green" | "purple" | "blue"
}

const colorMap: Record<string, { gradient: string; border: string }> = {
  indigo: { gradient: "from-[#00f0ff] to-[#4d7dff]", border: "border-[#00f0ff]/30" },
  orange: { gradient: "from-[#ff2d95] to-[#b44dff]", border: "border-[#ff2d95]/30" },
  green: { gradient: "from-[#39ff14] to-[#00f0ff]", border: "border-[#39ff14]/30" },
  purple: { gradient: "from-[#b44dff] to-[#ff2d95]", border: "border-[#b44dff]/30" },
  blue: { gradient: "from-[#4d7dff] to-[#00f0ff]", border: "border-[#4d7dff]/30" },
}

export default function StatsCard({ title, value, icon, trend, color = "indigo" }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <Card className={cn("hover:shadow-lg transition-all hover:-translate-y-0.5", c.border)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-[#0a0a0f]", c.gradient)}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <span className={cn("text-sm font-semibold", trend.positive ? "text-green-500" : "text-red-500")}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const statusBadgeVariants: Record<string, string> = {
  active: "success",
  paid: "success",
  delivered: "success",
  processing: "warning",
  shipped: "info",
  pending: "secondary",
  draft: "outline",
  hidden: "secondary",
  rejected: "destructive",
  cancelled: "destructive",
  refunded: "destructive",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = (statusBadgeVariants[status] ?? "secondary") as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
  return (
    <Badge variant={variant} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

interface DashboardTableProps {
  headers: string[]
  children: React.ReactNode
}

export function DashboardTable({ headers, children }: DashboardTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h, i) => (
                <TableHead key={i}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </Card>
  )
}
