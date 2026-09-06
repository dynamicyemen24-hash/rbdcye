// ============================================================
// Database helper - Neon PostgreSQL (HTTP driver, Cloudflare-compatible)
// Functions/Workers runtime: no WebSocket, no persistent connection.
// SERVER-SIDE ONLY.
// ============================================================
import { neon } from '@neondatabase/serverless';

/**
 * Get a Neon pool. If DATABASE_URL is not configured, returns null so
 * callers can fall back gracefully (e.g. contact form still replies).
 */
function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // Keep one connection pooled across invocations (Workers reuse the process)
  if (!globalThis.__neonPool && url) {
    globalThis.__neonPool = neon(url);
  }
  return globalThis.__neonPool;
}

/**
 * Execute a parameterized query (Neon HTTP driver)
 * @returns {Promise<{rows: Array, rowCount: number, success: boolean}>}
 */
export async function query(text, params = []) {
  const pool = getPool();
  try {
    if (!pool) {
      return { rows: [], rowCount: 0, success: false, skipped: true };
    }
    const result = await pool(text, params);
    return { rows: result, rowCount: result.length, success: true };
  } catch (error) {
    console.error('[DB] Query error:', error.message);
    return { rows: [], rowCount: 0, success: false, error: error.message };
  }
}