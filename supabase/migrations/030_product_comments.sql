-- Migration: Create product_comments table for product discussion
-- Date: 2026-07-17

CREATE TABLE IF NOT EXISTS public.product_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.product_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_comments_product_id ON public.product_comments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comments_parent_id ON public.product_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_comments_created_at ON public.product_comments(created_at DESC);

ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view comments" ON public.product_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.product_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.product_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.product_comments;

CREATE POLICY "Anyone can view comments"
    ON public.product_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.product_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON public.product_comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON public.product_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_product_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_comments_updated_at
    BEFORE UPDATE ON public.product_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_comments_updated_at();

GRANT ALL ON public.product_comments TO authenticated;
GRANT SELECT ON public.product_comments TO anon;
