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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload to assets') THEN
    CREATE POLICY "Authenticated users can upload to assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'assets');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update own files') THEN
    CREATE POLICY "Authenticated users can update own files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete own files') THEN
    CREATE POLICY "Authenticated users can delete own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read assets bucket') THEN
    CREATE POLICY "Public read assets bucket"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'assets');
  END IF;
END $$;
