-- Allow authenticated users to upload files to the assets bucket
CREATE POLICY "Authenticated users can upload to assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assets'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow public read on storage objects in assets bucket
CREATE POLICY "Public read assets bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- 🔐 Add missing DELETE policy for products table
CREATE POLICY "Vendors can delete own products"
ON public.products FOR DELETE
USING (vendor_id = auth.uid());
