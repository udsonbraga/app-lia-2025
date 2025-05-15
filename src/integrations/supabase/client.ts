
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mgyefnqelwzcglbbigzv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neWVmbnFlbHd6Y2dsYmJpZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjY1NDAsImV4cCI6MjA2Mjg0MjU0MH0.kJglaITMULB3amV26q_BhSVJzDxaNZA0DBaxpMjloW0";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
