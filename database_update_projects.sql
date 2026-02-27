-- Run this in your Supabase SQL Editor to support Open Projects

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    stars INTEGER DEFAULT 0,
    contributors INTEGER DEFAULT 1,
    owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public projects
CREATE POLICY "Public profiles are viewable by everyone" ON projects
    FOR SELECT USING (is_public = true);

-- Allow authenticated users to create projects
CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

-- Allow users to read their own private projects
CREATE POLICY "Users can read own private projects" ON projects
    FOR SELECT USING (auth.uid() = owner_id AND is_public = false);
