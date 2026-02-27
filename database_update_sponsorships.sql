-- Run this in your Supabase SQL Editor to support the Economy logic

-- 0. Ensure Profiles Table Exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  tier VARCHAR(50) DEFAULT 'Gold',
  vouches INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Upgrade Profiles to support Roles and Bios
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'engineer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Create the Transactions table for Faux Funding
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    sponsor_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transactions" ON transactions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = sponsor_id);


-- 3. Create the Agreements table for Producer/Founder contracts
CREATE TABLE IF NOT EXISTS agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    producer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    founder_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    terms TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'expired'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Anyone can see agreements
CREATE POLICY "Anyone can view agreements" ON agreements
    FOR SELECT USING (true);

-- Producers can create agreements
CREATE POLICY "Producers can create agreements" ON agreements
    FOR INSERT WITH CHECK (auth.uid() = producer_id);

-- Founders can update the status of the agreement
CREATE POLICY "Founders can update agreements" ON agreements
    FOR UPDATE USING (auth.uid() = founder_id);
