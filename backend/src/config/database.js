
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || "https://mgyefnqelwzcglbbigzv.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neWVmbnFlbHd6Y2dsYmJpZ3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjY1NDAsImV4cCI6MjA2Mjg0MjU0MH0.kJglaITMULB3amV26q_BhSVJzDxaNZA0DBaxpMjloW0";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
