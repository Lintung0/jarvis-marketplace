-- Ensure each product has at most one primary image
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_per_product
ON public.product_images (product_id) WHERE is_primary = true;
