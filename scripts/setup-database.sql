-- ================================================
-- SUPABASE DATABASE SETUP FOR CPHUB
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard: https://wdbxvhjibcmwgpggiwgw.supabase.co
-- ================================================

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    total INTEGER DEFAULT 0,
    easy INTEGER DEFAULT 0,
    medium INTEGER DEFAULT 0,
    hard INTEGER DEFAULT 0,
    questions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- Create policy to allow all operations (for development)
CREATE POLICY "Enable all access for authenticated users" ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify table was created
SELECT 'Table created successfully!' as status;
SELECT * FROM users LIMIT 1;
