// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Accessing the environment variables we just set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
