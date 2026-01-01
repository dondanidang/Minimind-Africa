-- Migration: Add promo_price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_price DECIMAL(10, 2);

-- Add a check constraint to ensure promo_price is less than price (optional but recommended)
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_promo_price_less_than_price;
ALTER TABLE products ADD CONSTRAINT check_promo_price_less_than_price 
  CHECK (promo_price IS NULL OR promo_price < price);

