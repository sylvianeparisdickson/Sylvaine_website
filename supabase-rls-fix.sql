-- Fix RLS policies for admin_users table to allow authentication
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow select for authenticated admins" ON admin_users;
DROP POLICY IF EXISTS "Allow insert for super_admin" ON admin_users;
DROP POLICY IF EXISTS "Allow update for authenticated admins" ON admin_users;

-- Create new policies that allow anon key for authentication
CREATE POLICY "Allow select for authentication" ON admin_users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for super_admin" ON admin_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update for authentication" ON admin_users
  FOR UPDATE
  USING (true);
