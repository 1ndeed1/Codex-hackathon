-- Run this in your Supabase SQL Editor to support Problem Additions

ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users ON DELETE SET NULL;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS abstract TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS code_snippet TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Add RLS Policies so Users can Edit / Delete their own opportunities
-- (Ensure Row Level Security is enabled first)
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert
CREATE POLICY "Users can create opportunities" ON opportunities
    FOR INSERT WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Allow users to update their own opportunities
CREATE POLICY "Users can update own opportunities" ON opportunities
    FOR UPDATE USING (auth.uid() = owner_id);

-- Allow users to delete their own opportunities
CREATE POLICY "Users can delete own opportunities" ON opportunities
    FOR DELETE USING (auth.uid() = owner_id);
