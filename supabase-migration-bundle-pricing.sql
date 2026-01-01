-- Migration: Add bundle_pricing column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS bundle_pricing JSONB;

-- Example structure for bundle_pricing:
-- [
--   {"quantity": 1, "price": 10000},
--   {"quantity": 2, "price": 18000},
--   {"quantity": 3, "price": 25000}
-- ]

