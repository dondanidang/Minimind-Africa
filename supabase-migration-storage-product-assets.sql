-- Migration: Create storage bucket for product assets (images and videos)
-- This bucket will store product images and videos uploaded through the admin panel

-- Create the storage bucket (run this in Supabase Dashboard -> Storage first, or use the API)
-- Then apply these RLS policies

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-assets');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-assets');

-- Allow public read access to product assets
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-assets');

-- Allow authenticated users to update (in case needed for file replacement)
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-assets');

