-- Migration: Allow authenticated users to manage products and orders
-- Any authenticated user can manage products and orders (no admin check required)

-- Products: Authenticated users can manage products
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Orders: Authenticated users can view and update all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders" ON orders
  FOR SELECT USING (
    (user_id IS NOT NULL AND auth.uid() = user_id) OR
    (user_id IS NULL) OR
    (auth.uid() IS NOT NULL)
  );

DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update all orders" ON orders;
CREATE POLICY "Authenticated users can update all orders" ON orders
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Order items: Authenticated users can view all
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
CREATE POLICY "Authenticated users can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        (orders.user_id IS NOT NULL AND orders.user_id = auth.uid()) OR
        (orders.user_id IS NULL) OR
        (auth.uid() IS NOT NULL)
      )
    )
  );

