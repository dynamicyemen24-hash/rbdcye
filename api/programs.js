// ============================================================
// Programs API — CRUD + Enable/Disable
// Public: GET (active only) | Admin: POST/PUT/DELETE
// ============================================================
import { query } from './database.js';
import { verifyToken } from './auth.js';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rbdcye.org').split(',');

function setCors(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}

// GET — List programs (public sees only active; admin sees all)
async function getPrograms(req, res) {
  const { status, include_inactive } = req.query;
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'manager';

  let sql = 'SELECT * FROM programs';
  const params = [];

  if (isAdmin && include_inactive === 'true') {
    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }
  } else {
    sql += " WHERE status = 'active'";
  }

  sql += ' ORDER BY created_at DESC';

  const result = await query(sql, params);
  res.status(200).json({ success: true, data: result.rows });
}

// POST — Create program (admin only)
async function createProgram(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { title, title_ar, description, category, icon, color, budget, currency, start_date, end_date } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = await query(
    `INSERT INTO programs (title, title_ar, description, category, icon, color, budget, currency, start_date, end_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
     RETURNING *`,
    [title, title_ar || title, description, category, icon, color || '#0F4C3A', budget || 0, currency || 'YER', start_date, end_date]
  );

  // Audit log
  await query(
    `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_value)
     VALUES ($1, 'CREATE', 'program', $2, $3)`,
    [user.id, result.rows[0].id, JSON.stringify(result.rows[0])]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
}

// PUT — Update program / Enable / Disable (admin only)
async function updateProgram(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { id } = req.query;
  const { title, title_ar, description, category, icon, color, status, budget, currency, start_date, end_date } = req.body;

  if (!id) return res.status(400).json({ error: 'Program ID is required' });

  // Get current state for audit
  const current = await query('SELECT * FROM programs WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'Program not found' });

  const result = await query(
    `UPDATE programs SET
       title = COALESCE($1, title),
       title_ar = COALESCE($2, title_ar),
       description = COALESCE($3, description),
       category = COALESCE($4, category),
       icon = COALESCE($5, icon),
       color = COALESCE($6, color),
       status = COALESCE($7, status),
       budget = COALESCE($8, budget),
       currency = COALESCE($9, currency),
       start_date = COALESCE($10, start_date),
       end_date = COALESCE($11, end_date),
       updated_at = NOW()
     WHERE id = $12 RETURNING *`,
    [title, title_ar, description, category, icon, color, status, budget, currency, start_date, end_date, id]
  );

  // Audit log
  await query(
    `INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_value, new_value)
     VALUES ($1, 'UPDATE', 'program', $2, $3, $4)`,
    [user.id, id, JSON.stringify(current.rows[0]), JSON.stringify(result.rows[0])]
  );

  res.status(200).json({ success: true, data: result.rows[0] });
}

// DELETE — Soft-archive program (admin only)
async function deleteProgram(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Program ID is required' });

  const result = await query(
    `UPDATE programs SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: 'Program not found' });

  await query(
    `INSERT INTO audit_log (user_id, action, entity_type, entity_id)
     VALUES ($1, 'ARCHIVE', 'program', $2)`,
    [user.id, id]
  );

  res.status(200).json({ success: true, message: 'Program archived' });
}

// Main handler
export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    switch (req.method) {
      case 'GET': return getPrograms(req, res);
      case 'POST': return createProgram(req, res);
      case 'PUT': return updateProgram(req, res);
      case 'DELETE': return deleteProgram(req, res);
      default: return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Programs API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
