-- Migration: Add payment_data JSONB column to orders table for Jeko payment tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_data JSONB;

-- The payment_data column will store:
-- {
--   "payment_link_url": "https://pay.jeko.africa/c/...",
--   "payment_link_id": "...",
--   "webhooks": [...]
-- }

