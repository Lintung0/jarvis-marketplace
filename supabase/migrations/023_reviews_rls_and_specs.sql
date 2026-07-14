-- Add specs JSONB column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;

-- Add is_approved column to product_reviews table for moderation
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
