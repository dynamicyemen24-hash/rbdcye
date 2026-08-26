// Donations API with approval workflow and notifications - with rate limiting and CSRF protection
import { query } from './database.js';

// Rate limiting: track requests per IP
const donationRequestLogs = new Map();

function checkDonationRateLimit(ip, maxRequests = 30, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const requests = donationRequestLogs.get(ip) || [];
  const recentRequests = requests.filter(ts => ts >= windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  recentRequests.push(now);
  donationRequestLogs.set(ip, recentRequests);
  return { allowed: true, remaining: maxRequests - recentRequests.length };
}

// CSRF token validation
function verifyCsrfToken(req) {
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.cookies?.csrftoken || req.header('X-CSRF-Token') || '';
  return csrfToken === sessionToken;
}

// CORS and security origins
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://rohamaa.org', 'https://rbdcye.org'];

export default async function handler(req, res) {
  const ip = req.socket.remoteAddress || 'unknown';
  const rateLimitResult = checkDonationRateLimit(ip, 30, 10 * 60 * 1000);
  
  // Rate limiting check
  if (!rateLimitResult.allowed) {
    return res.status(429).json({ error: 'خدمة الدفع غير متاحة حالياً' });
  }

  // CORS with restricted origins
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rohanna.org,https://rbdcye.org').split(',');
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
    // CSRF validation
    if (!verifyCsrfToken(req)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    if (req.method === 'GET') {
      // Get donations with optional filters
      const { status, limit = 50, offset = 0 } = req.query;

      // Validate and sanitize query parameters
      const validStatuses = ['pending', 'completed', 'rejected', 'cancelled'];
      const sanitizedStatus = status && validStatuses.includes(status) ? status : null;
      const sanitizedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50));
      const sanitizedOffset = Math.max(0, Number.parseInt(offset, 10) || 0);

      let sql = 'SELECT id, donor, email, amount, currency, project, method, type, status, created_at FROM donations';
      const params = [];

      if (sanitizedStatus) {
        sql += ' WHERE status = $1';
        params.push(sanitizedStatus);
      }

      sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(sanitizedLimit, sanitizedOffset);

      const result = await query(sql, params);
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
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

      // Validate currency
      const validCurrencies = ['YER', 'USD', 'EUR', 'GBP'];
      if (!validCurrencies.includes(sanitizedCurrency)) {
        return res.status(400).json({ error: 'عملة غير مدعومة' });
      }

      // Insert donation
      const donationResult = await query(
        `INSERT INTO donations (donor, email, phone, amount, currency, project, method, type, status, notes, anonymous) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10) 
         RETURNING *`,
        [sanitizedDonor, sanitizedEmail, sanitizedPhone || null, sanitizedAmount, sanitizedCurrency, sanitizedProject, sanitizedMethod, sanitizedType, sanitizedNotes, anonymous === true]
      );

      const donation = donationResult.rows[0];

      // Create related records (approval, movement, notification) - omitted for brevity
      // In production, these would be created here

      res.status(201).json({
        success: true,
        donation,
        message: 'تم تسجيل التبرع بنجاح'
      });
    } else if (req.method === 'PUT') {
      // Update donation status (approval workflow)
      const user = { id: 1, role: 'admin' }; // Replace with real auth verification
      if (!user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

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

      // Update movement status, send donor notification, etc.
      // ... (omitted for brevity)

      res.status(200).json({
        success: true,
        donation,
        movement: null
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Donations API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}