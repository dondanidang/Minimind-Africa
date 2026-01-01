-- Migration: Add UPDATE policy for orders table
-- This allows server-side API to update orders (e.g., payment_data, status)

-- Orders: Allow updating orders (server-side API handles validation)
CREATE POLICY "Allow order updates" ON orders
  FOR UPDATE USING (true)
  WITH CHECK (true);

