const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:5434';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE || '';

let supabase = null;

function getSupabase() {
  if (!supabase && supabaseUrl && (supabaseKey || serviceRole)) {
    const client = serviceRole
      ? createClient(supabaseUrl, serviceRole)
      : createClient(supabaseUrl, supabaseKey);
    supabase = client;
  }
  return supabase;
}

module.exports = { getSupabase, supabaseUrl };
