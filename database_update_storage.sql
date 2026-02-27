-- Run this in your Supabase SQL Editor to support file uploads

-- Add the 'file_url' column to the existing solutions table
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS file_url TEXT;

-- NOTE FOR STORAGE: 
-- You must manually go to Supabase Dashboard -> Storage -> create a new bucket named: solution_files
-- Make sure to check the box that says "Public bucket" when creating it!

-- Storage RLS Policies (Run these if the dashboard forces you to use SQL instead of the UI for Storage RLS)
-- CREATE POLICY "Give public access to solution_files" ON storage.objects FOR SELECT USING (bucket_id = 'solution_files');
-- CREATE POLICY "Allow authenticated uploads to solution_files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'solution_files' AND auth.role() = 'authenticated');
