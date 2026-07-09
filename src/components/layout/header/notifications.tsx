"use client";

import { useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useRealtimeSubscription } from "@/hooks/useRealtime"

export interface Notification {
  id: string
  type: string
  message: string
  order_id: string | null
  is_read: boolean
  created_at: string
}

export function NotificationItem({
  notif,
  onMarkRead,
}: {
  notif: Notification
  onMarkRead: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-border text-sm cursor-pointer hover:bg-muted transition",
        !notif.is_read && "bg-orange-50/30",
      )}
      onClick={() => onMarkRead(notif.id)}
    >
      <p className={cn("text-foreground", !notif.is_read && "font-medium")}>{notif.message}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">
        {new Date(notif.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}

export default function Notifications({ userId }: { userId: string }) {
  const [unread, setUnread] = useState(0)
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getUnreadCount(userId).then(setUnread)
  }, [userId])

  useRealtimeSubscription({
    table: "notifications",
    filter: `user_id=eq.${userId}`,
    callback: () => {
      getUnreadCount(userId).then(setUnread)
    },
  })

  async function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen) {
      const data = await getNotifications(userId)
      setNotifs(data)
    }
  }

  async function handleMarkRead(id: string) {
    await markAsRead(id)
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    setUnread((prev) => Math.max(0, prev - 1))
  }

  async function handleMarkAll() {
    await markAllAsRead(userId)
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnread(0)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAll} className="text-xs gap-1 h-auto py-1 px-2">
              <CheckCheck className="w-3 h-3" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-72">
          {notifs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifs.map((n) => (
              <NotificationItem key={n.id} notif={n} onMarkRead={handleMarkRead} />
            ))
          )}
        </ScrollArea>
        {notifs.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-2.5 text-xs text-orange-600 font-medium hover:bg-muted transition"
            >
              View All Notifications
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
