-- ============================================
-- STEP 0: COMPLETE DATABASE SCHEMA
-- ============================================
-- Run this FIRST before any seed scripts!
-- This ensures all tables exist with proper structure

-- ============================================
-- PRODUCT REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- ============================================
-- ADD MISSING COLUMNS TO PRODUCTS TABLE
-- ============================================

-- Add avg_rating and review_count if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'avg_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN avg_rating DECIMAL(2,1);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- RLS POLICIES FOR PRODUCT_REVIEWS
-- ============================================

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read product reviews" ON product_reviews;
DROP POLICY IF EXISTS "Allow users to create reviews" ON product_reviews;
DROP POLICY IF EXISTS "Allow users to update own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Allow users to delete own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Allow admin to manage reviews" ON product_reviews;

-- Create policies
CREATE POLICY "Allow public read product reviews" 
ON product_reviews FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to create reviews" 
ON product_reviews FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own reviews" 
ON product_reviews FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own reviews" 
ON product_reviews FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow admin to manage all reviews" 
ON product_reviews FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to product_reviews
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================

-- Show created tables
SELECT 
  'product_reviews' as table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'product_reviews';

-- Show products table has new columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('avg_rating', 'review_count')
ORDER BY column_name;

-- Show RLS policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'product_reviews'
ORDER BY policyname;

-- Final success message
SELECT 
  '✅ Schema setup complete! Ready for seeding.' as status,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews') as reviews_table_exists,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'avg_rating') as avg_rating_exists,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') as review_count_exists;
