// ============================================================
// Database helper - Neon PostgreSQL (HTTP driver, Cloudflare-compatible)
// Functions/Workers runtime: no WebSocket, no persistent connection.
// SERVER-SIDE ONLY.
// ============================================================
import { neon } from '@neondatabase/serverless';

/**
 * Create a query helper bound to a specific `env` object.
 * Uses `env.DATABASE_URL` (Cloudflare Pages Functions binding).
 * If DATABASE_URL is not configured, returns a no-op helper so
 * callers fail safe.
 */
export function createQuery(env) {
  const url = env?.DATABASE_URL;
  if (!url) {
    return async () => ({ rows: [], rowCount: 0, success: false, skipped: true });
  }
  const pool = neon(url); // HTTP driver - cache per isolate
  return async (text, params = []) => {
    try {
      const result = await pool(text, params);
      return { rows: result, rowCount: result.length, success: true };
    } catch (error) {
      console.error('[DB] Query error:', error?.message || error);
      return { rows: [], rowCount: 0, success: false, error: error?.message };
    }
  };
}