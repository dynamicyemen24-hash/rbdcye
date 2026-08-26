// ============================================================
// Database API - Neon PostgreSQL (Serverless-compatible)
// Works with: Vercel, Cloudflare Workers, Netlify Functions
// ⚠️ This is SERVER-SIDE ONLY — never expose to client
// ============================================================
import { neon } from '@neondatabase/serverless';

// Neon serverless driver — uses HTTP by default (no WebSocket needed)
const sql = neon(process.env.DATABASE_URL);

/**
 * Execute a parameterized query
 * @param {string} text - SQL query with $1, $2... placeholders
 * @param {Array} params - Query parameters
 * @returns {{ rows: Array, rowCount: number, success: boolean }}
 */
export async function query(text, params = []) {
  try {
    const result = await sql(text, params);
    return {
      rows: result,
      rowCount: result.length,
      success: true,
    };
  } catch (error) {
    console.error('[DB] Query error:', error.message);
    throw error;
  }
}

/**
 * Execute multiple queries sequentially (Neon serverless uses HTTP, no persistent connection)
 * Note: Neon serverless driver doesn't support BEGIN/COMMIT/ROLLBACK over HTTP.
 * For true transactions, use a persistent connection pool (pg.Pool) instead.
 * @param {Array<{ text: string, params?: Array }>} queries
 * @returns {Array<{ rows: Array, rowCount: number }>}
 */
export async function transaction(queries) {
  const results = [];
  for (const q of queries) {
    const result = await sql(q.text, q.params || []);
    results.push({ rows: result, rowCount: result.length });
  }
  return results;
}

/**
 * Health check — verify database connectivity
 */
export async function healthCheck() {
  try {
    const result = await sql`SELECT 1 as ok, NOW() as time`;
    return { healthy: true, time: result[0]?.time };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}

// Export sql for raw template-tag queries
export { sql };
