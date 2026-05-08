-- ============================================================
-- Cult Clothing — Fresh Database Schema
-- ============================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This creates ALL tables from scratch for the new Cult Clothing project.
-- ============================================================

-- ── Enable UUID extension ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Categories ──
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Subcategories ──
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- ── Products ──
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT DEFAULT 'Cult Clothing',
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  description TEXT,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  badge TEXT,                  -- 'NEW', 'TRENDING', 'BESTSELLER', 'EXCLUSIVE'
  fit TEXT,                    -- 'Oversized Fit', 'Relaxed Fit', 'Korean Fit', 'Baggy Fit', 'Slim Fit', 'Regular Fit'
  stock INTEGER,               -- inventory count (nullable = unlimited)
  collection TEXT,             -- 'Old Money', 'Korean Collection', 'Office Edit', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Product Images ──
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  color_tag TEXT,              -- maps image to a colour variant
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Performance Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_subcategory_active
  ON products(subcategory_id) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_badge
  ON products(badge) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_fit
  ON products(fit) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_collection
  ON products(collection) WHERE is_active = true AND collection IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_product_images_product_order
  ON product_images(product_id, display_order);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);

CREATE INDEX IF NOT EXISTS idx_product_images_color_tag
  ON product_images(color_tag) WHERE color_tag IS NOT NULL;

-- ============================================================
-- Seed Data: Categories & Subcategories
-- ============================================================

-- Single category: Clothing
INSERT INTO categories (name, slug) VALUES ('Clothing', 'clothing')
ON CONFLICT (slug) DO NOTHING;

-- Subcategories under Clothing
DO $$
DECLARE
  clothing_id UUID;
BEGIN
  SELECT id INTO clothing_id FROM categories WHERE slug = 'clothing';

  INSERT INTO subcategories (category_id, name, slug) VALUES
    (clothing_id, 'T-Shirts',              't-shirts'),
    (clothing_id, 'Shirts',                'shirts'),
    (clothing_id, 'Polos',                 'polos'),
    (clothing_id, 'Jeans',                 'jeans'),
    (clothing_id, 'Pants',                 'pants'),
    (clothing_id, 'Joggers',               'joggers'),
    (clothing_id, 'Shorts',                'shorts'),
    (clothing_id, 'Hoodies & Sweatshirts', 'hoodies-sweatshirts')
  ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key can read)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);

-- Service role has full access (admin panel uses service role key)
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access subcategories" ON subcategories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Done! Your Cult Clothing database is ready.
-- Next steps:
--   1. Create an admin user in Supabase Auth (Dashboard → Authentication → Users)
--   2. Start adding products via the Admin Panel
-- ============================================================
