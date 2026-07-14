"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Crown,
  Share2,
  Star,
  Users,
  Tag,
  Ticket,
  BookOpen,
  ImageIcon,
  Settings,
  ShoppingBag,
  RefreshCw,
  type LucideIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/types";

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isNew?: boolean;
  items?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const vendorNav: NavGroup[] = [
  {
    title: "Menu",
    items: [
      { title: "Dashboard", href: "/vendor", icon: LayoutDashboard },
      { title: "Products", href: "/vendor/products", icon: Package },
      { title: "Orders", href: "/vendor/orders", icon: ShoppingCart },
      { title: "Wallet", href: "/vendor/wallet", icon: DollarSign },
      { title: "Membership", href: "/membership", icon: Crown },
    ],
  },
  {
    title: "Promotion",
    items: [
      { title: "Affiliate", href: "/affiliate", icon: Share2 },
    ],
  },
];

const moderatorNav: NavGroup[] = [
  {
    title: "Menu",
    items: [
      { title: "Dashboard", href: "/moderator", icon: LayoutDashboard },
      { title: "Products", href: "/moderator/products", icon: Package },
      { title: "Reviews", href: "/moderator/reviews", icon: Star },
      { title: "Return Requests", href: "/moderator/returns", icon: ShoppingBag },
    ],
  },
  {
    title: "Promotion",
    items: [
      { title: "Affiliate", href: "/affiliate", icon: Share2 },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    title: "Menu",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Payouts", href: "/admin/payouts", icon: DollarSign },
      { title: "Return Requests", href: "/moderator/returns", icon: ShoppingBag },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Vendor Apps", href: "/admin/vendor-applications", icon: Users },
      { title: "Categories", href: "/admin/categories", icon: Tag },
      { title: "Coupons", href: "/admin/coupons", icon: Ticket },
      { title: "KB", href: "/admin/kb/articles", icon: BookOpen },
      { title: "Banners", href: "/admin/banners", icon: ImageIcon },
      { title: "Exchange Rate", href: "/admin/exchange", icon: RefreshCw },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    title: "Promotion",
    items: [
      { title: "Affiliates", href: "/admin/affiliates", icon: Share2 },
    ],
  },
];

const navMap: Record<Role, NavGroup[]> = {
  vendor: vendorNav,
  moderator: moderatorNav,
  admin: adminNav,
  member: [],
};

export type { NavItem, NavGroup };
export { vendorNav, moderatorNav, adminNav, navMap };

export const navItems = vendorNav;

export function NavMain({ role = "vendor", badges }: { role?: Role; badges?: Record<string, number> }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const items = navMap[role] ?? [];

  return (
    <>
      {items.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg">
                            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                            {item.items?.map((sub) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={sub.title}>
                                <a href={sub.href}>{sub.title}</a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible
                        className="group/collapsible block group-data-[collapsible=icon]:hidden"
                        defaultOpen={!!item.items.find((s) => s.href === pathname)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem, key) => (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={pathname === subItem.href}
                                  asChild>
                                  <Link href={subItem.href}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      Coming
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      New
                    </SidebarMenuBadge>
                  )}
                  {badges?.[item.href] && (
                    <SidebarMenuBadge className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full peer-hover/menu-button:text-white">
                      {badges[item.href] > 99 ? "99+" : badges[item.href]}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
