
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log('Verifying GapStart tables...');
    const sql = `
    CREATE TABLE IF NOT EXISTS requirement_maps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
        finance TEXT,
        hr TEXT,
        operations TEXT,
        customer_handling TEXT,
        analytics TEXT,
        automation_opps TEXT,
        efficiency_gain INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS external_gaps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source VARCHAR(255) NOT NULL,
        industry VARCHAR(255) NOT NULL,
        inefficiency TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        submitter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'open';
    ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS pathway VARCHAR(50);
    ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS expanded_features JSONB;

    -- Seed data if empty
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM external_gaps LIMIT 1) THEN
            INSERT INTO external_gaps (source, industry, inefficiency, status) VALUES
            ('Industry Report', 'Logistics', 'Manual data entry for bill of lading causing 12% delay in shipment processing.', 'approved'),
            ('Tech Review', 'Healthcare', 'Fragmentation of patient data across multiple legacy EMR systems blocking real-time diagnosis.', 'approved');
        END IF;
    END $$;
    `;

    try {
        const { error } = await supabase.rpc('run_sql', { sql });
        if (error) {
            console.error('Migration Error:', error);
        } else {
            console.log('Successfully applied GapStart database schema.');
        }
    } catch (e) {
        console.error('Execution Exception:', e.message);
    }
}

run();
