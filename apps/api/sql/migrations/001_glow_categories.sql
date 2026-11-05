-- 001 · Glow redesign: add the Bakhoor and Supplements product categories.
-- schema.sql uses CREATE TABLE IF NOT EXISTS, so existing databases need this
-- migration to widen the inline category CHECK constraint.
BEGIN;

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

ALTER TABLE products
  ADD CONSTRAINT products_category_check
  CHECK (category IN ('Skincare', 'Perfume', 'Oud', 'Roll-ons', 'Oils', 'Bakhoor', 'Supplements'));

COMMIT;
