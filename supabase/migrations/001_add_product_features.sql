-- Migration: Add sale_price and rating to products table
-- Run this in Supabase SQL Editor or via apply_migration

-- Add sale_price column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2);

-- Add rating column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);

-- Add review_count column (for future use)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_sale_price ON products(sale_price) WHERE sale_price IS NOT NULL;

COMMENT ON COLUMN products.sale_price IS 'Sale price - if set and less than price, product is on sale';
COMMENT ON COLUMN products.rating IS 'Average rating 0-5, manually set by admin for now';
COMMENT ON COLUMN products.review_count IS 'Number of reviews (for display purposes)';
