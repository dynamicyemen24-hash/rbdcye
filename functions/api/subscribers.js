// ============================================================
// Subscribers API - Cloudflare Pages Functions
// Route: POST /api/subscribers
// Adds/updates a newsletter subscriber in Neon Postgres.
// ============================================================
import { query } from './database.js';

const ALLOWED_ORIGINS =
  process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://rbdcye.org'];

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestPost(context) {
  const { request } = context;
  const origin = request.headers.get('Origin');
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  try {
    const body = await request.json();
    const { email, name, phone, country } = body;

    const safeEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const safeName = String(name || '').trim().slice(0, 100);
    const safePhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const safeCountry = String(country || '').trim().slice(0, 100);

    if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return new Response(
        JSON.stringify({ error: 'البريد الإلكتروني مطلوب ويجب أن يكون صالحاً' }),
        { status: 400, headers }
      );
    }

    const result = await query(
      `INSERT INTO subscribers (email, name, phone, country, subscribed_at, status)
       VALUES ($1, $2, $3, $4, NOW(), 'active')
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE($2, subscribers.name),
         phone = COALESCE($3, subscribers.phone),
         country = COALESCE($4, subscribers.country),
         status = 'active',
         unsubscribed_at = NULL
       RETURNING id, email, name`,
      [safeEmail, safeName || null, safePhone || null, safeCountry || null]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم الاشتراك في نشرتنا البريدية بنجاح!',
        data: {
          id: result.rows[0]?.id,
          email: result.rows[0]?.email,
          name: result.rows[0]?.name,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Subscriber error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ في الاشتراك' }), {
      status: 500,
      headers,
    });
  }
}

export default { onRequestPost, onRequestOptions };