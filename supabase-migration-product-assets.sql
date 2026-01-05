-- Migration: Add assets column to products table
-- This column stores URLs of uploaded assets (images/videos) for use in product page content

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS assets TEXT[] DEFAULT ARRAY[]::TEXT[];

