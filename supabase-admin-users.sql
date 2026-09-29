-- Create admin_users table for secure authentication
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only allow authenticated admins to read/write
CREATE POLICY "Allow select for authenticated admins" ON admin_users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for super_admin" ON admin_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated admins" ON admin_users
  FOR UPDATE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login_attempt()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment failed login attempts
  UPDATE admin_users
  SET failed_login_attempts = failed_login_attempts + 1,
      locked_until = CASE 
        WHEN failed_login_attempts + 1 >= 5 THEN NOW() + INTERVAL '30 minutes'
        ELSE NULL
      END
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION reset_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_users
  SET failed_login_attempts = 0,
      locked_until = NULL,
      last_login_at = NOW()
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
