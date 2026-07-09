# Modesy Clone — Project Requirements & Plan

## Overview
Marketplace & Classified Ads platform terinspirasi dari Modesy (CodeCanyon).
Dibangun dengan Next.js 16, Supabase, Xendit, dan Tailwind CSS.

---

## Tech Stack
- **Framework**: Next.js 16.2.9 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth
- **Payment**: Xendit (Invoice & Webhook)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand v5
- **Form**: React Hook Form + Zod
- **Language**: TypeScript

---

## Roles
| Role | Akses |
|------|-------|
| `member` | Browse, beli produk, cart, checkout, wishlist, review, pesan |
| `vendor` | Semua member + upload produk, kelola order, request payout |
| `moderator` | Review produk pending, kelola review/komentar, laporan |
| `admin` | Full akses semua fitur + setting global |

Default role saat register: `member`

---

## Struktur Folder
```
src/
├── app/
│   ├── (auth)/              # Login, Register — tanpa Navbar
│   │   ├── layout.tsx       ✅ done
│   │   ├── login/page.tsx   ✅ done
│   │   └── register/page.tsx ✅ done
│   ├── (main)/              # Halaman publik — ada Navbar + Footer
│   │   ├── layout.tsx       ✅ done
│   │   ├── page.tsx         ⚠️ perlu diisi (homepage)
│   │   ├── products/
│   │   │   └── [slug]/page.tsx  ⚠️ perlu diisi (product detail)
│   │   ├── cart/page.tsx        ⚠️ perlu diisi
│   │   ├── checkout/page.tsx    ⚠️ perlu diisi
│   │   ├── categories/[slug]/page.tsx  ⚠️ perlu diisi
│   │   ├── vendors/
│   │   │   ├── page.tsx         ⚠️ perlu diisi
│   │   │   └── [username]/page.tsx ⚠️ perlu diisi
│   │   └── blog/[slug]/page.tsx ⚠️ perlu diisi
│   ├── (dashboard)/
│   │   ├── layout.tsx           ⚠️ perlu sidebar
│   │   ├── vendor/
│   │   │   ├── page.tsx         ⚠️ dashboard vendor
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── earnings/page.tsx
│   │   ├── moderator/
│   │   │   ├── page.tsx         ⚠️ dashboard moderator
│   │   │   ├── products/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   └── reports/page.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── products/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── vendors/page.tsx
│   │       ├── categories/page.tsx
│   │       └── settings/page.tsx
│   └── api/
│       ├── auth/callback/route.ts  ✅ done
│       ├── products/route.ts       ⚠️ perlu implementasi
│       ├── orders/route.ts         ⚠️ perlu implementasi
│       ├── xendit/
│       │   ├── create-invoice/route.ts  ⚠️ perlu implementasi
│       │   └── webhook/route.ts         ⚠️ perlu implementasi
│       └── midtrans/ (disabled, commented di .env.local)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx   ✅ done
│   │   └── Footer.tsx   ⚠️ kosong
│   ├── shared/
│   │   ├── LogoutButton.tsx  ✅ done
│   │   └── ProductCard.tsx   ⚠️ kosong
│   ├── forms/               ⚠️ belum ada
│   ├── sections/            ⚠️ belum ada
│   └── ui/
│       └── button.tsx       ✅ done (shadcn)
├── hooks/
│   ├── useAuth.ts   ✅ done
│   └── useCart.ts   ✅ done
├── stores/
│   ├── authStore.ts  ✅ done
│   └── cartStore.ts  ✅ done (zustand + persist)
├── lib/
│   ├── supabase/
│   │   ├── client.ts  ✅ done
│   │   └── server.ts  ✅ done (createClient + createAdminClient)
│   ├── utils.ts       ✅ done
│   └── constants.ts   ✅ done
├── types/
│   └── index.ts  ✅ done (semua interface lengkap)
└── proxy.ts  ✅ done (auth guard untuk protected routes)
```

---

## Database (Supabase)
Migration sudah dijalankan di Supabase. Tabel yang ada:
- `profiles` — extend dari `auth.users`, role: member/vendor/moderator/admin
- `categories` — hierarkikal (parent_id)
- `products` — physical/digital/license_key
- `product_images`, `product_options`
- `cart_items` — database-driven cart
- `orders`, `order_items`
- `reviews`, `wishlists`, `follows`
- `messages` — private messaging
- `coupons`, `withdrawals`
- `blog_posts`, `banners`

RLS sudah aktif di semua tabel.
Trigger `handle_new_user` otomatis insert ke `profiles` saat register.

---

## Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://uoysavqpravgfpalzxsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
XENDIT_SECRET_KEY=...              # belum diisi, perlu setup 2FA di Xendit dulu
XENDIT_WEBHOOK_TOKEN=...           # belum diisi
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=...  # belum diisi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Modesy
```

---

## Progress Saat Ini
| Fitur | Status |
|-------|--------|
| Setup project Next.js 16 | ✅ |
| Konfigurasi Supabase | ✅ |
| Database migration + RLS | ✅ |
| Auth layout | ✅ |
| Halaman Login | ✅ |
| Halaman Register | ✅ |
| Navbar (server component) | ✅ |
| LogoutButton (client component) | ✅ |
| proxy.ts (auth guard) | ✅ |
| Cart store (Zustand) | ✅ |
| Auth store (Zustand) | ✅ |
| Homepage | ⚠️ stub |
| Product detail + add to cart | ❌ |
| Cart page | ❌ |
| Checkout page | ❌ |
| Xendit payment integration | ❌ (perlu key dulu) |
| Realtime order status | ❌ |
| Vendor dashboard | ❌ |
| Moderator dashboard | ❌ |
| Admin dashboard | ❌ |

---

## Target Hari Ini (Prioritas)
1. ✅ Auth (login + register)
2. ⬜ Homepage sederhana
3. ⬜ Product detail page + add to cart
4. ⬜ Cart page
5. ⬜ Checkout page
6. ⬜ Xendit payment (create invoice + webhook handler)
7. ⬜ Realtime order status update via Supabase Realtime

---

## Urutan Pengerjaan Selanjutnya

### 1. Homepage (`src/app/(main)/page.tsx`)
- Banner/hero section
- Featured products grid
- Categories grid

### 2. ProductCard (`src/components/shared/ProductCard.tsx`)
- Gambar produk, nama, harga, vendor
- Tombol add to cart
- Link ke product detail

### 3. Product Detail (`src/app/(main)/products/[slug]/page.tsx`)
- Fetch produk by slug dari Supabase
- Galeri gambar
- Pilih opsi produk (size, warna, dll)
- Tombol Add to Cart → update Supabase `cart_items` + Zustand store
- Review & rating

### 4. Cart Page (`src/app/(main)/cart/page.tsx`)
- List cart items dari Supabase (sync dengan Zustand)
- Update quantity, hapus item
- Total harga
- Tombol Checkout

### 5. Checkout (`src/app/(main)/checkout/page.tsx`)
- Form shipping address
- Ringkasan order
- Tombol bayar → hit `/api/xendit/create-invoice`
- Redirect ke Xendit payment page

### 6. Xendit Webhook (`src/app/api/xendit/webhook/route.ts`)
- Verifikasi webhook token
- Update `orders.status` → `paid`
- Update `order_items.vendor_earning`
- Trigger Supabase Realtime

### 7. Realtime Order Status
- Supabase Realtime subscribe ke `orders` table
- Update UI otomatis saat status order berubah

---

## Catatan Penting
- Next.js 16: `middleware.ts` sudah deprecated, sudah diganti ke `proxy.ts`
- Supabase URL tidak boleh ada `/rest/v1/` di belakangnya
- `src/app/page.tsx` (root) harus dihapus, gunakan `src/app/(main)/page.tsx`
- Xendit belum bisa disetup karena perlu enable 2FA di dashboard Xendit dulu
- Semua server component bisa langsung query Supabase tanpa API route
- Gunakan `createClient()` dari `@/lib/supabase/server` untuk server component
- Gunakan `createClient()` dari `@/lib/supabase/client` untuk client component
