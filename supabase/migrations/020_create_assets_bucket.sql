-- Create the assets storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  10485760,
  '{image/jpeg,image/png,image/gif,image/webp,application/pdf,video/mp4,audio/mpeg}'
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the assets bucket
CREATE POLICY IF NOT EXISTS "Authenticated users can upload to assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Allow authenticated users to update their own files
CREATE POLICY IF NOT EXISTS "Authenticated users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own files
CREATE POLICY IF NOT EXISTS "Authenticated users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow public read on storage objects in assets bucket
CREATE POLICY IF NOT EXISTS "Public read assets bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');
