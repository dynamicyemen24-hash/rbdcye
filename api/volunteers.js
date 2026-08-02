// Volunteers API - Handle volunteer registrations
import { query, pool } from './database.js';

const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];

export default async function handler(req, res) {
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