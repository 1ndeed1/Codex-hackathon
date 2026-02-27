-- MASTER SQL SETUP FOR CODEX-HACKATHON
-- Run this in your Supabase SQL Editor to ensure all tables and roles are correctly set up.

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    tier VARCHAR(50) DEFAULT 'Unranked',
    vouches INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'engineer',
    bio TEXT,
    location TEXT,
    experience_years INTEGER DEFAULT 0,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. Create Opportunities (Predictive Discovery) Table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    source VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    signal TEXT NOT NULL,
    inference TEXT,
    logic_gap TEXT,
    job_probability VARCHAR(100),
    hiring_urgency VARCHAR(50),
    tags TEXT[],
    difficulty VARCHAR(50),
    source_url TEXT,
    abstract TEXT,
    code_snippet TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON opportunities
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON opportunities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners can update own opportunities" ON opportunities
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own opportunities" ON opportunities
    FOR DELETE USING (auth.uid() = owner_id);


-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    stars INTEGER DEFAULT 0,
    contributors INTEGER DEFAULT 1,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects are viewable by everyone" ON projects
    FOR SELECT USING (is_public = true OR auth.uid() = owner_id);

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);


-- 4. Create Transactions (Sponsorships) Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    sponsor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transactions" ON transactions
    FOR SELECT USING (true);

CREATE POLICY "Sponsors can create transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = sponsor_id);


-- 5. Create Agreements (Producer Contracts) Table
CREATE TABLE IF NOT EXISTS agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    producer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    terms TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stakeholders can view agreements" ON agreements
    FOR SELECT USING (auth.uid() = producer_id OR auth.uid() = founder_id);

CREATE POLICY "Producers can create agreements" ON agreements
    FOR INSERT WITH CHECK (auth.uid() = producer_id);

CREATE POLICY "Founders can update agreement status" ON agreements
    FOR UPDATE USING (auth.uid() = founder_id);
    
-- 6. Create Solutions Table
CREATE TABLE IF NOT EXISTS solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  vouchers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solutions are viewable by everyone" ON solutions
  FOR SELECT USING (true);

CREATE POLICY "Users can submit solutions" ON solutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
