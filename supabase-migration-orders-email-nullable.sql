-- Migration: Make customer_email nullable in orders table
-- Since we no longer require email in checkout form, email should be optional

ALTER TABLE orders 
ALTER COLUMN customer_email DROP NOT NULL;

