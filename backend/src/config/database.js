
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || "https://mgyefnqelwzcglbbigzv.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neWVmbnFlbHd6Y2dsYmJpZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjY1NDAsImV4cCI6MjA2Mjg0MjU0MH0.kJglaITMULB3amV26q_BhSVJzDxaNZA0DBaxpMjloW0";

console.log('=== SUPABASE CONFIG ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Backend doesn't need to persist sessions
    detectSessionInUrl: false
  }
});

// Test connection
supabase.from('profiles').select('count', { count: 'exact' })
  .then(({ data, error, count }) => {
    if (error) {
      console.log('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection test successful. Profiles count:', count);
    }
  })
  .catch(err => {
    console.log('Supabase connection test error:', err.message);
  });

module.exports = supabase;
