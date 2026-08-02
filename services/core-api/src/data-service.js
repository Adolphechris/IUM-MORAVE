const { getSupabase } = require('../../../shared/supabaseClient');

async function fetchData(table, query = {}) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  let queryBuilder = supabase.from(table).select();
  const { data, error } = await queryBuilder;
  if (error) {
    console.error(`Supabase error fetching from ${table}:`, error);
    return [];
  }
  return data || [];
}

async function fetchOne(table, id) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  const { data, error } = await supabase.from(table).select().eq('id', id).single();
  if (error) {
    console.error(`Supabase error fetching ${table}/${id}:`, error);
    return null;
  }
  return data;
}

async function insertData(table, payload) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) {
    console.error(`Supabase error inserting into ${table}:`, error);
    return { error: error.message };
  }
  return data;
}

async function updateData(table, id, payload) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) {
    console.error(`Supabase error updating ${table}/${id}:`, error);
    return { error: error.message };
  }
  return data;
}

async function fetchDataByColumn(table, column, value) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  const { data, error } = await supabase.from(table).select().eq(column, value);
  if (error) {
    console.error(`Supabase error fetching ${table} where ${column}=${value}:`, error);
    return [];
  }
  return data || [];
}

module.exports = {
  fetchData,
  fetchOne,
  insertData,
  updateData,
  fetchDataByColumn
};
