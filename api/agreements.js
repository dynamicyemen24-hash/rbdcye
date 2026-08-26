// ============================================================
// Agreements API — Donations requiring negotiations
// Handles large donations, partnerships, waqf, grants
// Full lifecycle: draft → proposed → negotiating → approved → active
// ============================================================
import { query } from './database.js';
import { verifyToken } from './auth.js';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rbdcye.org').split(',');

function setCors(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function generateAgreementNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AGR-${year}-${rand}`;
}

// GET — List agreements
async function getAgreements(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { status, type, limit = 50, offset = 0 } = req.query;
  let sql = 'SELECT * FROM agreements WHERE 1=1';
  const params = [];
  let paramCount = 0;

  if (status) {
    paramCount++;
    sql += ` AND status = $${paramCount}`;
    params.push(status);
  }
  if (type) {
    paramCount++;
    sql += ` AND type = $${paramCount}`;
    params.push(type);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
  params.push(Math.min(100, Number(limit)), Math.max(0, Number(offset)));

  const result = await query(sql, params);
  const countResult = await query('SELECT COUNT(*) as total FROM agreements');

  res.status(200).json({
    success: true,
    data: result.rows,
    pagination: { total: parseInt(countResult.rows[0].total), limit: Number(limit), offset: Number(offset) }
  });
}

// GET single agreement with messages
async function getAgreement(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Agreement ID is required' });

  const agreement = await query('SELECT * FROM agreements WHERE id = $1', [id]);
  if (agreement.rows.length === 0) return res.status(404).json({ error: 'Agreement not found' });

  const messages = await query(
    'SELECT * FROM agreement_messages WHERE agreement_id = $1 ORDER BY created_at ASC',
    [id]
  );

  res.status(200).json({
    success: true,
    data: { ...agreement.rows[0], messages: messages.rows }
  });
}

// POST — Create agreement (public can propose, admin can create directly)
async function createAgreement(req, res) {
  const { donor_name, donor_email, donor_phone, organization, type, total_amount, currency,
    payment_schedule, terms, conditions, start_date, end_date, project_id, program_id } = req.body;

  if (!donor_name || !type) {
    return res.status(400).json({ error: 'donor_name and type are required' });
  }

  const agreementNumber = generateAgreementNumber();
  const status = req.user ? 'draft' : 'proposed';

  const result = await query(
    `INSERT INTO agreements (agreement_number, donor_name, donor_email, donor_phone, organization,
       type, status, total_amount, currency, payment_schedule, terms, conditions,
       start_date, end_date, project_id, program_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING *`,
    [agreementNumber, donor_name, donor_email, donor_phone, organization,
     type, status, total_amount, currency || 'YER',
     JSON.stringify(payment_schedule || []), terms, conditions,
     start_date, end_date, project_id, program_id]
  );

  const agreement = result.rows[0];

  // Auto-create donation if agreement is for a specific type
  if (['cash_once', 'cash_monthly', 'zakat', 'sadaqa'].includes(type) && total_amount) {
    const donationResult = await query(
      `INSERT INTO donations (donor, email, phone, amount, currency, project, method, type, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, 'agreement', $7, 'pending', $8)
       RETURNING *`,
      [donor_name, donor_email, donor_phone, total_amount, currency || 'YER',
       project_id, type, `Linked to agreement ${agreementNumber}`]
    );

    // Link donation to agreement
    await query('UPDATE agreements SET metadata = metadata || $1 WHERE id = $2',
      [JSON.stringify({ linked_donation_id: donationResult.rows[0].id }), agreement.id]);
  }

  // Notify admin
  await query(
    `INSERT INTO notifications (type, title, message, data, priority)
     VALUES ('agreement_proposed', 'اتفاقية جديدة', $1, $2, 'high')`,
    [`اتفاقية ${type} من ${donor_name} بقيمة ${total_amount || 'غير محدد'} ${currency || 'YER'}`,
     JSON.stringify({ agreement_id: agreement.id, donor: donor_name, amount: total_amount })]
  );

  res.status(201).json({ success: true, data: agreement });
}

// PUT — Update agreement status (admin workflow)
async function updateAgreement(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { id } = req.query;
  const { status, terms, conditions, total_amount, assigned_to, notes } = req.body;

  if (!id) return res.status(400).json({ error: 'Agreement ID is required' });

  const current = await query('SELECT * FROM agreements WHERE id = $1', [id]);
  if (current.rows.length === 0) return res.status(404).json({ error: 'Agreement not found' });

  // Validate status transitions
  const validTransitions = {
    'draft': ['proposed', 'cancelled'],
    'proposed': ['under_review', 'rejected', 'cancelled'],
    'under_review': ['negotiating', 'pending_approval', 'rejected'],
    'negotiating': ['pending_approval', 'rejected', 'cancelled'],
    'pending_approval': ['approved', 'rejected'],
    'approved': ['active', 'cancelled'],
    'active': ['suspended', 'completed'],
    'suspended': ['active', 'cancelled'],
    'completed': [],
    'cancelled': [],
    'rejected': [],
  };

  if (status && !validTransitions[current.rows[0].status]?.includes(status)) {
    return res.status(400).json({
      error: `Cannot transition from '${current.rows[0].status}' to '${status}'`,
      validTransitions: validTransitions[current.rows[0].status]
    });
  }

  const result = await query(
    `UPDATE agreements SET
       status = COALESCE($1, status),
       terms = COALESCE($2, terms),
       conditions = COALESCE($3, conditions),
       total_amount = COALESCE($4, total_amount),
       assigned_to = COALESCE($5, assigned_to),
       approved_by = CASE WHEN $1 = 'approved' THEN $6 ELSE approved_by END,
       approved_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE approved_at END,
       updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [status, terms, conditions, total_amount, assigned_to, user.email, id]
  );

  // Audit
  await query(
    `INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_value, new_value)
     VALUES ($1, 'UPDATE', 'agreement', $2, $3, $4)`,
    [user.id, id, JSON.stringify(current.rows[0]), JSON.stringify(result.rows[0])]
  );

  // Notify donor if status changed
  if (status && current.rows[0].donor_email) {
    const statusMessages = {
      'approved': 'تمت الموافقة على اتفاقيةك',
      'rejected': 'تم رفض اتفاقيةك',
      'active': 'اتفاقيةك نشطة الآن',
      'completed': 'تم اكتمال اتفاقيةك',
    };
    if (statusMessages[status]) {
      await query(
        `INSERT INTO notifications (type, title, message, recipient_email, data, priority)
         VALUES ('agreement_update', $1, $2, $3, $4, 'high')`,
        [statusMessages[status], `اتفاقية ${current.rows[0].agreement_number}: ${status}`,
         current.rows[0].donor_email, JSON.stringify({ agreement_id: id, status })]
      );
    }
  }

  res.status(200).json({ success: true, data: result.rows[0] });
}

// POST — Add message to agreement (negotiation)
async function addMessage(req, res) {
  const { id } = req.query;
  const { message, sender_name, sender_email, sender_role, is_internal, attachments } = req.body;

  if (!id || !message) return res.status(400).json({ error: 'Agreement ID and message are required' });

  const agreement = await query('SELECT * FROM agreements WHERE id = $1', [id]);
  if (agreement.rows.length === 0) return res.status(404).json({ error: 'Agreement not found' });

  const result = await query(
    `INSERT INTO agreement_messages (agreement_id, sender_name, sender_email, sender_role, message, attachments, is_internal)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id, sender_name || 'Anonymous', sender_email, sender_role || 'donor',
     message, JSON.stringify(attachments || []), is_internal || false]
  );

  // Update agreement status to 'negotiating' if it was 'under_review'
  if (agreement.rows[0].status === 'under_review' || agreement.rows[0].status === 'proposed') {
    await query("UPDATE agreements SET status = 'negotiating', updated_at = NOW() WHERE id = $1", [id]);
  }

  res.status(201).json({ success: true, data: result.rows[0] });
}

// Main handler
export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) return getAgreement(req, res);
      return getAgreements(req, res);
    }
    if (req.method === 'POST') {
      const { id } = req.query;
      if (id) return addMessage(req, res);
      return createAgreement(req, res);
    }
    if (req.method === 'PUT') return updateAgreement(req, res);

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Agreements API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
