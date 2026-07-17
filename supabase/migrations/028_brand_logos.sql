-- Migration: Update brand logo URLs to local files and create storage bucket
-- Date: 2026-07-17

-- Update existing brand logo_urls to local paths
UPDATE public.brands SET logo_url = '/brands/samsung.png' WHERE slug = 'samsung';
UPDATE public.brands SET logo_url = '/brands/apple.png' WHERE slug = 'apple';
UPDATE public.brands SET logo_url = '/brands/sony.png' WHERE slug = 'sony';
UPDATE public.brands SET logo_url = '/brands/nike.png' WHERE slug = 'nike';
UPDATE public.brands SET logo_url = '/brands/adidas.png' WHERE slug = 'adidas';
UPDATE public.brands SET logo_url = '/brands/asus.png' WHERE slug = 'asus';
UPDATE public.brands SET logo_url = '/brands/xiaomi.png' WHERE slug = 'xiaomi';
UPDATE public.brands SET logo_url = '/brands/logitech.png' WHERE slug = 'logitech';
UPDATE public.brands SET logo_url = '/brands/lg.png' WHERE slug = 'lg';
UPDATE public.brands SET logo_url = '/brands/lenovo.png' WHERE slug = 'lenovo';
UPDATE public.brands SET logo_url = '/brands/gucci.png' WHERE slug = 'gucci';
UPDATE public.brands SET logo_url = '/brands/puma.png' WHERE slug = 'puma';
UPDATE public.brands SET logo_url = '/brands/levis.png' WHERE slug = 'levis';
UPDATE public.brands SET logo_url = '/brands/zara.png' WHERE slug = 'zara';
UPDATE public.brands SET logo_url = '/brands/under-armour.png' WHERE slug = 'under-armour';

-- Create storage bucket for brand logo uploads (for admin)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-logos',
  'brand-logos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin can upload brand logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update brand logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view brand logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete brand logos" ON storage.objects;

CREATE POLICY "Admin can upload brand logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand-logos');

CREATE POLICY "Admin can update brand logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brand-logos');

CREATE POLICY "Public can view brand logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brand-logos');

CREATE POLICY "Admin can delete brand logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brand-logos');
