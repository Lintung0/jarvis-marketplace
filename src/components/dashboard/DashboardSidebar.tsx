"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, ShoppingCart, DollarSign, Users,
  Settings, Star, Tag, Store,
  LogOut, ChevronLeft, ChevronRight, Ticket, BookOpen, ImageIcon, Share2, Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

export interface SidebarSection {
  title: string
  items: SidebarItem[]
}

export interface DashboardSidebarProps {
  role: "vendor" | "moderator" | "admin"
}

const sections: Record<string, SidebarSection[]> = {
  vendor: [
    {
      title: "Menu",
      items: [
        { label: "Dashboard", href: "/vendor", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Products", href: "/vendor/products", icon: <Package className="w-5 h-5" /> },
        { label: "Orders", href: "/vendor/orders", icon: <ShoppingCart className="w-5 h-5" /> },
        { label: "Earnings", href: "/vendor/earnings", icon: <DollarSign className="w-5 h-5" /> },
        { label: "Membership", href: "/membership", icon: <Crown className="w-5 h-5" /> },
      ],
    },
    {
      title: "Promotion",
      items: [
        { label: "Affiliate", href: "/affiliate", icon: <Share2 className="w-5 h-5" /> },
      ],
    },
  ],
  moderator: [
    {
      title: "Menu",
      items: [
        { label: "Dashboard", href: "/moderator", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Products", href: "/moderator/products", icon: <Package className="w-5 h-5" /> },
        { label: "Reviews", href: "/moderator/reviews", icon: <Star className="w-5 h-5" /> },
        { label: "Return Requests", href: "/moderator/returns", icon: <ShoppingCart className="w-5 h-5" /> },
      ],
    },
    {
      title: "Promotion",
      items: [
        { label: "Affiliate", href: "/affiliate", icon: <Share2 className="w-5 h-5" /> },
      ],
    },
  ],
  admin: [
    {
      title: "Menu",
      items: [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
        { label: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
        { label: "Return Requests", href: "/moderator/returns", icon: <ShoppingCart className="w-5 h-5" /> },
        { label: "Vendors", href: "/admin/vendors", icon: <Store className="w-5 h-5" /> },
        { label: "Vendor Apps", href: "/admin/vendor-applications", icon: <Users className="w-5 h-5" /> },
        { label: "Categories", href: "/admin/categories", icon: <Tag className="w-5 h-5" /> },
        { label: "Coupons", href: "/admin/coupons", icon: <Ticket className="w-5 h-5" /> },
        { label: "KB Articles", href: "/admin/kb/articles", icon: <BookOpen className="w-5 h-5" /> },
        { label: "KB Categories", href: "/admin/kb/categories", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Banners", href: "/admin/banners", icon: <ImageIcon className="w-5 h-5" /> },
        { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
      ],
    },
    {
      title: "Promotion",
      items: [
        { label: "Affiliates", href: "/admin/affiliates", icon: <Share2 className="w-5 h-5" /> },
      ],
    },
  ],
}

export function SidebarNavItem({ item, collapsed, isActive }: { item: SidebarItem; collapsed: boolean; isActive: boolean }) {
  return (
    <li>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-auto py-2.5 px-3",
          collapsed && "justify-center px-2",
        )}
        asChild
      >
        <Link href={item.href} title={collapsed ? item.label : undefined}>
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </Button>
    </li>
  )
}

export function SidebarSectionGroup({ section, collapsed, pathname }: { section: SidebarSection; collapsed: boolean; pathname: string }) {
  return (
    <div>
      {!collapsed && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 px-3">
          {section.title}
        </p>
      )}
      <ul className="space-y-1">
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </div>
  )
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const currentSections = sections[role] ?? []

  return (
    <aside
      className={cn(
        "bg-card border-r border-border min-h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="font-bold text-xl text-foreground">
            Mode<span className="text-teal-500">sy</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-6">
          {currentSections.map((section) => (
            <SidebarSectionGroup
              key={section.title}
              section={section}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2.5" asChild>
          <Link href="/">
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </Button>
      </div>
    </aside>
  )
}
