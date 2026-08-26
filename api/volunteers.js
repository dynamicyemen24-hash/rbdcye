// Volunteers API - Handle volunteer registrations with rate limiting and CSRF protection
import { query } from './database.js';

// Rate limiting: track requests per IP
const volunteerRequestLogs = new Map();

function checkRateLimit(ip, maxRequests = 20, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const requests = volunteerRequestLogs.get(ip) || [];
  const recentRequests = requests.filter(ts => ts >= windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  recentRequests.push(now);
  volunteerRequestLogs.set(ip, recentRequests);
  return { allowed: true, remaining: maxRequests - recentRequests.length };
}

// CSRF token validation
function verifyCsrfToken(req) {
  const csrfToken = req.headers['x-csrf-token'];
  // Get token from cookie or header - in production, use secure cookie
  const sessionToken = req.cookies?.csrftoken || req.header('X-CSRF-Token') || '';
  return csrfToken === sessionToken;
}

// CORS and security origins
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];

export default async function handler(req, res) {
  const ip = req.socket.remoteAddress || 'unknown';
  const rateLimitResult = checkRateLimit(ip, 20, 10 * 60 * 1000);
  
  // Rate limiting check
  if (!rateLimitResult.allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  // CORS headers
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
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

    const { name, email, phone, skills, availability, message } = req.body;

    // Sanitize inputs
    const sanitizedName = String(name || '').trim().slice(0, 100);
    const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const sanitizedSkills = String(skills || '').trim().slice(0, 500);
    const sanitizedAvailability = String(availability || '').trim().slice(0, 200);
    const sanitizedMessage = String(message || '').trim().slice(0, 2000);

    if (!sanitizedName || !sanitizedEmail) {
      return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    }

    // Insert volunteer application
    const result = await query(
      `INSERT INTO volunteers (name, email, phone, skills, availability, message, status, applied_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) 
       RETURNING id, status, applied_at`,
      [sanitizedName, sanitizedEmail, sanitizedPhone || null, sanitizedSkills || null, sanitizedAvailability || null, sanitizedMessage || null]
    );

    // Return success without exposing all data
    return res.status(200).json({
      success: true,
      message: 'تم تقديم طلب التطوع بنجاح! سيتم التواصل معك قريباً.',
      data: {
        id: result.rows[0]?.id,
        status: result.rows[0]?.status,
        appliedAt: result.rows[0]?.applied_at,
      },
    });
  } catch (error) {
    console.error('Volunteer error:', error);
    return res.status(500).json({ error: 'حدث خطأ في تقديم طلب التطوع' });
  }
}