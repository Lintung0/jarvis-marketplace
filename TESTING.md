# 🧪 TEST PLAN — Modesy Clone (Complete)

> Jalankan `npm run dev` dulu, buka `http://localhost:3000`
> Login pake akun dari `seed-accounts.sql`

---

## 1. PUBLIC / GUEST (Belum Login)

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 1.1 | Homepage | Buka `/` | Hero section neon, kategori, featured products |
| 1.2 | Semua produk | Klik "All Products" / `/products` | List produk dengan search + filter + sort + pagination |
| 1.3 | Detail produk | Klik salah satu produk | Gallery, harga, add to cart, vendor info, reviews |
| 1.4 | Kategori | Klik kategori di navbar / `/categories` | List kategori + sub-kategori |
| 1.5 | Produk per kategori | Klik kategori | Filtered products |
| 1.6 | Vendor list | `/vendors` | Semua vendor dengan jumlah produk |
| 1.7 | Vendor profile | Klik vendor | Avatar, bio, stats, list produk vendor |
| 1.8 | Blog list | `/blog` | Artikel published |
| 1.9 | Blog detail | Klik artikel | Konten lengkap |
| 1.10 | Halaman statis | `/about-us`, `/contact`, `/help-center`, `/terms-conditions`, `/privacy-policy`, `/sell-on-modesy` | Konten sesuai halaman |
| 1.11 | Cart tanpa login | Buka `/cart` | Kosong / empty state |
| 1.12 | Wishlist tanpa login | Buka `/wishlist` | Redirect ke login |
| 1.13 | Navbar guest | Cek navbar | Ada tombol "Register", "Account" |
| 1.14 | Search | Ketik kata kunci di search bar + enter | Redirect ke `/products?q=...` |

---

## 2. AUTH (Registrasi & Login)

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 2.1 | Register | `/register`, isi form | Submit, redirect ke homepage, navbar berubah (ada Wishlist/Cart/Account) |
| 2.2 | Login | `/login`, email + password | Redirect ke homepage |
| 2.3 | Login invalid | Email salah / password salah | Error message merah |
| 2.4 | Logout | Klik Logout button | Kembali ke guest mode |
| 2.5 | Forgot password | `/forgot-password` | Form reset email |
| 2.6 | Google OAuth | Klik "Login with Google" | Redirect ke Google, balik ke callback |

---

## 3. MEMBER ROLE (Sudah Login)

Login sebagai `member1@modesy.com` / `password123`

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 3.1 | Beli produk | Buka detail produk → pilih opsi (kalo ada) → pilih quantity → klik Add to Cart | Toast sukses |
| 3.2 | Cart page | Buka `/cart` | Item muncul, bisa update qty ( +/- ), hapus item, total otomatis update |
| 3.3 | Checkout | Klik Checkout di cart | Form shipping, ringkasan order, tombol bayar |
| 3.4 | Checkout empty | Cart kosong → `/checkout` | Redirect atau empty state |
| 3.5 | Bayar Xendit | Klik "Bayar Sekarang" | Redirect ke halaman payment Xendit |
| 3.6 | Order history | `/orders` | List order yg udah dibayar |
| 3.7 | Order detail | Klik salah satu order | Detail item, status badge, alamat |
| 3.8 | Wishlist add | Klik icon heart di ProductCard | Heart terisi, toast sukses |
| 3.9 | Wishlist page | `/wishlist` | Produk yg di-wishlist muncul |
| 3.10 | Wishlist remove | Klik heart lagi (di wishlist page atau product card) | Produk hilang dari wishlist |
| 3.11 | Profile | `/profile` | Data profil, role badge, tabs |
| 3.12 | Edit profile | Klik edit di profile | Modal edit, simpan, data berubah |
| 3.13 | Review produk | Buka detail produk → scroll ke review → isi rating + komen → submit | Toast "Review submitted! Waiting for approval." |
| 3.14 | Contact form | `/contact` → isi nama, email, pesan → Kirim | Toast sukses hijau |
| 3.15 | Coupon input | Di checkout, ada input kupon? | (kalo ada) Bisa input kode kupon |

---

## 4. VENDOR ROLE

Login sebagai `vendor1@modesy.com` / `password123`

### 4.1 Vendor Dashboard

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 4.1.1 | Akses dashboard | `/vendor` | Stats cards (total produk, orders, earnings) |
| 4.1.2 | Navbar dashboard | Cek toggle sidebar | Sidebar collapsible |
| 4.1.3 | Back to store | Klik "Back to Store" | Kembali ke homepage |

### 4.2 Vendor — Products

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 4.2.1 | List produk | `/vendor/products` | Tabel produk vendor ini |
| 4.2.2 | Search produk | Ketik di search | Filter produk by title |
| 4.2.3 | Filter status | Pilih status di dropdown | Filter by status |
| 4.2.4 | Add product | Klik "Add Product" → `/vendor/products/new` | Form muncul |
| 4.2.5 | Save product | Isi title, deskripsi, price, stock, pilih status → Save | Redirect ke `/vendor/products`, produk muncul di tabel |
| 4.2.6 | Edit product | Klik "Edit" di tabel produk → `/vendor/products/[id]/edit` | Form terisi data lama |
| 4.2.7 | Update product | Edit data → klik "Update Product" | Redirect, data berubah |
| 4.2.8 | Delete product | Klik "Delete" → konfirmasi | Produk hilang dari tabel |

### 4.3 Vendor — Orders

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 4.3.1 | List orders | `/vendor/orders` | Order items dari produk vendor ini |
| 4.3.2 | Order detail | Klik salah satu order | Detail item, quantity, total, status |

### 4.4 Vendor — Earnings

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 4.4.1 | Earnings page | `/vendor/earnings` | Stats: Revenue, Earnings, Balance, Pending |
| 4.4.2 | Request payout | Isi amount, method, account → "Request Payout" | Toast sukses, payout muncul di history |
| 4.4.3 | Payout history | Scroll ke bawah | List payout request sebelumnya |
| 4.4.4 | Validasi payout | Isi amount > balance | Error message |

---

## 5. MODERATOR ROLE

Login sebagai `moderator@modesy.com` / `password123`

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 5.1 | Dashboard | `/moderator` | Stats: pending products, reports, flagged reviews |
| 5.2 | Product moderation | `/moderator/products` | List produk pending |
| 5.3 | Approve product | Klik "Approve" | Produk jadi active |
| 5.4 | Reject product | Klik "Reject" | Produk jadi rejected |
| 5.5 | Review moderation | `/moderator/reviews` | List reviews pending |
| 5.6 | Approve review | Klik "Approve" | Review di-approve |
| 5.7 | Delete review | Klik "Delete" | Review dihapus |
| 5.8 | Reports | `/moderator/reports` | List messages dari user |
| 5.9 | Ban user | Klik "Ban" di salah satu user | User jadi banned |

---

## 6. ADMIN ROLE

Login sebagai `admin@modesy.com` / `password123`

### 6.1 Admin Dashboard

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.1.1 | Dashboard | `/admin` | Global stats (total produk, categories, orders, users, vendors) |
| 6.1.2 | Sidebar | Cek sidebar | Ada: Dashboard, Products, Orders, Categories, Vendors, Settings |

### 6.2 Admin — Products

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.2.1 | List produk | `/admin/products` | Semua produk dari semua vendor |
| 6.2.2 | Update status | Ganti dropdown status | Status berubah langsung |
| 6.2.3 | Delete produk | Klik "Delete" → konfirmasi | Produk hilang |

### 6.3 Admin — Orders

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.3.1 | List orders | `/admin/orders` | Semua order dari semua buyer |
| 6.3.2 | Update status | Ganti dropdown status order | Status berubah |

### 6.4 Admin — Vendors

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.4.1 | List vendors | `/admin/vendors` | Semua user dengan role vendor |
| 6.4.2 | Verify vendor | Klik "Verify" | Badge berubah jadi Verified |
| 6.4.3 | Ban vendor | Klik "Ban" | Badge berubah jadi Banned |

### 6.5 Admin — Categories

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.5.1 | List kategori | `/admin/categories` | Semua kategori + icon + status |
| 6.5.2 | Create kategori | Isi form "Add New Category" di sidebar kanan → Create | Kategori baru muncul di tabel |
| 6.5.3 | Toggle kategori | Klik "Active" / "Inactive" | Status berubah |
| 6.5.4 | Delete kategori | Klik "Delete" → konfirmasi | Kategori hilang |

### 6.6 Admin — Settings

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 6.6.1 | Settings page | `/admin/settings` | Form: App Name, Commission, Payment Gateways, Shipping |
| 6.6.2 | Save settings | Edit field → klik "Save Settings" | Toast "Settings saved successfully!" |

---

## 7. DASHBOARD ACCESS CONTROL

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 7.1 | Member akses /vendor | Login sbg member → buka `/vendor` | Redirect ke `/products` |
| 7.2 | Member akses /admin | Login sbg member → buka `/admin` | Redirect ke `/products` |
| 7.3 | Member akses /moderator | Login sbg member → buka `/moderator` | Redirect ke `/products` |
| 7.4 | Vendor akses /admin | Login sbg vendor → buka `/admin` | Redirect ke `/products` |
| 7.5 | Vendor akses /moderator | Login sbg vendor → buka `/moderator` | Redirect ke `/products` |
| 7.6 | Moderator akses /admin | Login sbg moderator → buka `/admin` | Redirect ke `/products` |
| 7.7 | Unauthenticated akses dashboard | Logout → buka `/vendor` atau `/admin` | Redirect ke `/login` |

---

## 8. RESPONSIVE & UI

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 8.1 | Mobile navbar | Resize < 768px | Navbar jadi mobile (hamburger menu) |
| 8.2 | Mobile menu | Klik hamburger | Sheet/drawer dari kanan |
| 8.3 | Mobile sidebar dashboard | Resize dashboard | Sidebar hidden, konten full width |
| 8.4 | Dark theme | Cek semua halaman | Background gelap (#0a0a1a), teks terang |
| 8.5 | Neon glow | Cek button, badge, card hover | Glow cyan/pink sesuai interaksi |
| 8.6 | Animasi | Scroll homepage | Hero animasi, card hover effects |

---

## 9. BUILD & DEPLOYMENT CHECK

| # | Test Case | Langkah | Expected |
|---|-----------|---------|----------|
| 9.1 | Build | `npm run build` | ✅ Compiled successfully, 0 errors |
| 9.2 | TypeScript | `npx tsc --noEmit` | ✅ No type errors |
| 9.3 | Lint | `npm run lint` | ✅ No lint errors |
| 9.4 | Dev server | `npm run dev` | ✅ Server started di localhost:3000 |

---

## 10. CHECKLIST CEPAT

```
[ ] 1.1-1.14 Guest pages
[ ] 2.1-2.6 Auth flow
[ ] 3.1-3.15 Member features
[ ] 4.1.1-4.4.4 Vendor dashboard
[ ] 5.1-5.9 Moderator dashboard
[ ] 6.1.1-6.6.2 Admin dashboard
[ ] 7.1-7.7 Access control
[ ] 8.1-8.6 Responsive & UI
[ ] 9.1-9.4 Build verification
```

---

**Total: ~90 test cases**
**Last Updated:** 2026-07-07
