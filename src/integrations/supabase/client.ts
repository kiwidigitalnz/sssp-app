
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://brrkapvwhaupesbxboxb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycmthcHZ3aGF1cGVzYnhib3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NTg3MjcsImV4cCI6MjA1MzMzNDcyN30.TkDs-8Yk2loej7q9Y0w9DDfAh7ciXEuJuQcV0sJ6wTY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
