// Subscribers API - Handle newsletter subscriptions
import { query } from './database.js';

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
    const { email, name, phone, country } = req.body;

    // Sanitize inputs
    const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const sanitizedName = String(name || '').trim().slice(0, 100);
    const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const sanitizedCountry = String(country || '').trim().slice(0, 100);

    if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني مطلوب ويجب أن يكون صالحاً' });
    }

    // Insert subscriber with validation
    const result = await query(
      `INSERT INTO subscribers (email, name, phone, country, subscribed_at, status) 
       VALUES ($1, $2, $3, $4, NOW(), 'active') 
       ON CONFLICT (email) DO UPDATE SET 
         name = COALESCE($2, subscribers.name),
         phone = COALESCE($3, subscribers.phone),
         country = COALESCE($4, subscribers.country),
         status = 'active',
         unsubscribed_at = NULL
       RETURNING *`,
       [sanitizedEmail, sanitizedName || null, sanitizedPhone || null, sanitizedCountry || null]
    );

    // Return success without exposing sensitive data
    return res.status(200).json({
      success: true,
      message: 'تم الاشتراك في نشرتنا البريدية بنجاح!',
      data: {
        id: result.rows[0]?.id,
        email: result.rows[0]?.email,
        name: result.rows[0]?.name,
      },
    });
  } catch (error) {
    console.error('Subscriber error:', error);
    return res.status(500).json({ error: 'حدث خطأ في الاشتراك' });
  }
}