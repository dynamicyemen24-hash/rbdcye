// ============================================================
// Admin API — JWT Auth + Dashboard CRUD
// ⚠️ SERVER-SIDE ONLY — Never expose to client
// ============================================================
import { query } from './database.js';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rbdcye.org').split(',');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[Admin] FATAL: JWT_SECRET environment variable is required');
}
const JWT_EXPIRES = '8h';

// ─── Security Headers ───
function setCorsHeaders(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}

// ─── JWT Auth ───
function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function verifyTokenSync(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function verifyToken(req) {
  const token = getTokenFromHeader(req);
  if (!token) return null;

  const payload = verifyTokenSync(token);
  if (!payload || payload.type !== 'admin') return null;

  const userResult = await query(`SELECT id, email, name, role, status FROM users WHERE id = $1 AND deleted_at IS NULL`, [payload.id]);
  const user = userResult.rows[0];
  if (!user || user.status !== 'active') return null;

  return user;
}

// ─── Input sanitization ───
function sanitize(str, maxLen = 255) {
  return String(str || '').trim().slice(0, maxLen);
}

function sanitizeEmail(str) {
  return String(str || '').trim().toLowerCase().slice(0, 254);
}

// ─── Audit Log ───
async function auditLog(userId, action, entityType, entityId, newValue) {
  try {
    await query(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, after, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
      [userId, action, entityType, entityId, newValue ? JSON.stringify(newValue) : null]
    );
  } catch (e) {
    console.error('[Audit] Failed:', e.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// AUTH: Login (JWT + bcrypt)
// ═══════════════════════════════════════════════════════════════
async function login(req, res) {
  const { email, password } = req.body || {};
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedPassword = sanitize(password, 100);

  if (!sanitizedEmail || !sanitizedPassword) {
    return res.status(400).json({ success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
  }

  const result = await query(
    `SELECT id, email, name, role, password_hash, status FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [sanitizedEmail]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ success: false, error: 'بيانات الدخول غير صحيحة' });
  }

  const user = result.rows[0];

  if (user.status !== 'active') {
    return res.status(403).json({ success: false, error: 'الحساب غير مفعل' });
  }

  // bcrypt password comparison
  const valid = await compare(sanitizedPassword, user.password_hash || '');
  if (!valid) {
    return res.status(401).json({ success: false, error: 'بيانات الدخول غير صحيحة' });
  }

  // Update last login
  await query(`UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`, [user.id]);

  // Generate JWT
  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD: Stats Overview
// ═══════════════════════════════════════════════════════════════
async function getDashboardStats(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const [donations, projects, contacts, volunteers, beneficiaries] = await Promise.all([
    query(`SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_amount,
      COALESCE(SUM(amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as today_amount,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_count
    FROM donations`),
    query(`SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'completed') as completed
    FROM projects`),
    query(`SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'new') as unread
    FROM contact_messages`),
    query(`SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'active') as active
    FROM volunteers`),
    query(`SELECT COUNT(*) as total FROM beneficiaries`),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      donations: donations.rows[0],
      projects: projects.rows[0],
      contacts: contacts.rows[0],
      volunteers: volunteers.rows[0],
      beneficiaries: beneficiaries.rows[0],
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// DONATIONS: List / Update Status
// ═══════════════════════════════════════════════════════════════
async function listDonations(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { status, limit = 50, offset = 0 } = req.query || {};
  const validStatuses = ['pending', 'completed', 'rejected', 'cancelled'];
  const sanitizedStatus = status && validStatuses.includes(status) ? status : null;
  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const sanitizedOffset = Math.max(0, parseInt(offset) || 0);

  let sql = 'SELECT id, donor, email, amount, currency, project, method, type, status, anonymous, created_at FROM donations';
  const params = [];

  if (sanitizedStatus) {
    sql += ` WHERE status = $${params.length + 1}`;
    params.push(sanitizedStatus);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(sanitizedLimit, sanitizedOffset);

  const result = await query(sql, params);
  const countResult = await query(`SELECT COUNT(*) as total FROM donations${sanitizedStatus ? ' WHERE status = $1' : ''}`, sanitizedStatus ? [sanitizedStatus] : []);

  return res.status(200).json({
    success: true,
    data: result.rows,
    total: parseInt(countResult.rows[0]?.total || '0'),
  });
}

async function updateDonationStatus(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { id } = req.query || {};
  const { status, notes } = req.body || {};

  if (!id || !status) {
    return res.status(400).json({ success: false, error: 'id and status are required' });
  }

  const validStatuses = ['completed', 'rejected', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'الحالة غير صالحة' });
  }

  const result = await query(
    `UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, donor, email, amount, currency, project, status`,
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'التبرع غير موجود' });
  }

  const donation = result.rows[0];

  // 1. Update/Create approval record
  const existingApproval = await query(
    "SELECT * FROM donation_approvals WHERE donation_id = $1 AND status = 'pending' LIMIT 1",
    [id]
  );

  if (existingApproval.rows.length > 0) {
    await query(
      `UPDATE donation_approvals SET status = $1, reviewed_by = $2, review_notes = $3, metadata = metadata || $4
       WHERE id = $5`,
      [status === 'completed' ? 'approved' : 'rejected', user.name, notes,
       JSON.stringify({ reviewed_at: new Date().toISOString() }), existingApproval.rows[0].id]
    );
  } else {
    await query(
      `INSERT INTO donation_approvals (donation_id, action, status, reviewed_by, review_notes, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, status === 'completed' ? 'approved' : status, status === 'completed' ? 'approved' : 'rejected',
       user.name, notes, JSON.stringify({ reviewed_at: new Date().toISOString() })]
    );
  }

  // 2. Update movement status
  await query(
    `UPDATE movements SET status = $1, approved_by = $2, approved_at = NOW()
     WHERE reference_id = $3 AND reference_type = 'donation' AND status = 'pending'`,
    [status === 'completed' ? 'completed' : 'rejected', user.name, id]
  );

  // 3. Send notification to donor
  if (donation.email) {
    const title = status === 'completed' ? 'تم قبول تبرعك' : 'تم رفض تبرعك';
    const message = status === 'completed'
      ? `تم قبول تبرعك بمبلغ ${donation.amount} ${donation.currency || 'YER'} بنجاح. شكراً لك على كرمك.`
      : `نأسف، تم رفض تبرعك. للمتابعة يرجى التواصل معنا.`;

    await query(
      `INSERT INTO notifications (type, title, message, recipient_email, data, priority)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [`donation_${status}`, title, message, donation.email,
       JSON.stringify({ donation_id: id, amount: donation.amount, status }), 'high']
    );
  }

  // 4. Audit log
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value)
     VALUES ($1, 'update_status', 'donation', $2, $3)`,
    [user.id, id, { status, notes, reviewed_by: user.name }]
  );

  return res.status(200).json({ success: true, donation });
}

// ═══════════════════════════════════════════════════════════════
// CONTACT MESSAGES: List / Update Status
// ═══════════════════════════════════════════════════════════════
async function listContacts(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { status, limit = 50, offset = 0 } = req.query || {};
  const validStatuses = ['new', 'read', 'replied', 'archived'];
  const sanitizedStatus = status && validStatuses.includes(status) ? status : null;
  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const sanitizedOffset = Math.max(0, parseInt(offset) || 0);

  let sql = 'SELECT id, name, email, phone, subject, message, status, created_at FROM contact_messages';
  const params = [];

  if (sanitizedStatus) {
    sql += ` WHERE status = $${params.length + 1}`;
    params.push(sanitizedStatus);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(sanitizedLimit, sanitizedOffset);

  const result = await query(sql, params);
  const countResult = await query(`SELECT COUNT(*) as total FROM contact_messages${sanitizedStatus ? ' WHERE status = $1' : ''}`, sanitizedStatus ? [sanitizedStatus] : []);

  return res.status(200).json({
    success: true,
    data: result.rows,
    total: parseInt(countResult.rows[0]?.total || '0'),
  });
}

async function updateContactStatus(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { id } = req.query || {};
  const { status } = req.body || {};

  if (!id || !status) {
    return res.status(400).json({ success: false, error: 'id and status are required' });
  }

  const validStatuses = ['read', 'replied', 'archived'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'الحالة غير صالحة' });
  }

  const updates = status === 'replied' 
    ? `UPDATE contact_messages SET status = $1, replied_at = NOW(), replied_by = $2 WHERE id = $3 RETURNING id, status`
    : `UPDATE contact_messages SET status = $1 WHERE id = $3 RETURNING id, status`;

  const result = await query(updates, [status, user.name, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'الرسالة غير موجودة' });
  }

  return res.status(200).json({ success: true, message: result.rows[0] });
}

// ═══════════════════════════════════════════════════════════════
// VOLUNTEERS: List / Update Status
// ═══════════════════════════════════════════════════════════════
async function listVolunteers(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { status, limit = 50, offset = 0 } = req.query || {};
  const validStatuses = ['pending', 'approved', 'active', 'inactive', 'rejected'];
  const sanitizedStatus = status && validStatuses.includes(status) ? status : null;
  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const sanitizedOffset = Math.max(0, parseInt(offset) || 0);

  let sql = 'SELECT id, name, email, phone, skills, availability, status, applied_at FROM volunteers';
  const params = [];

  if (sanitizedStatus) {
    sql += ` WHERE status = $${params.length + 1}`;
    params.push(sanitizedStatus);
  }

  sql += ` ORDER BY applied_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(sanitizedLimit, sanitizedOffset);

  const result = await query(sql, params);
  const countResult = await query(`SELECT COUNT(*) as total FROM volunteers${sanitizedStatus ? ' WHERE status = $1' : ''}`, sanitizedStatus ? [sanitizedStatus] : []);

  return res.status(200).json({
    success: true,
    data: result.rows,
    total: parseInt(countResult.rows[0]?.total || '0'),
  });
}

async function updateVolunteerStatus(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { id } = req.query || {};
  const { status } = req.body || {};

  if (!id || !status) {
    return res.status(400).json({ success: false, error: 'id and status are required' });
  }

  const validStatuses = ['approved', 'active', 'inactive', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'الحالة غير صالحة' });
  }

  const updates = status === 'approved'
    ? `UPDATE volunteers SET status = $1, approved_at = NOW(), approved_by = $2 WHERE id = $3 RETURNING id, status`
    : `UPDATE volunteers SET status = $1 WHERE id = $3 RETURNING id, status`;

  const result = await query(updates, [status, user.name, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'المتطوع غير موجود' });
  }

  // Send notification to volunteer
  const volunteer = await query('SELECT email, name FROM volunteers WHERE id = $1', [id]);
  if (volunteer.rows.length > 0 && volunteer.rows[0].email) {
    const title = status === 'approved' ? 'تم قبول طلب التطوع' : status === 'rejected' ? 'تم رفض طلب التطوع' : 'تم تحديث حالة طلبك';
    const message = status === 'approved'
      ? `مرحباً ${volunteer.rows[0].name}، تم قبول طلب التطوع الخاص بك. يرجى التواصل معنا لبدء العمل.`
      : status === 'rejected'
        ? `مرحباً ${volunteer.rows[0].name}، نأسف تم رفض طلب التطوع.`
        : `مرحباً ${volunteer.rows[0].name}، تم تحديث حالة طلب التطوع إلى: ${status}`;

    await query(
      `INSERT INTO notifications (type, title, message, recipient_email, data, priority)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [`volunteer_${status}`, title, message, volunteer.rows[0].email,
       JSON.stringify({ volunteer_id: id, status }), 'normal']
    );
  }

  return res.status(200).json({ success: true, volunteer: result.rows[0] });
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS: CRUD
// ═══════════════════════════════════════════════════════════════
async function listProjects(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const result = await query(
    `SELECT id, title, description, category, status, budget, currency, spent, beneficiaries, start_date, end_date, location, created_at
     FROM projects ORDER BY created_at DESC`
  );

  return res.status(200).json({ success: true, data: result.rows });
}

async function createProject(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { title, description, category, budget, currency, location, start_date, end_date } = req.body || {};
  const sanitizedTitle = sanitize(title, 200);
  const sanitizedDescription = sanitize(description, 5000);
  const sanitizedCategory = sanitize(category, 100);
  const sanitizedLocation = sanitize(location, 200);
  const sanitizedCurrency = sanitize(currency, 10) || 'YER';
  const sanitizedBudget = parseFloat(budget) || 0;

  if (!sanitizedTitle) {
    return res.status(400).json({ success: false, error: 'عنوان المشروع مطلوب' });
  }

  const result = await query(
    `INSERT INTO projects (title, description, category, budget, currency, location, start_date, end_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'planning') RETURNING *`,
    [sanitizedTitle, sanitizedDescription, sanitizedCategory, sanitizedBudget, sanitizedCurrency, sanitizedLocation, start_date || null, end_date || null]
  );

  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value) VALUES ($1, 'create', 'project', $2, $3)`,
    [user.id, result.rows[0].id, result.rows[0]]
  );

  return res.status(201).json({ success: true, project: result.rows[0] });
}

async function updateProject(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { id } = req.query || {};
  const { title, description, category, status, budget, spent, beneficiaries, location } = req.body || {};

  if (!id) return res.status(400).json({ success: false, error: 'id is required' });

  const result = await query(
    `UPDATE projects SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      category = COALESCE($3, category),
      status = COALESCE($4, status),
      budget = COALESCE($5, budget),
      spent = COALESCE($6, spent),
      beneficiaries = COALESCE($7, beneficiaries),
      location = COALESCE($8, location),
      updated_at = NOW()
     WHERE id = $9 RETURNING *`,
    [sanitize(title, 200) || null, sanitize(description, 5000) || null, sanitize(category, 100) || null, sanitize(status, 20) || null, budget != null ? parseFloat(budget) : null, spent != null ? parseFloat(spent) : null, beneficiaries != null ? parseInt(beneficiaries) : null, sanitize(location, 200) || null, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
  }

  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value) VALUES ($1, 'update', 'project', $2, $3)`,
    [user.id, id, result.rows[0]]
  );

  return res.status(200).json({ success: true, project: result.rows[0] });
}

async function deleteProject(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ success: false, error: 'id is required' });

  const result = await query(`DELETE FROM projects WHERE id = $1 RETURNING id, title`, [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
  }

  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value) VALUES ($1, 'delete', 'project', $2, $3)`,
    [user.id, id, result.rows[0]]
  );

  return res.status(200).json({ success: true, deleted: result.rows[0] });
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS: List / Mark Read
// ═══════════════════════════════════════════════════════════════
async function listNotifications(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { limit = 20, unread_only } = req.query || {};
  const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

  let sql = 'SELECT id, type, title, message, priority, is_read as read, created_at FROM notifications';
  const params = [];
  if (unread_only === 'true') {
    sql += ' WHERE is_read = false';
  }
  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
  params.push(sanitizedLimit);

  const result = await query(sql, params);
  const countResult = await query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_read = false) as unread FROM notifications`);

  return res.status(200).json({
    success: true,
    data: result.rows,
    total: parseInt(countResult.rows[0]?.total || '0'),
    unread: parseInt(countResult.rows[0]?.unread || '0'),
  });
}

async function markNotificationsRead(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });

  const { ids } = req.body || {};

  if (ids && Array.isArray(ids) && ids.length > 0) {
    await query(`UPDATE notifications SET is_read = true WHERE id = ANY($1)`, [ids]);
  } else {
    await query(`UPDATE notifications SET is_read = true WHERE is_read = false`);
  }

  return res.status(200).json({ success: true });
}

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS: Authenticated read / update
// ═══════════════════════════════════════════════════════════════
async function ensureSettingsTable() {
  await query(`CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name VARCHAR(120) NOT NULL DEFAULT 'رحماء بينهم',
    tagline VARCHAR(200) NOT NULL DEFAULT 'أثرٌ يدوم - مستقبلٌ يُبنى',
    email VARCHAR(254) NOT NULL DEFAULT 'info@rbdcye.org',
    phone VARCHAR(30) NOT NULL DEFAULT '+967 780 777 007',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NULL
  )`);
}

async function getSettings(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });
  await ensureSettingsTable();
  await query(`INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`);
  const result = await query('SELECT site_name, tagline, email, phone FROM site_settings WHERE id = 1');
  const row = result.rows[0];
  return res.status(200).json({ success: true, data: { siteName: row.site_name, tagline: row.tagline, email: row.email, phone: row.phone } });
}

async function updateSettings(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'غير مصرح' });
  const body = req.body || {};
  const siteName = sanitize(body.siteName, 120);
  const tagline = sanitize(body.tagline, 200);
  const email = sanitizeEmail(body.email);
  const phone = sanitize(body.phone, 30);
  if (!siteName || !tagline || !phone || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'بيانات الإعدادات غير صالحة' });
  }
  await ensureSettingsTable();
  const result = await query(`INSERT INTO site_settings (id, site_name, tagline, email, phone, updated_at, updated_by)
    VALUES (1, $1, $2, $3, $4, NOW(), $5)
    ON CONFLICT (id) DO UPDATE SET site_name = EXCLUDED.site_name, tagline = EXCLUDED.tagline, email = EXCLUDED.email, phone = EXCLUDED.phone, updated_at = NOW(), updated_by = EXCLUDED.updated_by
    RETURNING site_name, tagline, email, phone`, [siteName, tagline, email, phone, user.id]);
  await auditLog(user.id, 'update', 'site_settings', '1', { siteName, tagline, email, phone });
  const row = result.rows[0];
  return res.status(200).json({ success: true, data: { siteName: row.site_name, tagline: row.tagline, email: row.email, phone: row.phone } });
}

// ═══════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════
export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') return res.status(204).end();

  const { action } = req.query || {};

  try {
    switch (action) {
      case 'login':
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        return await login(req, res);

      case 'dashboard':
        return await getDashboardStats(req, res);

      case 'donations':
        if (req.method === 'GET') return await listDonations(req, res);
        if (req.method === 'PUT') return await updateDonationStatus(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      case 'contacts':
        if (req.method === 'GET') return await listContacts(req, res);
        if (req.method === 'PUT') return await updateContactStatus(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      case 'volunteers':
        if (req.method === 'GET') return await listVolunteers(req, res);
        if (req.method === 'PUT') return await updateVolunteerStatus(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      case 'projects':
        if (req.method === 'GET') return await listProjects(req, res);
        if (req.method === 'POST') return await createProject(req, res);
        if (req.method === 'PUT') return await updateProject(req, res);
        if (req.method === 'DELETE') return await deleteProject(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      case 'notifications':
        if (req.method === 'GET') return await listNotifications(req, res);
        if (req.method === 'PUT') return await markNotificationsRead(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      case 'settings':
        if (req.method === 'GET') return await getSettings(req, res);
        if (req.method === 'PUT') return await updateSettings(req, res);
        return res.status(405).json({ error: 'Method not allowed' });

      default:
        return res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('[Admin API] Error:', error.message);
    return res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
}
