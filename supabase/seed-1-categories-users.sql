-- ============================================
-- PART 1: CATEGORIES & USERS/PROFILES
-- ============================================
-- Run this FIRST in Supabase SQL Editor

-- 1. INSERT CATEGORIES
INSERT INTO categories (name, slug, description, icon, is_active, parent_id) 
VALUES 
  -- Main Categories
  ('Fashion & Pakaian', 'fashion-pakaian', 'Pakaian, sepatu, dan aksesoris fashion', '👕', true, NULL),
  ('Elektronik', 'elektronik', 'Gadget, laptop, dan elektronik rumah tangga', '📱', true, NULL),
  ('Komputer & Laptop', 'komputer-laptop', 'Laptop, PC, dan aksesoris komputer', '💻', true, NULL),
  ('Olahraga & Outdoor', 'olahraga-outdoor', 'Perlengkapan olahraga dan aktivitas outdoor', '⚽', true, NULL),
  ('Rumah & Furniture', 'rumah-furniture', 'Perabotan rumah dan dekorasi', '🏠', true, NULL),
  ('Buku & Hobi', 'buku-hobi', 'Buku, alat musik, dan koleksi hobi', '📚', true, NULL),
  ('Kecantikan & Kesehatan', 'kecantikan-kesehatan', 'Produk kecantikan dan kesehatan', '💄', true, NULL),
  ('Makanan & Minuman', 'makanan-minuman', 'Makanan, minuman, dan camilan', '🍔', true, NULL),
  ('Otomotif', 'otomotif', 'Aksesoris mobil dan motor', '🚗', true, NULL),
  ('Gaming', 'gaming', 'Game, console, dan aksesoris gaming', '🎮', true, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;

-- 2. INSERT SUB-CATEGORIES
WITH parent_categories AS (
  SELECT id, slug FROM categories WHERE parent_id IS NULL
)
INSERT INTO categories (name, slug, description, icon, is_active, parent_id)
SELECT 'Pakaian Pria', 'pakaian-pria', 'Fashion untuk pria', '👔', true, id FROM parent_categories WHERE slug = 'fashion-pakaian'
UNION ALL
SELECT 'Pakaian Wanita', 'pakaian-wanita', 'Fashion untuk wanita', '👗', true, id FROM parent_categories WHERE slug = 'fashion-pakaian'
UNION ALL
SELECT 'Sepatu', 'sepatu', 'Sepatu pria dan wanita', '👟', true, id FROM parent_categories WHERE slug = 'fashion-pakaian'
UNION ALL
SELECT 'Tas & Aksesoris', 'tas-aksesoris', 'Tas, dompet, dan aksesoris', '👜', true, id FROM parent_categories WHERE slug = 'fashion-pakaian'
UNION ALL
SELECT 'Smartphone', 'smartphone', 'HP dan aksesoris', '📱', true, id FROM parent_categories WHERE slug = 'elektronik'
UNION ALL
SELECT 'Audio', 'audio', 'Headphone, speaker, earphone', '🎧', true, id FROM parent_categories WHERE slug = 'elektronik'
UNION ALL
SELECT 'Kamera', 'kamera', 'Kamera digital dan aksesoris', '📷', true, id FROM parent_categories WHERE slug = 'elektronik'
UNION ALL
SELECT 'Laptop Gaming', 'laptop-gaming', 'Laptop untuk gaming', '🎮', true, id FROM parent_categories WHERE slug = 'komputer-laptop'
UNION ALL
SELECT 'Aksesoris Komputer', 'aksesoris-komputer', 'Mouse, keyboard, monitor', '⌨️', true, id FROM parent_categories WHERE slug = 'komputer-laptop'
ON CONFLICT (slug) DO NOTHING;

-- 3. CREATE/UPDATE VENDOR PROFILES
-- NOTE: Pastikan user sudah ada di auth.users dulu!
-- Kalau belum ada, buat user dulu via Supabase Auth

-- Update existing users jadi vendor (sesuaikan dengan user yang ada)
-- Atau bisa manual insert kalau sudah punya UUID dari auth.users

-- Example: Update user pertama jadi Admin
UPDATE profiles 
SET 
  role = 'admin',
  full_name = 'Admin Modesy',
  username = 'admin',
  bio = 'Administrator Modesy Marketplace',
  location = 'Jakarta, Indonesia',
  is_verified = true,
  avatar_url = NULL
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1)
  AND role = 'member'; -- hanya update kalau masih member

-- Create dummy vendor profiles (manual insert dengan UUID)
-- IMPORTANT: Ganti UUID ini dengan UUID dari auth.users yang ada!
-- Atau skip bagian ini kalau mau pakai profile yang sudah ada

-- Contoh insert vendor (uncomment kalau mau pakai):
/*
INSERT INTO profiles (id, email, username, full_name, role, bio, location, is_verified, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'vendor1@example.com', 'tokoelektronik', 'Toko Elektronik Jakarta', 'vendor', 'Menjual berbagai produk elektronik original', 'Jakarta', true, NULL),
  ('22222222-2222-2222-2222-222222222222', 'vendor2@example.com', 'fashionstore', 'Fashion Store Premium', 'vendor', 'Fashion branded original', 'Bandung', true, NULL),
  ('33333333-3333-3333-3333-333333333333', 'vendor3@example.com', 'gamingshop', 'Gaming Shop Indonesia', 'vendor', 'Lengkap untuk kebutuhan gaming', 'Surabaya', true, NULL)
ON CONFLICT (id) DO NOTHING;
*/

-- 4. VERIFY
SELECT 
  c.name as category,
  c.slug,
  c.is_active,
  p.name as parent_category
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
ORDER BY c.parent_id NULLS FIRST, c.name;

SELECT 
  id, 
  email, 
  username, 
  full_name, 
  role, 
  is_verified,
  location
FROM profiles
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'moderator' THEN 2
    WHEN 'vendor' THEN 3
    ELSE 4
  END,
  created_at;

-- Total Categories
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_vendors FROM profiles WHERE role = 'vendor';
