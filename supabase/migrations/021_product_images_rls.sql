-- Enable RLS on product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Everyone can view product images
CREATE POLICY "Product images are viewable by everyone"
ON public.product_images FOR SELECT
USING (true);

-- Vendors can insert images for their own products
CREATE POLICY "Vendors can insert own product images"
ON public.product_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_id
    AND products.vendor_id = auth.uid()
  )
);

-- Vendors can update images for their own products
CREATE POLICY "Vendors can update own product images"
ON public.product_images FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_id
    AND products.vendor_id = auth.uid()
  )
);

-- Vendors can delete images for their own products
CREATE POLICY "Vendors can delete own product images"
ON public.product_images FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.products
    WHERE products.id = product_id
    AND products.vendor_id = auth.uid()
  )
);
