import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Bell } from "lucide-react"
import Link from "next/link"
import { getNotifications } from "@/app/actions/notifications"
import MarkReadButton from "./MarkReadButton"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const notifs = await getNotifications(user.id)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500">{notifs.length} total notifications</p>
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-500">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {notifs.map((n: any) => (
            <div
              key={n.id}
              className={`px-5 py-4 border-b border-gray-50 flex items-start gap-3 ${
                !n.is_read ? "bg-teal-50/30" : ""
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.is_read ? "bg-teal-500" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.is_read ? "font-medium text-gray-900" : "text-gray-600"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(n.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {n.order_id && (
                  <Link
                    href={`/orders/${n.order_id}`}
                    className="text-xs text-teal-600 hover:text-teal-700 mt-1 inline-block"
                  >
                    View Order →
                  </Link>
                )}
              </div>
              {!n.is_read && <MarkReadButton notifId={n.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
