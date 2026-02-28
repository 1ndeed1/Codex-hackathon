
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
    const logs = [];

    async function runTest(label, query) {
        logs.push(`\n--- ${label} ---`);
        const { data, error } = await query;
        if (error) {
            logs.push(`Error: ${error.message}`);
            logs.push(`Details: ${error.details}`);
            logs.push(`Hint: ${error.hint}`);
        } else {
            logs.push(`Success! Data length: ${data.length}`);
        }
    }

    await runTest("Alias and FK", supabase.from('opportunities').select('*, author:profiles!owner_id ( username, email )').limit(1));
    await runTest("FK only", supabase.from('opportunities').select('*, profiles!owner_id ( username, email )').limit(1));
    await runTest("No FK", supabase.from('opportunities').select('*, profiles ( username, email )').limit(1));
    await runTest("Simple Select", supabase.from('opportunities').select('*').limit(1));
    await runTest("Simple Profiles", supabase.from('profiles').select('*').limit(1));

    fs.writeFileSync('query_debug.txt', logs.join('\n'));
    console.log("Logs written to query_debug.txt");
}

testFetch();
