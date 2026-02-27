/* src/services/supabase.js */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Don't crash if keys are missing (allows the UI to show a warning or fallback gracefully)
export const supabase = (supabaseUrl && supabaseUrl !== "YOUR_SUPABASE_URL" && supabaseAnonKey && supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY")
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
