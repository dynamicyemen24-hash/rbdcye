// ============================================================
// Database API - Direct PostgreSQL Access
// ⚠️ SECURITY: This file should NOT be exposed publicly!
// Consider removing HTTP handler or adding authentication
// ============================================================
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Direct query function for internal use only
export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount,
      success: true,
    };
  } finally {
    client.release();
  }
}

// Export pool for graceful shutdown
export { pool };

// HTTP handler - DISABLED for security reasons
// If needed, implement proper authentication and rate limiting
export default async function handler(req, res) {
  // SECURITY: Block external access
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.DATABASE_API_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({
      error: 'Unauthorized - This endpoint is disabled',
      message: 'Direct database access is not permitted',
    });
  }

  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rohamaa.org,https://rbdcye.org').split(',');
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { query: sql, params = [] } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // SECURITY: Only allow SELECT queries
    const trimmedSql = sql.trim().toUpperCase();
    if (!trimmedSql.startsWith('SELECT')) {
      return res.status(403).json({
        error: 'Only SELECT queries are allowed',
        message: 'Write operations are blocked for security',
      });
    }

    const result = await query(sql, params);
    res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      success: true,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: error.message || 'Unknown error',
      success: false,
    });
  }
}