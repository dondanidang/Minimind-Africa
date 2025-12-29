-- Migration: Update RLS policies to allow anonymous order creation
-- This allows both authenticated and anonymous users to create orders via the server-side API

-- Drop existing order policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

-- Orders: Allow viewing own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    (user_id IS NULL)
  );

-- Orders: Allow creating orders (server-side API handles validation)
CREATE POLICY "Allow order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items: Allow viewing items from own orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        (orders.user_id IS NOT NULL AND orders.user_id = auth.uid()) OR
        (orders.user_id IS NULL)
      )
    )
  );

-- Order items: Allow inserting items for orders
CREATE POLICY "Allow order items creation" ON order_items
  FOR INSERT WITH CHECK (true);

