const { getSupabase } = require('./supabaseClient');

let pgPool = null;

function initDatabase() {
  if (pgPool) return pgPool;
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  pgPool = new Pool({ connectionString });
  return pgPool;
}

async function from(table) {
  const supabase = getSupabase();
  if (supabase) {
    return {
      select: (columns) => {
        const query = supabase.from(table).select(columns);
        return {
          then(resolve) {
            return query.then(({ data, error }) => resolve({ data: data || [], error }));
          },
          async maybeSingle() {
            const { data, error } = await supabase.from(table).select('*').limit(1).maybeSingle();
            return { data: data || null, error };
          },
          async single() {
            const { data, error } = await supabase.from(table).select('*').limit(1).single();
            return { data: data || null, error };
          },
          async eq(column, value) {
            const { data, error } = await supabase.from(table).select('*').eq(column, value);
            return { data: data || [], error };
          }
        };
      },
      insert: (payload) => {
        const query = supabase.from(table).insert(payload);
        return {
          then(resolve) {
            return query.then(({ data, error }) => resolve({ data: data || payload, error }));
          }
        };
      }
    };
  }

  const pool = initDatabase();
  if (!pool) {
    return {
      select: () => ({ then: (resolve) => resolve({ data: [], error: new Error('No database configured') }) }),
      insert: () => ({ then: (resolve) => resolve({ data: null, error: new Error('No database configured') }) })
    };
  }

  return {
    select: (columns) => ({
      then(resolve) {
        return pool.query(`SELECT ${columns} FROM ${table}`)
          .then(({ rows }) => resolve({ data: rows, error: null }))
          .catch((error) => resolve({ data: [], error }));
      },
      async maybeSingle() {
        try {
          const { rows } = await pool.query(`SELECT * FROM ${table} LIMIT 1`);
          return { data: rows[0] || null, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      async single() {
        try {
          const { rows } = await pool.query(`SELECT * FROM ${table} LIMIT 1`);
          return { data: rows[0] || null, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      async eq(column, value) {
        try {
          const { rows } = await pool.query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value]);
          return { data: rows, error: null };
        } catch (error) {
          return { data: [], error };
        }
      }
    }),
    insert: (payload) => ({
      then(resolve) {
        const columns = Object.keys(payload);
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        const values = columns.map((column) => payload[column]);
        return pool.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders}) RETURNING *`, values)
          .then(({ rows }) => resolve({ data: rows[0] || payload, error: null }))
          .catch((error) => resolve({ data: null, error }));
      }
    })
  };
}

module.exports = { initDatabase, from };
