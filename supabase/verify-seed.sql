-- ============================================
-- QUICK VERIFICATION SCRIPT
-- ============================================
-- Run this to check if seeding was successful

-- 1. Summary Statistics
SELECT 
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM categories WHERE parent_id IS NULL) as main_categories,
  (SELECT COUNT(*) FROM categories WHERE parent_id IS NOT NULL) as sub_categories,
  (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
  (SELECT COUNT(*) FROM product_images) as total_images,
  (SELECT COUNT(*) FROM product_reviews) as total_reviews,
  (SELECT COUNT(*) FROM profiles WHERE role = 'vendor') as total_vendors;

-- 2. Products by Category
SELECT 
  c.name as category,
  COUNT(p.id) as product_count,
  SUM(CASE WHEN p.is_featured THEN 1 ELSE 0 END) as featured_count,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
WHERE c.parent_id IS NULL
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- 3. Top 10 Featured Products
SELECT 
  p.title,
  p.slug,
  p.price,
  p.sale_price,
  ROUND(((p.price - p.sale_price) / p.price * 100)::numeric, 0) as discount_pct,
  p.stock,
  p.sold_count,
  p.avg_rating,
  c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_featured = true
ORDER BY p.sold_count DESC
LIMIT 10;

-- 4. Products with Most Reviews
SELECT 
  p.title,
  p.review_count,
  p.avg_rating,
  p.sold_count
FROM products p
WHERE p.review_count > 0
ORDER BY p.review_count DESC, p.avg_rating DESC;

-- 5. Check Product Images Distribution
SELECT 
  img_count,
  COUNT(*) as products_with_this_many_images
FROM (
  SELECT product_id, COUNT(*) as img_count
  FROM product_images
  GROUP BY product_id
) sub
GROUP BY img_count
ORDER BY img_count;

-- 6. Sample Products for Testing
SELECT 
  'http://localhost:3000/products/' || p.slug as test_url,
  p.title,
  p.price,
  c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
ORDER BY p.is_featured DESC, p.created_at DESC
LIMIT 10;
