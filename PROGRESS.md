# Modesy Clone — Progress & Handoff Document

> Referensi asli: https://modesy.codingest.com/
> Stack: Next.js 16.2.9 (App Router, Turbopack), Supabase, Xendit, Tailwind CSS v4, shadcn/ui, Zustand v5
> Terakhir diupdate: 2026-07-02

---

## Tech Stack

| Teknologi | Kegunaan |
|---|---|
| Next.js 16.2.9 | Framework (App Router + Turbopack) |
| Supabase | Database (PostgreSQL + RLS) + Auth |
| Xendit | Payment gateway (Invoice API) |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| Zustand v5 | State management (cart + auth) |
| React Hook Form + Zod | Form handling & validasi |
| TypeScript | Language |

---

## Roles

| Role | Akses |
|---|---|
| `member` | Browse, beli, cart, checkout, wishlist, review |
| `vendor` | Semua member + upload produk, kelola order, request payout |
| `moderator` | Review produk pending, kelola review/laporan |
| `admin` | Full akses + setting global |

Default role saat register: `member`

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://uoysavqpravgfpalzxsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
XENDIT_SECRET_KEY=xnd_development_...   ✅ sudah diisi & permission Money In aktif
XENDIT_WEBHOOK_TOKEN=...                ✅ sudah diisi
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=...       ✅ sudah diisi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Modesy
```

---

## Database (Supabase)

Migration sudah dijalankan. Tabel yang ada:
- `profiles` — extend dari `auth.users`, field: role, is_verified, balance, dll
- `categories` — hierarkikal (parent_id), ada field icon
- `products` — type: physical/digital/license_key, status: pending/active/hidden/draft/rejected
- `product_images`, `product_options`
- `cart_items` — database-driven cart
- `orders`, `order_items`
- `reviews`, `wishlists`, `follows`
- `messages` — private messaging
- `coupons`, `withdrawals`
- `blog_posts`, `banners`

RLS aktif di semua tabel.
Trigger `handle_new_user` otomatis insert ke `profiles` saat register.

---

## Struktur File Lengkap

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                        ✅
│   │   ├── login/page.tsx                    ✅
│   │   └── register/page.tsx                 ✅
│   ├── (main)/
│   │   ├── layout.tsx                        ✅ — ada Navbar + Footer
│   │   ├── page.tsx                          ✅ — homepage (Hero + Categories + FeaturedProducts)
│   │   ├── products/page.tsx                 ✅ — all products + search + filter tipe + filter kategori + sort + pagination
│   │   ├── products/[slug]/page.tsx          ✅ — ProductGallery + AddToCartButton + ReviewList
│   │   ├── cart/page.tsx                     ✅ — CartList + CartSummary
│   │   ├── checkout/page.tsx                 ✅ — ShippingForm + OrderSummary
│   │   ├── orders/page.tsx                   ✅ — riwayat pembelian
│   │   ├── orders/[id]/page.tsx              ✅ — detail order + success banner
│   │   ├── wishlist/page.tsx                 ✅ — list produk wishlist user
│   │   ├── categories/[slug]/page.tsx        ✅ — produk per kategori + sub-kategori + search
│   │   ├── vendors/page.tsx                  ✅ — list semua vendor + jumlah produk
│   │   ├── vendors/[username]/page.tsx       ✅ — profil vendor + list produk aktif
│   │   └── blog/[slug]/page.tsx              ❌ stub kosong (struktur URL perlu diubah ke /blog/[category]/[slug])
│   ├── (dashboard)/
│   │   ├── layout.tsx                        ⚠️ ada tapi belum ada sidebar
│   │   ├── vendor/page.tsx                   ❌ placeholder "coming soon"
│   │   ├── vendor/products/page.tsx          ❌ placeholder
│   │   ├── vendor/products/new/page.tsx      ❌ placeholder
│   │   ├── vendor/orders/page.tsx            ❌ placeholder
│   │   ├── vendor/earnings/page.tsx          ❌ placeholder
│   │   ├── moderator/page.tsx                ❌ placeholder
│   │   ├── moderator/products/page.tsx       ❌ placeholder
│   │   ├── moderator/reviews/page.tsx        ❌ placeholder
│   │   ├── moderator/reports/page.tsx        ❌ placeholder
│   │   ├── admin/page.tsx                    ❌ placeholder
│   │   ├── admin/products/page.tsx           ❌ placeholder
│   │   ├── admin/orders/page.tsx             ❌ placeholder
│   │   ├── admin/vendors/page.tsx            ❌ placeholder
│   │   ├── admin/categories/page.tsx         ❌ placeholder
│   │   └── admin/settings/page.tsx           ❌ placeholder
│   └── api/
│       ├── auth/callback/route.ts            ✅
│       ├── xendit/create-invoice/route.ts    ✅ — buat order di Supabase + create Xendit invoice
│       ├── xendit/webhook/route.ts           ✅ — update order status + clear cart
│       ├── products/route.ts                 ❌ stub (175 bytes)
│       ├── orders/route.ts                   ❌ stub (175 bytes)
│       ├── stripe/ (disabled)                ⚠️ ada tapi 501
│       └── midtrans/ (disabled)              ⚠️ ada tapi 501
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                        ✅ — server component, cek session Supabase
│   │   └── Footer.tsx                        ✅ — ada links kategori, quick links, info
│   ├── sections/
│   │   ├── HeroSection.tsx                   ✅
│   │   ├── FeaturedProducts.tsx              ✅ — fetch dari Supabase
│   │   └── CategoriesSection.tsx             ✅ — fetch dari Supabase
│   ├── shared/
│   │   ├── ProductCard.tsx                   ✅ — gambar, harga, sale badge, vendor name, tombol wishlist
│   │   ├── AddToCartButton.tsx               ✅ — pilih opsi, quantity, tambah ke Zustand
│   │   ├── CartItem.tsx                      ✅ — update quantity, hapus item
│   │   ├── LogoutButton.tsx                  ✅
│   │   ├── ProductGallery.tsx                ✅ — thumbnail clickable, ganti gambar utama
│   │   ├── ReviewList.tsx                    ✅ — render list review dengan rating bintang
│   │   ├── OrderCard.tsx                     ✅ — card untuk list orders
│   │   ├── OrderStatusBadge.tsx              ✅ — badge warna per status order
│   │   ├── ProductGrid.tsx                   ✅ — grid produk reusable + empty state
│   │   ├── ProductFilters.tsx                ✅ — filter sidebar (tipe + kategori)
│   │   ├── SearchBar.tsx                     ✅ — search input dengan URL params
│   │   ├── WishlistButton.tsx                ✅ — tombol heart dengan optimistic update
│   │   └── VendorCard.tsx                    ✅ — card vendor untuk list shops
│   ├── cart/
│   │   ├── CartList.tsx                      ✅ — render list CartItem
│   │   └── CartSummary.tsx                   ✅ — total + tombol checkout
│   ├── checkout/
│   │   └── OrderSummary.tsx                  ✅ — ringkasan + tombol bayar
│   ├── forms/
│   │   └── ShippingForm.tsx                  ✅ — form alamat pengiriman (ada typo kecil, lihat catatan)
│   └── ui/
│       └── button.tsx                        ✅ (shadcn)
├── hooks/
│   ├── useAuth.ts                            ✅
│   ├── useCart.ts                            ✅
│   └── useWishlist.ts                        ✅ — add/remove/check wishlist, optimistic update
├── stores/
│   ├── authStore.ts                          ✅ (Zustand)
│   └── cartStore.ts                          ✅ (Zustand + persist)
├── lib/
│   ├── supabase/client.ts                    ✅
│   ├── supabase/server.ts                    ✅ (createClient + createAdminClient)
│   ├── utils.ts                              ✅ (formatCurrency, cn)
│   └── constants.ts                          ✅
├── types/index.ts                            ✅ — semua interface lengkap termasuk OrderItem.product
└── proxy.ts                                  ✅ — auth guard untuk protected routes
```

---

## ⚠️ Hal Penting yang Perlu Diperhatikan

### 1. File Duplikat — ✅ SUDAH DIHAPUS
- `src/app/(main)/cart/CartList.tsx` ✅ dihapus
- `src/app/(main)/cart/CartSummary.tsx` ✅ dihapus
- `src/app/(main)/checkout/OrderSummary.tsx` ✅ dihapus

### 2. Typo di ShippingForm — ✅ SUDAH DIFIX
File: `src/components/forms/ShippingForm.tsx` — `address` sudah benar.

### 3. Xendit Webhook (localhost)
Webhook Xendit tidak bisa hit localhost. Untuk test di local, gunakan ngrok:
```bash
ngrok http 3000
# copy URL ngrok → paste ke Xendit Dashboard > Settings > Developers > Webhooks > Invoices paid
```

### 4. Blog URL Structure
File yang ada: `src/app/(main)/blog/[slug]/page.tsx`
Seharusnya mengikuti Modesy asli: `/blog/[category]/[slug]`
Perlu dibuat ulang dengan struktur: `src/app/(main)/blog/[category]/[slug]/page.tsx`

### 5. Navbar — redirect setelah login/register
Sudah difix: `router.refresh()` dipanggil SEBELUM `router.push("/")` agar Navbar server component re-render dengan session baru.

---

## Progress Fitur

### ✅ Selesai & Fungsional
| Fitur | Keterangan |
|---|---|
| Setup project | Next.js 16 + Supabase + Xendit + Tailwind |
| Database + RLS | Semua tabel + trigger handle_new_user |
| Auth — Register | Email + password, auto redirect ke homepage |
| Auth — Login | Email + password |
| Auth — Logout | LogoutButton component |
| Auth guard | proxy.ts protect semua route dashboard |
| Navbar | Server component, cek session, icon Wishlist + Cart + User + Logout |
| Footer | Links kategori, quick links, informasi |
| Homepage | Hero + Categories + Featured Products |
| Product detail | Galeri (clickable thumbnail), harga, opsi, add to cart, vendor info, reviews |
| Cart | List item, update qty, hapus, total |
| Checkout | Form shipping (fisik), ringkasan, bayar via Xendit |
| Payment Xendit | Create invoice, redirect ke Xendit payment page ✅ TESTED |
| Xendit webhook | Update status order → paid, clear cart |
| Order detail | Success banner, item list, alamat, status badge |
| Order list | Riwayat pembelian user |
| All products | `/products` — search, filter kategori, filter tipe, sort, pagination |
| Category page | `/categories/[slug]` — produk per kategori + sub-kategori + search |
| Wishlist page | `/wishlist` — list produk yang di-wishlist |
| Wishlist button | Tombol heart di setiap ProductCard, optimistic update |
| useWishlist hook | Add/remove/check wishlist, auto redirect ke login kalau belum login |
| Vendor profile | `/vendors/[username]` — avatar, bio, stats, list produk aktif |
| Shops / Vendor list | `/vendors` — semua vendor + jumlah produk per vendor |
| Forgot password | `/forgot-password` — form reset via email Supabase |
| Categories list | `/categories` — semua kategori + sub-kategori |
| Blog list | `/blog` — semua artikel published |
| Blog post | `/blog/[slug]` — detail artikel |
| Contact | `/contact` — form kontak + info |
| About Us | `/about-us` — tentang Modesy |
| Sell on Modesy | `/sell-on-modesy` — panduan jadi vendor |
| Help Center | `/help-center` — FAQ |
| Terms & Conditions | `/terms-conditions` |
| Privacy Policy | `/privacy-policy` |
| Zustand stores | authStore + cartStore (persist) |
| Types | Semua interface TypeScript lengkap termasuk OrderItem.product |

### ❌ Belum Dibuat — Web Publik (Fase 2)
| Halaman/Fitur | URL | Prioritas |
|---|---|---|
| — | Semua halaman publik sudah selesai ✅ | — |

### ❌ Belum Dibuat — Dashboard (Fase 3)
| Dashboard | Halaman | Prioritas |
|---|---|---|
| **Vendor** | Layout + sidebar | 🔴 |
| **Vendor** | Overview (stats: total produk, order, earning) | 🔴 |
| **Vendor** | List produk | 🔴 |
| **Vendor** | Upload produk baru (form: judul, deskripsi, harga, gambar, opsi, tipe) | 🔴 |
| **Vendor** | Edit produk | 🔴 |
| **Vendor** | List order masuk | 🔴 |
| **Vendor** | Earnings + request payout | 🟡 |
| **Moderator** | Layout + sidebar | 🟡 |
| **Moderator** | Review produk pending (approve/reject) | 🟡 |
| **Moderator** | Kelola review/komentar | 🟡 |
| **Moderator** | Laporan user | 🟡 |
| **Admin** | Layout + sidebar | 🟡 |
| **Admin** | Overview (stats global) | 🟡 |
| **Admin** | Kelola semua produk | 🟡 |
| **Admin** | Kelola semua order | 🟡 |
| **Admin** | Kelola vendor | 🟡 |
| **Admin** | Kelola kategori | 🟡 |
| **Admin** | Settings global | 🟢 |

### ❌ Fitur Tambahan (Fase 4)
| Fitur | Keterangan |
|---|---|
| Realtime order status | Supabase Realtime subscribe ke tabel `orders` |
| Private messaging | Buyer ↔ Vendor |
| Review & rating form | Form tulis review setelah order delivered |
| Coupon/diskon | Input kode kupon di checkout |
| Google OAuth | Tombol "Login with Google" sudah ada callback, tinggal tambah tombol |
| Multi-currency | Switcher USD/IDR/dll di Navbar |
| Newsletter subscribe | Form di Footer |
| Cookie consent banner | Banner popup |

---

## Urutan Pengerjaan Selanjutnya (Rekomendasi)

### Fase 2 — Web Publik
```
1. ✅ Halaman /products (all products + search + filter + sort)
2. ✅ Halaman /categories/[slug] (produk per kategori)
3. ✅ Halaman /categories (semua kategori)
4. ✅ Halaman /wishlist + tombol wishlist di ProductCard
5. ✅ Halaman /vendors/[username] (profil vendor + produk vendor)
6. ✅ Halaman /vendors (list semua vendor)
7. ✅ Halaman /forgot-password
8. ✅ Blog (/blog, /blog/[slug])
9. ✅ Halaman static (contact, about, terms, help-center, sell-on-modesy, privacy-policy)

FASE 2 SELESAI 🎉
```

### Fase 3 — Dashboard
```
1. Dashboard layout shared (sidebar, role-based navigation)
2. Vendor dashboard (overview, produk, order, earnings)
3. Moderator dashboard (review produk, laporan)
4. Admin dashboard (kelola semua data)
```

### Fase 4 — Fitur Tambahan
```
1. Realtime order status
2. Google OAuth tombol
3. Review form
4. Coupon
5. Private messaging
```

---

## Konvensi Kode yang Dipakai

- **Server Component** — gunakan untuk fetch data dari Supabase langsung (tidak perlu API route)
- **Client Component** — hanya kalau perlu interaktivitas (useState, useEffect, event handler)
- **Import Supabase server**: `import { createClient } from "@/lib/supabase/server"`
- **Import Supabase client**: `import { createClient } from "@/lib/supabase/client"`
- **Semua komponen di `components/`** — jangan taruh komponen di dalam folder `app/`
- **Page hanya memanggil komponen** — logika UI dan fetch data dipisah ke komponen
- **Format currency**: selalu pakai `formatCurrency()` dari `@/lib/utils`
- **Types**: selalu import dari `@/types` — jangan buat interface inline di page/component

---

## Catatan Penting Teknis

- Next.js 16: `middleware.ts` deprecated → sudah diganti ke `proxy.ts`
- Supabase URL tidak boleh ada `/rest/v1/` di belakangnya
- Tidak ada `src/app/page.tsx` di root — homepage ada di `src/app/(main)/page.tsx`
- Setelah login/register: panggil `router.refresh()` DULU baru `router.push()` agar Navbar re-render
- Xendit API endpoint: `https://api.xendit.co/v2/invoices`
- Auth header Xendit: `Basic base64(SECRET_KEY + ":")`
- `external_id` di Xendit invoice = `order.id` dari Supabase (untuk matching di webhook)
- Webhook Xendit cek `body.status === "PAID"` lalu update `orders.status = "paid"`
