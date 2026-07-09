-- QUICK DATABASE CHECK
-- Run this in Supabase SQL Editor

-- 1. Check berapa products yang ada
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_products
FROM products;

-- 2. Check products dengan images
SELECT 
  p.id,
  p.title,
  p.slug,
  p.status,
  p.price,
  COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.title, p.slug, p.status, p.price
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Check categories
SELECT id, name, slug, is_active 
FROM categories 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check vendors
SELECT 
  id, 
  username, 
  full_name, 
  role, 
  is_verified
FROM profiles 
WHERE role = 'vendor'
LIMIT 10;

-- 5. Sample product detail query (simulating app query)
SELECT 
  p.*,
  json_agg(DISTINCT jsonb_build_object(
    'id', pi.id,
    'url', pi.url,
    'alt', pi.alt,
    'is_primary', pi.is_primary
  )) FILTER (WHERE pi.id IS NOT NULL) as images,
  jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'full_name', prof.full_name,
    'avatar_url', prof.avatar_url,
    'is_verified', prof.is_verified
  ) as vendor,
  jsonb_build_object(
    'id', c.id,
    'name', c.name,
    'slug', c.slug
  ) as category
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN profiles prof ON p.vendor_id = prof.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
GROUP BY p.id, prof.id, prof.username, prof.full_name, prof.avatar_url, prof.is_verified, c.id, c.name, c.slug
LIMIT 1;
