# Laporan Harian
## Lintang Mahameru Putra || SMKN 6 Malang

**Hari Rabu, 8 Juli 2026**

**Project : Marketplace Modesy (Next.js + Supabase + Xendit)**

---

- Memperbaiki order tidak muncul di halaman vendor karena kolom `created_at` hilang dari tabel `order_items` (done)

- Memperbaiki error 500 "Order not found" saat klik Process karena RLS block akses vendor ke tabel orders (done)

- Memperbaiki UI tombol Process yang tidak berubah jadi Ship setelah diklik (done)

- Menambahkan fitur auto-deliver 5 detik setelah vendor klik Ship (done)

- Memperbaiki status badge buyer agar realtime mengikuti perubahan status dari vendor (done)

- Memperbaiki dashboard vendor bagian "Recent Orders" yang selalu kosong (done)

- Memperbaiki rate limit login yang terlalu ketat dari 5 ke 10 kali per menit (done)

---

### Catatan
- Semua perubahan sudah di-typecheck (`tsc --noEmit` lulus)
- Dev server perlu di-restart setelah perubahan
- Issue homepage hanya menampilkan 1 produk sedang diidentifikasi — kemungkinan vendor utama terban
