const { Pool } = require('pg');
const { getSupabase } = require('../../../shared/supabaseClient');

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || 'postgresql://adolphe@localhost:5435/ium_morave';
const pool = connectionString ? new Pool({
  connectionString,
  ssl: process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('https') ? { rejectUnauthorized: false } : false
}) : null;

async function query(text, params) {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

function useSupabase() {
  return false;
}

function usePostgres() {
  return !!pool;
}

const adapter = {
  async from(table) {
    const db = usePostgres() ? null : getSupabase();
    if (db) {
      return db.from(table);
    }

    return {
      async select(columns = '*') {
        const result = await query(`SELECT ${columns} FROM ${table} WHERE deleted_at IS NULL`);
        return { data: result.rows, error: null };
      },
      async selectOne(id) {
        const result = await query(`SELECT * FROM ${table} WHERE id = $1 AND deleted_at IS NULL`, [id]);
        return { data: result.rows[0] || null, error: result.rowCount === 0 ? { message: 'Not found' } : null };
      },
      async selectBy(column, value) {
        const result = await query(`SELECT * FROM ${table} WHERE ${column} = $1 AND (deleted_at IS NULL OR deleted_at IS NOT NULL)`, [value]);
        return { data: result.rows, error: null };
      },
      async selectEq(column, value) {
        const col = column === 'id' ? 'id' : column;
        const result = await query(`SELECT * FROM ${table} WHERE ${col} = $1 AND deleted_at IS NULL`, [value]);
        return { data: result.rows, error: null };
      },
      async insert(payload) {
        const keys = Object.keys(payload);
        const values = Object.values(payload);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await query(
          `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
          values
        );
        return { data: result.rows[0], error: null };
      },
      async update(id, payload) {
        const keys = Object.keys(payload);
        const values = Object.values(payload);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const result = await query(
          `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
          [...values, id]
        );
        return { data: result.rows[0], error: null };
      },
      async delete(id) {
        const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id]);
        return { data: result.rows[0], error: null };
      }
    };
  }
};

async function initDatabase() {
  if (!pool) {
    console.log('[core-api] No DATABASE_URL set - using in-memory data');
    return false;
  }
  try {
    await query('SELECT 1');
    console.log('[core-api] Connected to PostgreSQL database');
    return true;
  } catch (err) {
    console.error('[core-api] PostgreSQL connection failed:', err.message);
    return false;
  }
}

module.exports = {
  query,
  from: adapter.from.bind(adapter),
  initDatabase,
  useSupabase,
  usePostgres,
  pool
};
