-- ============================================================================
-- zayneessence — Postgres Data Model & Row Level Security (RLS)
-- All monetary amounts are stored as integers in kobo (NGN * 100).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Skincare', 'Perfume', 'Oud', 'Roll-ons', 'Oils')),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  notes JSONB,
  ingredients JSONB,
  how_to_use TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. product_images
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. variants
CREATE TABLE IF NOT EXISTS variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_kobo BIGINT NOT NULL CHECK (price_kobo >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  theme_preference TEXT CHECK (theme_preference IN ('light', 'dark')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. addresses
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  city_or_lga TEXT NOT NULL,
  street_address TEXT NOT NULL,
  landmark TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, product_id)
);

-- 7. carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, variant_id)
);

-- 9. delivery_zones
CREATE TABLE IF NOT EXISTS delivery_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  states TEXT[] NOT NULL,
  eta_description TEXT NOT NULL,
  flat_rate_kobo BIGINT NOT NULL DEFAULT 0,
  free_over_kobo BIGINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_city_or_lga TEXT NOT NULL,
  delivery_street_address TEXT NOT NULL,
  delivery_landmark TEXT,
  delivery_zone_id TEXT NOT NULL REFERENCES delivery_zones(id),
  delivery_fee_kobo BIGINT NOT NULL DEFAULT 0,
  subtotal_kobo BIGINT NOT NULL,
  gift_wrap BOOLEAN NOT NULL DEFAULT false,
  gift_wrap_fee_kobo BIGINT NOT NULL DEFAULT 0,
  gift_note TEXT,
  total_kobo BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'packed', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT NOT NULL REFERENCES variants(id),
  product_name TEXT NOT NULL,
  size_label TEXT NOT NULL,
  price_kobo BIGINT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 12. payments
-- Payment status is ONLY ever changed to 'verified' by the server-side Paystack/Flutterwave webhook handler.
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('paystack', 'flutterwave')),
  reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Enable Row Level Security (RLS) on every table
-- ============================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public read policies for published catalogue & delivery zones
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Public can read product variants"
  ON variants FOR SELECT
  USING (true);

CREATE POLICY "Public can read delivery zones"
  ON delivery_zones FOR SELECT
  USING (true);

-- Customer self-access policies (evaluated via current_setting('app.current_customer_id', true))
CREATE POLICY "Customers can read and update their own profile"
  ON customers FOR ALL
  USING (id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers manage their own addresses"
  ON addresses FOR ALL
  USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers manage their own wishlists"
  ON wishlists FOR ALL
  USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers manage their own carts"
  ON carts FOR ALL
  USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers manage their own cart items"
  ON cart_items FOR ALL
  USING (
    cart_id IN (
      SELECT id FROM carts WHERE customer_id::text = current_setting('app.current_customer_id', true)
    )
  );

CREATE POLICY "Customers can view their own orders"
  ON orders FOR SELECT
  USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers can view their own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id::text = current_setting('app.current_customer_id', true)
    )
  );

-- Payments table is strictly server/webhook role only for mutations
CREATE POLICY "Customers can view payment status for their own orders"
  ON payments FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id::text = current_setting('app.current_customer_id', true)
    )
  );
