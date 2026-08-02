// Notifications API - Enterprise Grade Implementation
import { query } from './database.js';

/**
 * Build SQL query with filters - Type-safe query builder
 * @param {Object} filters - Query filters
 * @param {string|undefined} filters.recipient_id - Filter by recipient ID
 * @param {string|undefined} filters.recipient_email - Filter by recipient email
 * @param {string|undefined} filters.status - Filter by status
 * @param {number|string} [filters.limit=50] - Limit results
 * @param {number|string} [filters.offset=0] - Offset for pagination
 * @returns {{ sql: string, params: unknown[] }} SQL query and parameters
 */
function buildNotificationQuery(filters) {
  const { recipient_id, recipient_email, status, limit = 50, offset = 0 } = filters;
  let sql = `SELECT * FROM notifications WHERE 1=1`;
  const params = [];
  let paramCount = 0;

  if (recipient_id) {
    paramCount++;
    sql += ` AND recipient_id = $${paramCount}`;
    params.push(recipient_id);
  }

  if (recipient_email) {
    paramCount++;
    sql += ` AND recipient_email = $${paramCount}`;
    params.push(recipient_email);
  }

  if (status) {
    paramCount++;
    sql += ` AND status = $${paramCount}`;
    params.push(status);
  }

  const numericLimit = Math.max(1, Math.min(100, Number.parseInt(limit, 10) || 50));
  const numericOffset = Math.max(0, Number.parseInt(offset, 10) || 0);
  
  sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  params.push(numericLimit, numericOffset);

  return { sql, params };
}

/**
 * Standardized API response format
 */
function apiResponse(data, meta = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
  };
}

/**
 * Error response helper with proper HTTP status codes
 */
function errorResponse(error, statusCode = 500) {
  return {
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };
}

/**
 * Get notifications with filters
 */
async function getNotifications(req, res) {
  try {
    const { recipient_id, recipient_email, status, limit = 50, offset = 0 } = req.query;
    const { sql, params } = buildNotificationQuery({ recipient_id, recipient_email, status, limit, offset });

    const result = await query(sql, params);
    
    res.status(200).json(
      apiResponse(result.rows, {
        total: result.rowCount,
        limit: Number.parseInt(limit, 10),
        offset: Number.parseInt(offset, 10),
      })
    );
  } catch (error) {
    res.status(400).json(errorResponse(error, 400));
  }
}

/**
 * Create a new notification
 */
async function createNotification(req, res) {
  try {
    const { type, recipient_email, recipient_id, title, message, data, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required',
        timestamp: new Date().toISOString(),
      });
    }

    const result = await query(
      `INSERT INTO notifications (type, recipient_email, recipient_id, title, message, data, priority) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        type || 'system',
        recipient_email || null,
        recipient_id || null,
        title,
        message,
        data || {},
        priority || 'normal'
      ]
    );

    res.status(201).json(apiResponse(result.rows[0], { created: true }));
  } catch (error) {
    res.status(500).json(errorResponse(error, 500));
  }
}

/**
 * Build update SQL query - Enterprise grade with audit trail support
 * @param {string} id - Notification ID
 * @param {string} status - New status
 * @param {string|undefined} read_at - Optional read timestamp
 * @returns {{ sql: string, params: unknown[] }} SQL query and parameters
 */
function buildUpdateQuery(id, status, read_at) {
  let sql = `UPDATE notifications SET status = $1`;
  const params = [status ?? 'read'];
  let paramCount = 1;

  if (status === 'read' && read_at) {
    paramCount++;
    sql += `, read_at = $${paramCount}`;
    params.push(read_at);
  } else if (status === 'read') {
    sql += `, read_at = NOW()`;
  }

  paramCount++;
  sql += ` WHERE id = $${paramCount}`;
  params.push(id);

  return { sql, params };
}

/**
 * Update notification status
 */
async function updateNotification(req, res) {
  try {
    const { id } = req.query;
    const { status, read_at } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'id is required',
        timestamp: new Date().toISOString(),
      });
    }

    const { sql, params } = buildUpdateQuery(id, status, read_at);
    const result = await query(sql, params);

    res.status(200).json(
      result.rows[0] 
        ? apiResponse(result.rows[0], { updated: true })
        : apiResponse({ success: true }, { updated: false, message: 'Notification not found' })
    );
  } catch (error) {
    res.status(500).json(errorResponse(error, 500));
  }
}

/**
 * Method not allowed response
 */
function methodNotAllowed(res) {
  res.status(405).json({
    success: false,
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    timestamp: new Date().toISOString(),
  });
}

/**
 * Main handler function - RESTful API endpoint
 */
export default async function handler(req, res) {
  // CORS with restricted origins
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rohamaa.org,https://rbdcye.org').split(',');
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      return getNotifications(req, res);
    } else if (req.method === 'POST') {
      return createNotification(req, res);
    } else if (req.method === 'PUT') {
      return updateNotification(req, res);
    } else {
      return methodNotAllowed(res);
    }
  } catch (error) {
    console.error('Notifications API error:', error);
    res.status(500).json(errorResponse(error, 500));
  }
}