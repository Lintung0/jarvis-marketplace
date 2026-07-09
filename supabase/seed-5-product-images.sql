-- ============================================
-- PART 5: PRODUCT IMAGES
-- ============================================
-- Run this AFTER part 4

-- Add product images for all products
-- Using placeholder images for now

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT 
  p.id,
  '/placeholder-product.png',
  p.title || ' - Main Image',
  true,
  1
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Add additional images (2-4 images per product)
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT 
  p.id,
  '/placeholder-product.png',
  p.title || ' - Image 2',
  false,
  2
FROM products p
WHERE p.stock > 50; -- Products dengan stock tinggi dapat multiple images

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT 
  p.id,
  '/placeholder-product.png',
  p.title || ' - Image 3',
  false,
  3
FROM products p
WHERE p.is_featured = true; -- Featured products dapat lebih banyak gambar

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT 
  p.id,
  '/placeholder-product.png',
  p.title || ' - Image 4',
  false,
  4
FROM products p
WHERE p.sale_price IS NOT NULL; -- Products dengan discount dapat extra image

-- Verify
SELECT 
  p.title,
  COUNT(pi.id) as image_count,
  string_agg(pi.is_primary::text, ', ') as primary_flags
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.title
ORDER BY image_count DESC, p.title
LIMIT 20;

-- Summary
SELECT 
  COUNT(DISTINCT product_id) as products_with_images,
  COUNT(*) as total_images,
  ROUND(AVG(img_count), 2) as avg_images_per_product
FROM (
  SELECT product_id, COUNT(*) as img_count
  FROM product_images
  GROUP BY product_id
) sub;
