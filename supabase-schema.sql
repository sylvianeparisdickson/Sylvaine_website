-- Run this SQL in your Supabase project's SQL Editor
-- This creates the database schema to replace PocketBase collections

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create series table
CREATE TABLE IF NOT EXISTS series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  numeral TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  order_num INTEGER NOT NULL DEFAULT 0,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paintings table
CREATE TABLE IF NOT EXISTS paintings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  series TEXT NOT NULL,
  medium TEXT NOT NULL,
  year TEXT NOT NULL,
  dimensions TEXT,
  framed_dimensions TEXT,
  hint TEXT,
  image TEXT,
  no_reproduction BOOLEAN DEFAULT FALSE,
  order_num INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  availability_label TEXT,
  limited_editions JSONB,
  
  -- Customs information for international shipping
  hs_code TEXT,
  country_of_origin TEXT DEFAULT 'US',
  international_shipping_notes TEXT,
  
  -- Tax configuration
  taxable BOOLEAN DEFAULT TRUE,
  tax_category TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  billing_address TEXT,
  shipping_address TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  
  -- Product information
  painting_id TEXT,
  painting_title TEXT,
  edition TEXT,
  size_label TEXT,
  dimensions TEXT,
  product_type TEXT CHECK (product_type IN ('original', 'reproduction', 'studio')),
  description TEXT, -- For studio payments
  
  -- Pricing
  price NUMERIC NOT NULL,
  tax_amount NUMERIC DEFAULT 0,
  tax_rate NUMERIC,
  shipping_cost NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- Tax exemption
  tax_exempt BOOLEAN DEFAULT FALSE,
  exemption_reason TEXT,
  exemption_reference TEXT,
  exemption_date TIMESTAMP WITH TIME ZONE,
  
  -- Payment
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal')),
  payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending_payment', 'paid', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_plan TEXT CHECK (payment_plan IN ('full', '3month')),
  
  -- Shipping
  shipping_method TEXT,
  tracking_number TEXT,
  date_shipped TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  
  -- Order source
  order_source TEXT NOT NULL DEFAULT 'website' CHECK (order_source IN ('website', 'studio')),
  
  -- International customs
  hs_code TEXT,
  country_of_origin TEXT,
  declared_value NUMERIC,
  customs_notes TEXT,
  
  -- Metadata
  stripe_session_id TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  size TEXT,
  timeline TEXT,
  how_did_you_find_us TEXT,
  reference_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);
CREATE INDEX IF NOT EXISTS idx_series_order ON series(order_num);
CREATE INDEX IF NOT EXISTS idx_paintings_series ON paintings(series);
CREATE INDEX IF NOT EXISTS idx_paintings_order ON paintings(order_num);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_source ON orders(order_source);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(country);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables that have updated_at
CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paintings_updated_at
  BEFORE UPDATE ON paintings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE paintings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for security)
CREATE POLICY "Allow public read access to series"
  ON series FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to series"
  ON series FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to series"
  ON series FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access to paintings"
  ON paintings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to paintings"
  ON paintings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to paintings"
  ON paintings FOR UPDATE
  USING (true);

CREATE POLICY "Allow public insert to newsletter_subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert to contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Orders should be more restricted - only allow inserts via API
CREATE POLICY "Allow insert to orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update to orders"
  ON orders FOR UPDATE
  USING (true);

-- Storage policies (adjust bucket names as needed)
CREATE POLICY "Allow public read access to paintings bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'paintings');

CREATE POLICY "Allow public upload to paintings bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'paintings');

CREATE POLICY "Allow public read access to series bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'series');

CREATE POLICY "Allow public upload to series bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'series');

CREATE POLICY "Allow public read access to submissions bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submissions');

CREATE POLICY "Allow public upload to submissions bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submissions');
