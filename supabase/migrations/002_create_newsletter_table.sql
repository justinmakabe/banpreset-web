-- Migration: Create newsletter_subscribers table
-- Run this in Supabase SQL Editor or via apply_migration

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Add RLS policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY IF NOT EXISTS "Anyone can subscribe"
ON newsletter_subscribers
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Only admins can view/manage subscribers
CREATE POLICY IF NOT EXISTS "Only admins can view subscribers"
ON newsletter_subscribers
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscribers';
