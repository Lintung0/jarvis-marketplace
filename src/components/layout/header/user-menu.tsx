"use client";

import { useState } from "react";
import {
  User,
  LayoutDashboard,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import * as React from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const name = user?.full_name || user?.username || "User";
  const email = user?.email || "";
  const avatar = user?.avatar_url || "";
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  const role = user?.role;
  const isAdmin = role === "admin" || role === "moderator";
  const isVendor = role === "vendor";
  const showDashboard = isAdmin || isVendor;

  const dashboardHref = isAdmin
    ? "/admin"
    : isVendor
    ? "/vendor"
    : "/moderator";

  const handleLogout = async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="p-0">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{name}</span>
              <span className="text-muted-foreground truncate text-xs">@{user?.username}</span>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {showDashboard && (
            <>
              <DropdownMenuItem asChild>
                <Link href={dashboardHref} className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wallet" className="flex items-center gap-3">
              <Wallet className="w-4 h-4" />
              <span>Wallet</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
          {!isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/settings/billing" className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-600">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
