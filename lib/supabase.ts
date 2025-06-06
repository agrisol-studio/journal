import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 