import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import NotificationBell from "./NotificationBell"

export interface DashboardHeaderProps {
  userId: string
  userEmail: string
  userName: string
  userAvatar?: string
}

export default function DashboardHeader({ userId, userEmail, userName, userAvatar }: DashboardHeaderProps) {
  const initial = (userName || userEmail)[0]?.toUpperCase() ?? "U"

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-end gap-4">
      <NotificationBell userId={userId} />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{userName || "User"}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold text-sm">
            {initial}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
