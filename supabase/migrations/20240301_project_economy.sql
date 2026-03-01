-- Create transactions table for project sponsorships
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agreements table for producer bids and founder proposals
CREATE TABLE IF NOT EXISTS agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    producer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    terms TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    type TEXT NOT NULL, -- bid, proposal
    initiated_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_agreements_project_id ON agreements(project_id);
CREATE INDEX IF NOT EXISTS idx_agreements_producer_id ON agreements(producer_id);
CREATE INDEX IF NOT EXISTS idx_agreements_founder_id ON agreements(founder_id);
