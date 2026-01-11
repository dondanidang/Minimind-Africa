-- Migration: Allow authenticated users to manage product variants
-- Authenticated users can INSERT, UPDATE, and DELETE product variants

-- Product variants: Authenticated users can manage variants
DROP POLICY IF EXISTS "Authenticated users can manage product variants" ON product_variants;
CREATE POLICY "Authenticated users can manage product variants" ON product_variants
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

