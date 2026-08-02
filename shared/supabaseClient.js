const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:4002';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE || '';

let supabase = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseKey) {
    const client = serviceRole ? createClient(supabaseUrl, serviceRole) : createClient(supabaseUrl, supabaseKey);
    supabase = client;
  }
  return supabase;
}

module.exports = { getSupabase, supabaseUrl };
