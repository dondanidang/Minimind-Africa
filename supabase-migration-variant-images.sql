-- Migration: Add images column to product_variants table
-- Allow variants to have their own images

ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add comment
COMMENT ON COLUMN product_variants.images IS 'Array of image URLs for this variant';

