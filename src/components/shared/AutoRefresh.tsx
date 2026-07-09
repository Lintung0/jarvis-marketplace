"use client"

import { useRouter } from "next/navigation"
import { useRealtimeSubscription } from "@/hooks/useRealtime"

interface TableConfig {
  table: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
  filter?: string
}

interface AutoRefreshProps {
  tables: TableConfig[]
}

function Subscription({ config }: { config: TableConfig }) {
  const router = useRouter()
  useRealtimeSubscription({
    table: config.table,
    event: config.event ?? "*",
    filter: config.filter,
    callback: () => router.refresh(),
  })
  return null
}

export function AutoRefresh({ tables }: AutoRefreshProps) {
  return (
    <>
      {tables.map((t, i) => (
        <Subscription key={`${t.table}-${t.filter ?? "all"}-${i}`} config={t} />
      ))}
    </>
  )
}
