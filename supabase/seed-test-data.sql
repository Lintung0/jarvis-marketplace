-- Seed script untuk testing
-- Run ini di Supabase SQL Editor

-- 1. Buat kategori testing
INSERT INTO categories (name, slug, description, icon, is_active) 
VALUES 
  ('Clothing', 'clothing', 'Fashion & Apparel', '👕', true),
  ('Electronics', 'electronics', 'Gadgets & Tech', '📱', true),
  ('Books', 'books', 'Reading Materials', '📚', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Buat test vendor (pastikan user sudah ada di auth.users)
-- Update existing profile jadi vendor
UPDATE profiles 
SET role = 'vendor', 
    full_name = 'Test Vendor',
    location = 'Jakarta',
    bio = 'Test vendor for marketplace',
    is_verified = true
WHERE email = 'test@example.com'; -- ganti dengan email user yang ada

-- 3. Buat products
WITH vendor AS (
  SELECT id FROM profiles WHERE role = 'vendor' LIMIT 1
),
cat_clothing AS (
  SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1
),
cat_electronics AS (
  SELECT id FROM categories WHERE slug = 'electronics' LIMIT 1
)
INSERT INTO products (vendor_id, category_id, title, slug, description, price, sale_price, stock, type, status, is_featured)
SELECT 
  vendor.id,
  cat_clothing.id,
  'Kaos Polos Premium',
  'kaos-polos-premium',
  'Kaos polos berkualitas tinggi dengan bahan cotton combed 30s. Nyaman dipakai sehari-hari.',
  150000,
  120000,
  50,
  'physical',
  'active',
  true
FROM vendor, cat_clothing
UNION ALL
SELECT 
  vendor.id,
  cat_clothing.id,
  'Celana Jeans Slim Fit',
  'celana-jeans-slim-fit',
  'Celana jeans dengan model slim fit, cocok untuk gaya kasual maupun formal.',
  350000,
  NULL,
  30,
  'physical',
  'active',
  false
FROM vendor, cat_clothing
UNION ALL
SELECT 
  vendor.id,
  cat_electronics.id,
  'Wireless Mouse Gaming',
  'wireless-mouse-gaming',
  'Mouse gaming wireless dengan 6 tombol programmable dan RGB lighting.',
  250000,
  200000,
  20,
  'physical',
  'active',
  true
FROM vendor, cat_electronics;

-- 4. Buat product images
WITH products_data AS (
  SELECT id, slug FROM products WHERE slug IN ('kaos-polos-premium', 'celana-jeans-slim-fit', 'wireless-mouse-gaming')
)
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT 
  id,
  '/placeholder-product.png',
  'Product Image',
  true,
  1
FROM products_data;

-- 5. Verify
SELECT 
  p.title,
  p.slug,
  p.price,
  p.status,
  c.name as category,
  prof.username as vendor
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN profiles prof ON p.vendor_id = prof.id
WHERE p.status = 'active';
