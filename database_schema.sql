-- SQL Schema for Supabase Setup
-- Run this in the Supabase SQL Editor to create the necessary table

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'scanned', 'mined', 'direct'
    source VARCHAR(255) NOT NULL, -- e.g., 'Reddit - r/reactjs', 'App Store Review'
    channel VARCHAR(255) NOT NULL, -- e.g., 'Open Source UI Library', 'FinanSync Native App'
    title VARCHAR(255) NOT NULL,
    signal TEXT NOT NULL, -- The original raw text/complaint
    inference TEXT, -- AI/Heuristic analysis of the problem
    logic_gap TEXT, -- The core technical issue to solve
    job_probability VARCHAR(100), -- '85%', 'Portfolio Builder', 'Immediate Need'
    hiring_urgency VARCHAR(50), -- 'Medium', 'High', 'Critical'
    tags TEXT[], -- Array of strings e.g., ['React', 'Performance']
    difficulty VARCHAR(50), -- 'Medium', 'High', 'Extreme'
    source_url TEXT, -- Link back to the original Reddit post, App Store app, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) but allow anonymous reads for the demo
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON opportunities FOR SELECT 
USING (true);

-- Allow the scraper to insert records (in a real app, secure this with a service role key)
CREATE POLICY "Allow public insert access" 
ON opportunities FOR INSERT 
WITH CHECK (true);
