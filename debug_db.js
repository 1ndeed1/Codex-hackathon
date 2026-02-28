
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const results = {};
    try {
        const { data: opportunities, error: oppError } = await supabase.from('opportunities').select('*');
        results.opportunities = { data: opportunities, error: oppError };

        const { data: profiles, error: profileError } = await supabase.from('profiles').select('*');
        results.profiles = { data: profiles, error: profileError };

        const { data: projects, error: projError } = await supabase.from('projects').select('*');
        results.projects = { data: projects, error: projError };

        fs.writeFileSync('db_debug_results.json', JSON.stringify(results, null, 2));
        console.log("Results written to db_debug_results.json");

    } catch (err) {
        console.error("Unexpected error:", err);
        fs.writeFileSync('db_debug_error.txt', err.stack);
    }
}

test();
