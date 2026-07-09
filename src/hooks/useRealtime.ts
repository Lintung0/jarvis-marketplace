"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*"

interface UseRealtimeOptions {
  table: string
  event?: RealtimeEvent
  filter?: string
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
  enabled?: boolean
}

export function useRealtimeSubscription({
  table,
  event = "*",
  filter,
  callback,
  enabled = true,
}: UseRealtimeOptions) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()

    const channelConfig: any = {
      event,
      schema: "public",
      table,
    }
    if (filter) {
      channelConfig.filter = filter
    }

    const channel = supabase
      .channel(`realtime-${table}-${event}-${filter ?? "all"}`)
      .on("postgres_changes", channelConfig, (payload) => {
        callbackRef.current(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, filter, enabled])
}
