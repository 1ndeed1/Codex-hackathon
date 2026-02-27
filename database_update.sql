-- Run this in the Supabase SQL Editor to add Profiles and Solutions

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  tier VARCHAR(50) DEFAULT 'Gold',
  vouches INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- In case you already ran it, add the email column:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to create profile on signup (Optional, but we'll do an explicit insert in the frontend for ease)

-- SOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'Architecture', 'Code', 'Idea'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted'
  vouchers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for solutions
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solutions are viewable by everyone." 
  ON solutions FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own solutions." 
  ON solutions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solutions (e.g. to accept them if they own the opp, or add vouchers)." 
  ON solutions FOR UPDATE
  USING (true); -- simplified for hackathon
