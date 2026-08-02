// Donations API with approval workflow and notifications
import { query } from './database.js';

/**
 * Get donations with optional filters
 */
async function getDonations(req, res) {
  const { status, limit = 50, offset = 0 } = req.query;

  let sql = 'SELECT * FROM donations';
  const params = [];

  if (status) {
    sql += ' WHERE status = $1';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));

  const result = await query(sql, params);
  res.status(200).json(result.rows);
}

/**
 * Create initial approval record for a donation
 */
async function createApprovalRecord(donationId, donor, amount, project) {
  await query(
    `INSERT INTO donation_approvals (donation_id, action, status, metadata) 
     VALUES ($1, 'submitted', 'pending', $2)`,
    [donationId, { donor, amount, project, submitted_at: new Date().toISOString() }]
  );
}

/**
 * Create movement record for financial tracking
 */
async function createMovementRecord(donation) {
  await query(
    `INSERT INTO movements (type, category, amount, currency, reference_id, reference_type, description, status, metadata) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)`,
    [
      'donation',
      donation.project || 'عام',
      donation.amount,
      donation.currency || 'YER',
      donation.id,
      'donation',
      `تبرع جديد من ${donation.donor} - ${donation.type || 'مرة واحدة'}`,
      { donor: donation.donor, email: donation.email, phone: donation.phone, method: donation.method, type: donation.type }
    ]
  );
}

/**
 * Create notification for admins
 */
async function createAdminNotification(donation) {
  await query(
    `INSERT INTO notifications (type, title, message, data, priority) 
     VALUES ($1, $2, $3, $4, 'high')`,
    [
      'donation_submitted',
      'تبرع جديد',
      `تم استلام تبرع جديد من ${donation.donor} بمبلغ ${donation.amount} ${donation.currency || 'ريال'}`,
      { donation_id: donation.id, amount: donation.amount, donor: donation.donor, project: donation.project }
    ]
  );
}

/**
 * Create new donation with all related records
 */
async function createDonation(req, res) {
  const { donor, email, phone, amount, currency, project, method, type, notes, anonymous } = req.body;

  // Sanitize inputs
  const sanitizedDonor = String(donor || '').trim().slice(0, 100);
  const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  const sanitizedAmount = Math.max(0.01, parseFloat(amount) || 0);
  const sanitizedCurrency = String(currency || 'YER').toUpperCase().slice(0, 10);
  const sanitizedProject = String(project || '').trim().slice(0, 100);
  const sanitizedMethod = String(method || '').trim().slice(0, 50);
  const sanitizedType = String(type || 'once').slice(0, 20);
  const sanitizedNotes = String(notes || '').trim().slice(0, 2000);

  if (!sanitizedDonor || !sanitizedEmail || !sanitizedAmount) {
    return res.status(400).json({ error: 'donor, email, and amount are required' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
  }

  // Insert donation
  const donationResult = await query(
    `INSERT INTO donations (donor, email, phone, amount, currency, project, method, type, status, notes, anonymous) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10) 
     RETURNING *`,
    [sanitizedDonor, sanitizedEmail, sanitizedPhone || null, sanitizedAmount, sanitizedCurrency, sanitizedProject, sanitizedMethod, sanitizedType, sanitizedNotes, anonymous === true]
  );

  const donation = donationResult.rows[0];

  // Create related records
  await createApprovalRecord(donation.id, donor, amount, project);
  await createMovementRecord(donation);
  await createAdminNotification(donation);

  res.status(201).json({
    success: true,
    donation,
    message: 'تم تسجيل التبرع بنجاح'
  });
}

/**
 * Update existing approval record
 */
async function updateExistingApproval(existingApprovalId, status, action, reviewedBy, reviewNotes) {
  const approvalStatus = status === 'completed' ? 'approved' : 'rejected';
  const approvalAction = action || (status === 'completed' ? 'approved' : status);

  await query(
    `UPDATE donation_approvals 
     SET status = $1, reviewed_by = $2, review_notes = $3, notification_sent = false, metadata = $4
     WHERE id = $5`,
    [
      approvalStatus,
      reviewedBy,
      reviewNotes,
      { action: approvalAction, reviewed_at: new Date().toISOString() },
      existingApprovalId
    ]
  );
}

/**
 * Create new approval record
 */
async function createApprovalRecordForUpdate(donationId, status, action, reviewedBy, reviewNotes) {
  const approvalAction = action || (status === 'completed' ? 'approved' : status);
  const approvalStatus = status === 'completed' ? 'approved' : 'rejected';

  await query(
    `INSERT INTO donation_approvals (donation_id, action, status, reviewed_by, review_notes, metadata) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [donationId, approvalAction, approvalStatus, reviewedBy, reviewNotes, { reviewed_at: new Date().toISOString() }]
  );
}

/**
 * Handle approval workflow for donation status update
 */
async function updateApprovalRecord(donationId, status, action, reviewedBy, reviewNotes) {
  const existingApproval = await query(
    'SELECT * FROM donation_approvals WHERE donation_id = $1 AND status = \'pending\' LIMIT 1',
    [donationId]
  );

  const hasPendingApproval = existingApproval.rows.length > 0;
  
  if (hasPendingApproval) {
    await updateExistingApproval(
      existingApproval.rows[0].id,
      status,
      action,
      reviewedBy,
      reviewNotes
    );
  } else {
    await createApprovalRecordForUpdate(donationId, status, action, reviewedBy, reviewNotes);
  }
}

/**
 * Create donor notification based on approval status
 */
async function createDonorNotification(donation, status, reviewedBy, movement) {
  const notificationType = status === 'completed' ? 'donation_approved' : 'donation_rejected';
  const notificationTitle = status === 'completed' ? 'تم قبول تبرعك' : 'تم رفض تبرعك';
  const notificationMessage = status === 'completed'
    ? `تم قبول تبرعك بمبلغ ${donation.amount} ${donation.currency} بنجاح. شكراً لك على كرمك.`
    : `نأسف، تم رفض تبرعك لمشروع ${donation.project || 'عام'}. للمتابعة يرجى التواصل معنا.`;

  await query(
    `INSERT INTO notifications (type, recipient_email, recipient_id, title, message, data, priority) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      notificationType,
      donation.email,
      null,
      notificationTitle,
      notificationMessage,
      {
        donation_id: donation.id,
        amount: donation.amount,
        project: donation.project,
        status,
        movement_id: movement.id
      },
      status === 'completed' ? 'high' : 'normal'
    ]
  );
}

/**
 * Update donation status (approval workflow)
 */
async function updateDonationStatus(req, res) {
  const { id } = req.query;
  const { status, reviewed_by, review_notes, action } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'id and status are required' });
  }

  // Update donation status
  const donationResult = await query(
    'UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );

  const donation = donationResult.rows[0];

  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  // Update or create approval record
  await updateApprovalRecord(id, status, action, reviewed_by, review_notes);

  // Update movement status
  const movementResult = await query(
    `UPDATE movements 
     SET status = $1, approved_by = $2, approved_at = NOW() 
     WHERE reference_id = $3 AND reference_type = 'donation' AND status = 'pending'
     RETURNING *`,
    [status === 'completed' ? 'completed' : 'rejected', reviewed_by, id]
  );

  if (movementResult.rows.length > 0) {
    const movement = movementResult.rows[0];
    await createDonorNotification(donation, status, reviewed_by, movement);
  }

  res.status(200).json({
    success: true,
    donation,
    movement: movementResult.rows[0] || null
  });
}

/**
 * Handle method not allowed response
 */
function methodNotAllowed(res) {
  res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Main handler function
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
      return getDonations(req, res);
    } else if (req.method === 'POST') {
      return createDonation(req, res);
    } else if (req.method === 'PUT') {
      return updateDonationStatus(req, res);
    } else {
      return methodNotAllowed(res);
    }
  } catch (error) {
    console.error('Donations API error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}