-- ENHANCED PRIVACY AND PROJECT OWNER PROPOSALS
-- Run this in your Supabase SQL Editor

-- 1. Update Agreements Table to support Directed Proposals
ALTER TABLE agreements ADD COLUMN IF NOT EXISTS initiated_by UUID REFERENCES auth.users(id);
ALTER TABLE agreements ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'bid'; -- 'bid' (producer to owner), 'proposal' (owner to producer)

-- 2. Update RLS for Agreements to be PRIVATE
-- First, drop existing policies if they are too broad
DROP POLICY IF EXISTS "Stakeholders can view agreements" ON agreements;
DROP POLICY IF EXISTS "Anyone can view agreements" ON agreements;

CREATE POLICY "Parties involved can view agreements" ON agreements
    FOR SELECT USING (auth.uid() = producer_id OR auth.uid() = founder_id);

CREATE POLICY "Authorized users can insert agreements" ON agreements
    FOR INSERT WITH CHECK (auth.uid() = producer_id OR auth.uid() = founder_id);

CREATE POLICY "Parties involved can update agreement status" ON agreements
    FOR UPDATE USING (auth.uid() = founder_id OR auth.uid() = producer_id);

-- 3. Update RLS for Transactions (Funding) to be PRIVATE
-- User indicated "send money... these are not public visible instead visibl only for those hat own the project and it sproducer"
-- This implies sponsorships might also need restricted viewing if requested.
-- However, User specifically mentioned sponsors and send money.

DROP POLICY IF EXISTS "Anyone can view transactions" ON transactions;

CREATE POLICY "Owner and Sponsor can view transactions" ON transactions
    FOR SELECT USING (
        auth.uid() = sponsor_id OR 
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = transactions.project_id 
            AND projects.owner_id = auth.uid()
        )
    );
