"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, Heart, LogOut, Loader2, User, Store, HelpCircle, MessageCircle, Tag, ChevronDown, Package } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import LocationPicker from "./LocationPicker";

interface Category {
  id: string | number;
  name: string;
  slug: string;
  icon?: string;
  parent_id?: string | number | null;
}

function catName(t: (key: string) => string, slug: string, fallback: string) {
  const translated = t("categories.slugs." + slug);
  return translated !== "categories.slugs." + slug ? translated : fallback;
}

export function NavbarClient({
  user,
  profile,
  categories,
  unreadMessages = 0,
}: {
  user: any;
  profile: any;
  categories: Category[];
  unreadMessages?: number;
}) {
  return (
    <>
      <TopBar user={user} profile={profile} />
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <SearchHeader user={user} profile={profile} unreadMessages={unreadMessages} categories={categories} />
        <CategoryNav categories={categories} />
      </header>
    </>
  );
}

function TopBar({ user, profile }: { user: any; profile: any }) {
  const { t } = useTranslation();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative z-[60] border-b border-gray-100 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hover:text-teal-500 transition-colors">{t("nav.topbar_contact") || "Contact"}</Link>
          <span className="text-gray-200">|</span>
          <Link href="/sell" className="hover:text-teal-500 transition-colors">{t("nav.sell")}</Link>
        </div>
        <div className="flex items-center gap-4">
          <LocationPicker />
          <CurrencySwitcher />
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 hover:text-gray-700 transition-colors text-xs cursor-pointer">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium">{profile?.full_name ?? profile?.username}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {(profile?.role === "vendor" || profile?.role === "admin" || profile?.role === "moderator") && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={profile?.role === "admin" ? "/admin" : profile?.role === "moderator" ? "/moderator" : "/vendor"} className="cursor-pointer">
                        <Package className="w-4 h-4 mr-2" />Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer"><User className="w-4 h-4 mr-2" />My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="cursor-pointer"><Heart className="w-4 h-4 mr-2" />Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer"><Package className="w-4 h-4 mr-2" />Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer"><Package className="w-4 h-4 mr-2" />Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer">
                  {loggingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                  {loggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hover:text-teal-500 transition-colors font-medium">{t("nav.sign_in")}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchHeader({ user, profile, categories, unreadMessages = 0 }: { user: any; profile: any; categories: Category[]; unreadMessages?: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
          <Image src="/logo.svg" alt="Modesy" width={140} height={44} className="h-11 w-auto" priority />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl mx-auto">
          <input
            type="text"
            placeholder={t("nav.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-white rounded-r-lg flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: "#00a99d" }}
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/wishlist" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-teal-500 transition-colors relative">
            <Heart className="h-5 w-5" />
            <span className="text-[10px]">{t("nav.wishlist") || "Wishlist"}</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: "#00a99d" }}>
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {user && (
            <Link href="/chat" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-teal-500 transition-colors relative">
              <MessageCircle className="h-5 w-5" />
              <span className="text-[10px]">{t("nav.messages") || "Messages"}</span>
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: "#00a99d" }}>
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Link>
          )}

          <Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-teal-500 transition-colors relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[10px]">{t("nav.cart") || "Cart"}</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: "#00a99d" }}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          <MobileMenu user={user} profile={profile} />
        </div>
      </div>
    </div>
  );
}

function CategoryNav({ categories }: { categories: Category[] }) {
  const { t } = useTranslation();
  
  const rootCategories = categories.filter((c) => !c.parent_id).slice(0, 8);
  const getChildren = (parentId: string | number) => categories.filter((c) => c.parent_id === parentId);

  return (
    <nav className="hidden lg:block bg-white border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-start gap-1">
          <li>
            <Link href="/products" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-teal-500 border-b-2 border-transparent hover:border-teal-500 transition-all">
              {t("nav.all_products") || "All Products"}
            </Link>
          </li>
          
          {rootCategories.map((root) => {
            const subs = getChildren(root.id);
            return (
              <li key={root.id} className="group">
                <Link
                  href={`/products?category=${root.slug}`}
                  className="flex items-center gap-1 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-teal-500 border-b-2 border-transparent hover:border-teal-500 transition-all"
                >
                  {root.name}
                  {subs.length > 0 && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>

                {subs.length > 0 && (
                  <div className="absolute left-0 right-0 w-full bg-white border-t border-gray-100 shadow-xl rounded-b-2xl p-6 z-50 transition-all duration-300 hidden group-hover:block">
                    <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6">
                      {subs.slice(0, 4).map((sub) => {
                        const subChildren = getChildren(sub.id);
                        return (
                          <div key={sub.id} className="space-y-3">
                            <Link
                              href={`/products?category=${sub.slug}`}
                              className="font-bold text-gray-900 text-sm hover:text-teal-500 block border-b border-gray-100 pb-1.5"
                            >
                              {sub.name}
                            </Link>
                            {subChildren.length > 0 && (
                              <ul className="space-y-1.5">
                                {subChildren.slice(0, 5).map((child) => (
                                  <li key={child.id}>
                                    <Link
                                      href={`/products?category=${child.slug}`}
                                      className="text-xs text-gray-500 hover:text-teal-500 block transition-colors"
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                      {/* Featured image box like the original */}
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-4 flex flex-col justify-between h-full border border-teal-50">
                        <div>
                          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Featured</p>
                          <h4 className="font-bold text-gray-900 text-sm mt-1">{root.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Explore trending collections and top seller picks.</p>
                        </div>
                        <Link
                          href={`/products?category=${root.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 mt-4"
                        >
                          View Collection &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          <li className="ml-auto">
            <Link href="/vendors" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-teal-500 border-b-2 border-transparent hover:border-teal-500 transition-all">
              {t("nav.vendors") || "Vendors"}
            </Link>
          </li>
          <li>
            <Link href="/brands" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-teal-500 border-b-2 border-transparent hover:border-teal-500 transition-all">
              {t("nav.brands") || "Brands"}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-teal-500 border-b-2 border-transparent hover:border-teal-500 transition-all">
              {t("nav.blog") || "Blog"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function MobileMenu({ user, profile }: { user: any; profile: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { t } = useTranslation();

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-gray-600">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 mt-8 h-full">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #00a99d, #00b3a1)" }}>
              {profile?.full_name?.charAt(0) ?? "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{profile?.full_name ?? profile?.username ?? "Guest"}</p>
              {user && (
                <Link href="/profile?tab=orders" className="text-sm text-gray-500 hover:text-teal-500 transition-colors" onClick={() => setIsOpen(false)}>
                  {t("account.orders")}
                </Link>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <User className="h-4 w-4" />
              {t("account.profile")}
            </Link>
            <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <Search className="h-4 w-4" />
              {t("nav.all_products")}
            </Link>
            <Link href="/brands" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <Tag className="h-4 w-4" />
              {t("nav.brands")}
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <Heart className="h-4 w-4" />
              {t("nav.wishlist")}
            </Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="h-4 w-4" />
              {t("nav.cart")}
            </Link>
            <Link href="/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <MessageCircle className="h-4 w-4" />
              {t("nav.messages")}
            </Link>
            <Link href="/vendors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <Store className="h-4 w-4" />
              {t("nav.vendors")}
            </Link>
            <Link href="/help-center" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors text-gray-600 hover:text-teal-500" onClick={() => setIsOpen(false)}>
              <HelpCircle className="h-4 w-4" />
              {t("nav.help")}
            </Link>
          </nav>

          <div className="pt-4 border-t border-gray-100">
            {user && (
              <button onClick={handleLogout} disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors">
                {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                {loggingOut ? t("common.logging_out") : t("common.logout")}
              </button>
            )}
            {!user && (
              <Link href="/login" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold" onClick={() => setIsOpen(false)}
                style={{ background: "linear-gradient(135deg, #00a99d, #00b3a1)" }}>
                {t("nav.sign_in")}
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
