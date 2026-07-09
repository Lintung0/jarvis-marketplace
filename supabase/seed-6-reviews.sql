-- ============================================
-- PART 6: REVIEWS & ADDITIONAL DATA
-- ============================================
-- Run this AFTER part 5

-- Add sample reviews for featured products
-- Note: user_id harus dari profiles yang ada

WITH sample_users AS (
  SELECT id, full_name FROM profiles WHERE role = 'member' LIMIT 5
),
featured_products AS (
  SELECT id, title FROM products WHERE is_featured = true LIMIT 10
)

INSERT INTO product_reviews (product_id, user_id, rating, review_text)
-- Reviews untuk produk pertama
SELECT 
  (SELECT id FROM featured_products LIMIT 1),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 0),
  5,
  'Produk sangat bagus! Kualitas sesuai harga, pengiriman cepat. Recommended seller!'
WHERE EXISTS (SELECT 1 FROM sample_users)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 1),
  4,
  'Barang oke, cuma packingnya bisa lebih rapi lagi. Overall puas'
WHERE EXISTS (SELECT 1 FROM sample_users LIMIT 1 OFFSET 1)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 1),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 0),
  5,
  'Mantap banget! Sesuai deskripsi, bahan premium. Bakal order lagi deh'
WHERE EXISTS (SELECT 1 FROM sample_users)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 1),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 2),
  5,
  'Fast response dari seller, packing rapi bubble wrap tebal. Produk original 100%'
WHERE EXISTS (SELECT 1 FROM sample_users LIMIT 1 OFFSET 2)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 2),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 1),
  4,
  'Bagus sih, tapi agak lama nyampenya. Produknya sesuai ekspektasi'
WHERE EXISTS (SELECT 1 FROM sample_users LIMIT 1 OFFSET 1)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 3),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 0),
  5,
  'Worth it banget! Harga murah tapi kualitas nggak murahan. Highly recommended!'
WHERE EXISTS (SELECT 1 FROM sample_users)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 3),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 3),
  5,
  'Seller responsif, barang cepat sampai, quality control oke. Top seller!'
WHERE EXISTS (SELECT 1 FROM sample_users LIMIT 1 OFFSET 3)

UNION ALL

SELECT 
  (SELECT id FROM featured_products LIMIT 1 OFFSET 4),
  (SELECT id FROM sample_users LIMIT 1 OFFSET 2),
  4,
  'Produk bagus, fitur lengkap. Minus dikit di manual book bahasa Inggris semua'
WHERE EXISTS (SELECT 1 FROM sample_users LIMIT 1 OFFSET 2);

-- Update sold_count untuk products (simulate sales)
UPDATE products SET 
  sold_count = FLOOR(RANDOM() * 100) + 10,
  views = FLOOR(RANDOM() * 1000) + 100
WHERE status = 'active';

-- Update sold_count lebih tinggi untuk featured products
UPDATE products SET 
  sold_count = FLOOR(RANDOM() * 500) + 100,
  views = FLOOR(RANDOM() * 5000) + 500
WHERE is_featured = true AND status = 'active';

-- Calculate and update avg_rating for products with reviews
UPDATE products p
SET avg_rating = sub.avg_rating,
    review_count = sub.review_count
FROM (
  SELECT 
    product_id,
    ROUND(AVG(rating)::numeric, 1) as avg_rating,
    COUNT(*) as review_count
  FROM product_reviews
  GROUP BY product_id
) sub
WHERE p.id = sub.product_id;

-- Verify reviews
SELECT 
  p.title,
  pr.rating,
  pr.review_text,
  prof.full_name as reviewer,
  pr.created_at
FROM product_reviews pr
JOIN products p ON pr.product_id = p.id
LEFT JOIN profiles prof ON pr.user_id = prof.id
ORDER BY pr.created_at DESC
LIMIT 10;

-- Summary statistics
SELECT 
  COUNT(DISTINCT product_id) as products_with_reviews,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating), 2) as avg_rating
FROM product_reviews;
