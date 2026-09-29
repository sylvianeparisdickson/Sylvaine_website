-- Migration script to add tax, shipping, and customs fields to existing tables
-- Run this in Supabase SQL Editor

-- Add new columns to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS billing_address TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS painting_id TEXT,
  ADD COLUMN IF NOT EXISTS painting_title TEXT,
  ADD COLUMN IF NOT EXISTS edition TEXT,
  ADD COLUMN IF NOT EXISTS size_label TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT,
  ADD COLUMN IF NOT EXISTS product_type TEXT CHECK (product_type IN ('original', 'reproduction', 'studio')),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_exempt BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS exemption_reason TEXT,
  ADD COLUMN IF NOT EXISTS exemption_reference TEXT,
  ADD COLUMN IF NOT EXISTS exemption_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending_payment', 'paid', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'refunded')),
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS date_shipped TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS delivery_status TEXT,
  ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS order_source TEXT NOT NULL DEFAULT 'website' CHECK (order_source IN ('website', 'studio')),
  ADD COLUMN IF NOT EXISTS hs_code TEXT,
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
  ADD COLUMN IF NOT EXISTS declared_value NUMERIC,
  ADD COLUMN IF NOT EXISTS customs_notes TEXT,
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Drop old status column if it exists and rename payment_status
-- First, migrate any existing status values to payment_status
UPDATE orders SET payment_status = CASE 
  WHEN status = 'pending' THEN 'pending_payment'
  WHEN status = 'paid' THEN 'paid'
  WHEN status = 'processing' THEN 'processing'
  WHEN status = 'shipped' THEN 'shipped'
  WHEN status = 'delivered' THEN 'delivered'
  ELSE status
END WHERE payment_status = 'pending';

-- Drop old status column
ALTER TABLE orders DROP COLUMN IF EXISTS status;

-- Drop old status index
DROP INDEX IF EXISTS idx_orders_status;

-- Add new indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_source ON orders(order_source);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(country);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at);

-- Add new columns to paintings table
ALTER TABLE paintings
  ADD COLUMN IF NOT EXISTS hs_code TEXT,
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS international_shipping_notes TEXT,
  ADD COLUMN IF NOT EXISTS taxable BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS tax_category TEXT;

-- Update RLS policy for orders to allow read access for admin
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow select on orders" ON orders;
DROP POLICY IF EXISTS "Allow insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow update on orders" ON orders;

-- Create new policies
CREATE POLICY "Allow select on orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow insert on orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on orders"
  ON orders FOR UPDATE
  USING (true);
