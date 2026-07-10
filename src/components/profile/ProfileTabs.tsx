"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package, Heart, Settings, LogOut, Loader2, ChevronRight, CreditCard, Store, ShoppingBag, MapPin, Calendar, CheckCircle, Clock, Truck, RotateCcw, XCircle, Trash2, Star, Mail, Shield, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Order, Profile, Wishlist } from "@/types";
import type { LucideIcon } from "lucide-react";

interface ProfileTabsProps {
  profile: Profile;
  orders: Order[];
  wishlistItems: Wishlist[];
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  paid: { label: "Paid", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  processing: { label: "Processing", icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
  shipped: { label: "Shipped", icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  refunded: { label: "Refunded", icon: RotateCcw, color: "text-gray-600", bg: "bg-gray-50" },
};

const ORDER_SUB_TABS = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Belum Dibayar" },
  { id: "paid", label: "Dibayar" },
  { id: "processing", label: "Diproses" },
  { id: "shipped", label: "Dikirim" },
  { id: "delivered", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
];

export default function ProfileTabs({ profile, orders, wishlistItems }: ProfileTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "settings">("orders");
  const [orderSubTab, setOrderSubTab] = useState("all");
  const [loggingOut, setLoggingOut] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  function shouldShowOrder(order: Order): boolean {
    if (order.status === "delivered") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return new Date(order.updated_at || order.created_at).getTime() > weekAgo;
    }
    return true;
  }

  const visibleOrders = orders.filter(shouldShowOrder);
  const filteredOrders = orderSubTab === "all"
    ? visibleOrders
    : visibleOrders.filter((o) => o.status === orderSubTab);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleRemoveWishlist(itemId: string) {
    setRemovingId(itemId);
    const supabase = createClient();
    await supabase.from("wishlists").delete().eq("id", itemId);
    router.refresh();
  }

  const tabs = [
    { id: "orders" as const, label: "Riwayat Transaksi", icon: ShoppingBag, count: orders.length },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "settings" as const, label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm transition relative ${
                  activeTab === tab.id
                    ? "text-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === "orders" && (
          <div>
            <div className="flex overflow-x-auto gap-1 mb-4 bg-gray-100 rounded-xl p-1">
              {ORDER_SUB_TABS.map((tab) => {
                const count = tab.id === "all"
                  ? visibleOrders.length
                  : visibleOrders.filter((o) => o.status === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderSubTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                      orderSubTab === tab.id
                        ? "bg-white text-orange-500 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        orderSubTab === tab.id
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {orderSubTab === "all"
                    ? "Belum Ada Transaksi"
                    : `Tidak ada pesanan "${ORDER_SUB_TABS.find((t) => t.id === orderSubTab)?.label}"`}
                </h3>
                <p className="text-gray-400 mb-6">
                  {orderSubTab === "all" ? "Mulai belanja untuk melihat riwayat transaksi kamu" : ""}
                </p>
                {orderSubTab === "all" && (
                  <Link
                    href="/products"
                    className="inline-block gradient-brand text-white font-semibold px-6 py-3 rounded-xl transition hover:opacity-90"
                  >
                    Mulai Belanja
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={order.id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition cursor-pointer border border-gray-100"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-500">
                                #{order.id.slice(0, 8)}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                              {order.payment_method && (
                                <span className="flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  {order.payment_method}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-1">
                          {order.items?.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 shrink-0">
                              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {item.product?.images?.[0]?.url ? (
                                  <Image
                                    src={item.product.images[0].url}
                                    alt={item.title}
                                    width={56}
                                    height={56}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.quantity}x · Rp{item.price.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          ))}
                          {(order.items?.length ?? 0) > 4 && (
                            <span className="text-xs text-gray-400 shrink-0">
                              +{order.items!.length - 4} lainnya
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <span className="text-xs text-gray-400">
                            {order.items?.length ?? 0} item
                          </span>
                          <span className="text-sm font-bold text-orange-500">
                            Rp{order.total.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Wishlist Masih Kosong</h3>
                <p className="text-gray-400 mb-6">Simpan barang favorit kamu untuk nanti</p>
                <Link
                  href="/products"
                  className="inline-block gradient-brand text-white font-semibold px-6 py-3 rounded-xl transition hover:opacity-90"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const sorted = [...(product.images ?? [])].sort((a, b) => {
                    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
                    const sortDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
                    if (sortDiff !== 0) return sortDiff;
                    return (a.url || "").localeCompare(b.url || "");
                  });
                  const primaryImage = sorted[0];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition group"
                    >
                      <Link href={`/products/${product.slug}`} className="block">
                        <div className="aspect-square bg-gray-50 relative overflow-hidden">
                          {primaryImage?.url ? (
                            <Image
                              src={primaryImage.url}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-12 h-12" />
                            </div>
                          )}
                          {product.sale_price && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                              DISKON
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-500">{product.avg_rating ?? 0}</span>
                            </div>
                            <span className="text-xs text-gray-400">({product.review_count ?? 0})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {product.sale_price ? (
                              <>
                                <span className="text-sm font-bold text-orange-500">Rp{product.sale_price.toLocaleString("id-ID")}</span>
                                <span className="text-xs text-gray-400 line-through">Rp{product.price.toLocaleString("id-ID")}</span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-gray-800">Rp{product.price.toLocaleString("id-ID")}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="px-3 pb-3">
                        <button
                          onClick={() => handleRemoveWishlist(item.id)}
                          disabled={removingId === item.id}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
                        >
                          {removingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informasi Akun</h3>
              <div className="space-y-2">
                <SettingRow icon={Mail} label="Email" value={profile.email} />
                <SettingRow icon={MapPin} label="Lokasi" value={profile.location || "Belum diatur"} />
              </div>
            </div>

            {profile.role === "vendor" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Toko</h3>
                <div className="space-y-2">
                  <SettingLink icon={Store} label="Kelola Toko" href="/vendor/products" />
                  <SettingLink icon={ShoppingBag} label="Pesanan Masuk" href="/vendor/orders" />
                  <SettingLink icon={CreditCard} label="Penarikan Saldo" href="/vendor/withdrawals" />
                </div>
              </div>
            )}

            {(profile.role === "admin" || profile.role === "moderator") && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {profile.role === "admin" ? "Admin" : "Moderator"}
                </h3>
                <div className="space-y-2">
                  <SettingLink
                    icon={Shield}
                    label={profile.role === "admin" ? "Panel Admin" : "Dashboard Moderator"}
                    href={profile.role === "admin" ? "/admin" : "/moderator"}
                  />
                  <SettingLink icon={ShoppingBag} label="Return Requests" href="/moderator/returns" />
                  {profile.role === "admin" && (
                    <SettingLink icon={ShoppingBag} label="Semua Pesanan" href="/admin/orders" />
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Role Akun</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    profile.role === "admin" ? "bg-red-100 text-red-600" :
                    profile.role === "vendor" ? "bg-orange-100 text-orange-600" :
                    profile.role === "moderator" ? "bg-purple-100 text-purple-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {profile.role === "admin" ? "A" :
                     profile.role === "vendor" ? "V" :
                     profile.role === "moderator" ? "M" : "M"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{profile.role}</p>
                    <p className="text-xs text-gray-500">
                      {profile.role === "admin" ? "Akses penuh ke sistem" :
                       profile.role === "vendor" ? "Kelola produk & pesanan" :
                       profile.role === "moderator" ? "Memoderasi konten" :
                       "Akun pembeli"}
                    </p>
                  </div>
                </div>
                {profile.role === "member" && (
                  <Link href="/sell" className="text-sm text-orange-500 hover:text-orange-600 font-semibold">
                    Jadi Vendor
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                {loggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-sm text-gray-500">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SettingLink({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-xl p-4 flex items-center justify-between group transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">{label}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
    </Link>
  );
}
