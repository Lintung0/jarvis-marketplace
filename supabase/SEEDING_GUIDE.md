# 🌱 DATABASE SEEDING GUIDE

## 📋 Overview

Script ini akan mengisi database dengan:
- **10 Categories** utama + 9 sub-categories
- **27 Products** (Fashion, Elektronik, Gaming, Komputer)
- **Product Images** untuk semua produk
- **Sample Reviews** untuk featured products
- **Vendor Profiles** (menggunakan existing user)

---

## 🚀 CARA PAKAI

### Step 1: Buka Supabase Dashboard
1. Login ke [https://supabase.com](https://supabase.com)
2. Pilih project: **modesy-clone**
3. Klik menu **SQL Editor** di sidebar kiri

### Step 2: Run Scripts Berurutan

**PENTING:** Jalankan script satu per satu sesuai urutan!

#### Script 0: Schema Setup (WAJIB FIRST!!!)
```
File: seed-0-schema-setup.sql
```
- Create table `product_reviews` (kalau belum ada)
- Add columns `avg_rating` dan `review_count` ke `products` table
- Setup RLS policies
- Create triggers

**HARUS RUN INI DULU!** Kalau skip, script lain akan error.

#### Script 1: Categories & Users
```
File: seed-1-categories-users.sql
```
- Buat 10 categories utama
- Buat 9 sub-categories
- Update existing user jadi vendor

**PERHATIAN:** 
- Pastikan sudah ada minimal 1 user di `auth.users`
- Script akan update user pertama jadi admin
- Kalau mau buat vendor baru, uncomment bagian INSERT profiles di akhir

#### Script 2: Fashion Products
```
File: seed-2-products-fashion.sql
```
- 9 products fashion (Kaos, Kemeja, Celana, Dress, Sepatu, dll)
- Kategori: Fashion, Pakaian Pria, Pakaian Wanita, Sepatu

#### Script 3: Elektronik Products
```
File: seed-3-products-elektronik.sql
```
- 9 products elektronik (TWS, Powerbank, Headphone, Speaker, dll)
- Kategori: Elektronik, Smartphone, Audio, Kamera

#### Script 4: Gaming & Komputer
```
File: seed-4-products-gaming.sql
```
- 9 products gaming & komputer (Mouse, Keyboard, Monitor, SSD, RAM, dll)
- Kategori: Gaming, Komputer, Aksesoris Komputer

#### Script 5: Product Images
```
File: seed-5-product-images.sql
```
- Tambah images untuk semua products
- Featured products dapat 3-4 gambar
- Regular products dapat 1-2 gambar

#### Script 6: Reviews & Stats
```
File: seed-6-reviews.sql
```
- Tambah sample reviews (8 reviews)
- Update sold_count (10-500 terjual)
- Update views count (100-5000 views)
- Calculate avg_rating otomatis

---

## ✅ VERIFICATION

Setelah run semua script, verify dengan query ini:

```sql
-- Check total data
SELECT 
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
  (SELECT COUNT(*) FROM product_images) as total_images,
  (SELECT COUNT(*) FROM product_reviews) as total_reviews,
  (SELECT COUNT(*) FROM profiles WHERE role = 'vendor') as total_vendors;

-- Check featured products
SELECT title, slug, price, sale_price, stock, sold_count, avg_rating
FROM products 
WHERE is_featured = true
ORDER BY created_at DESC;

-- Check categories dengan product count
SELECT 
  c.name,
  c.slug,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
GROUP BY c.id, c.name, c.slug
ORDER BY product_count DESC;
```

**Expected Results:**
- ✅ 19 categories (10 main + 9 sub)
- ✅ 27 active products
- ✅ 50-80 product images
- ✅ 8 reviews
- ✅ 1+ vendors

---

## 🔧 TROUBLESHOOTING

### Error: "violates foreign key constraint vendor_id"
**Problem:** Belum ada user/vendor di database

**Fix:**
1. Pastikan minimal 1 user exist di `auth.users`
2. Atau login dulu ke aplikasi untuk auto-create profile
3. Check: `SELECT * FROM profiles LIMIT 5;`

### Error: "duplicate key value violates unique constraint"
**Problem:** Data sudah ada (run script 2x)

**Fix:**
1. Script sudah pakai `ON CONFLICT DO NOTHING`
2. Skip error atau run `DELETE` query untuk reset
3. Fresh start: Delete all products first

### Products tidak muncul di homepage
**Problem:** RLS policies blocking query

**Fix:**
```sql
-- Add RLS policy untuk public read
CREATE POLICY "Allow public read active products" 
ON products FOR SELECT 
USING (status = 'active');

CREATE POLICY "Allow public read product images" 
ON product_images FOR SELECT 
USING (true);
```

### Images tidak muncul (404)
**Problem:** Placeholder image belum ada

**Fix:**
```bash
cd /home/kirek/code/modesy/modesy-clone/public
curl -s "https://placehold.co/600x600/e5e7eb/999999?text=No+Image" \
  -o placeholder-product.png
```

---

## 📊 DATABASE STRUCTURE

```
categories (19 rows)
├── Fashion & Pakaian (4 sub-cats)
│   ├── Pakaian Pria (3 products)
│   ├── Pakaian Wanita (3 products)
│   └── Sepatu (3 products)
├── Elektronik (3 sub-cats)
│   ├── Smartphone (3 products)
│   ├── Audio (3 products)
│   └── Kamera (2 products)
├── Komputer & Laptop (2 sub-cats)
│   ├── Aksesoris Komputer (3 products)
│   └── (1 product di parent)
├── Gaming (4 products)
└── Other categories (0 products yet)

products (27 rows)
├── Featured: 15 products
├── With discount: 18 products
├── High stock (>80): 12 products
└── With reviews: 4-5 products

product_images (50-80 rows)
└── 1-4 images per product

product_reviews (8 rows)
└── Rating 4-5 stars
```

---

## 🎯 NEXT STEPS

After seeding:

1. **Restart dev server**
   ```bash
   npm run dev
   ```

2. **Test pages:**
   - Homepage: http://localhost:3000
   - Products: http://localhost:3000/products
   - Category: http://localhost:3000/categories/fashion-pakaian
   - Detail: http://localhost:3000/products/kaos-polos-premium-cotton

3. **Test features:**
   - ✅ Search "kaos" → Should find products
   - ✅ Filter by category
   - ✅ Sort by price
   - ✅ Add to cart
   - ✅ Product detail page with images

4. **Check console:**
   - No errors di browser console (F12)
   - Products load successfully
   - Images show (even if placeholder)

---

## 📝 NOTES

- **Placeholder Images:** Semua produk pakai `/placeholder-product.png` dulu
- **Real Images:** Nanti bisa upload real images via admin/vendor dashboard
- **More Products:** Bisa duplicate script 2-4 dan modify title/slug/description
- **Vendor Assignment:** All products assigned ke vendor pertama di database
- **Reviews:** Limited reviews for now, bisa tambah manual atau via app
- **Stock Management:** Stock akan berkurang saat ada order (implemented)

---

## 🚨 IMPORTANT

**Backup Database First!**
```sql
-- Export current data (optional)
-- Via Supabase Dashboard > Database > Backups
```

**Reset Database (if needed):**
```sql
-- WARNING: This deletes ALL data!
DELETE FROM product_reviews;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
-- Note: Profiles tidak di-delete (biar auth tetap jalan)
```

---

**Created:** 2026-07-06  
**Author:** Kiro AI  
**Version:** 1.0  
**Total Products:** 27  
**Total Categories:** 19
