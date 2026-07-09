-- ============================================
-- CHECK EXISTING DATABASE SCHEMA
-- ============================================
-- Run this to see what tables already exist

-- 1. List all tables in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check if specific tables exist
SELECT 
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'products') as products_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'product_images') as product_images_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews') as product_reviews_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') as categories_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') as profiles_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') as cart_items_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') as orders_exists,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') as wishlists_exists;

-- 3. Check products table columns
SELECT 
  column_name, 
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 4. Check if avg_rating and review_count columns exist in products
SELECT 
  EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'avg_rating'
  ) as has_avg_rating,
  EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'review_count'
  ) as has_review_count;

-- 5. Show sample data counts
SELECT 
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM profiles WHERE role = 'vendor') as total_vendors;
