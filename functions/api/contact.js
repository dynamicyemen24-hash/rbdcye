// ============================================================
// Contact API - Cloudflare Pages Functions
// Route: POST /api/contact
// Saves message to Neon Postgres (if configured) and sends an
// email via Resend (if configured). Fails safe otherwise.
// Uses context.env (Workers bindings) - NOT process.env.
// ============================================================
import { createQuery } from './database.js';

function allowedOrigins(env) {
  return (
    env?.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173',
      'https://rbdcye.org',
      'https://www.rbdcye.org',
      'https://rbdcye.pages.dev',
    ]
  );
}

function corsHeaders(req, env) {
  const origin = req.headers.get('Origin');
  const list = allowedOrigins(env);
  const allowOrigin = origin && list.includes(origin) ? origin : list[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

function escapeHtmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
  const { request, env } = context;
  const headers = corsHeaders(request, env);

  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    const safeName = String(name || '').trim().slice(0, 100);
    const safeEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const safePhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const safeSubject = String(subject || '').trim().slice(0, 200);
    const safeMessage = String(message || '').trim().slice(0, 5000);

    // Block XSS patterns
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript\s*:/gi,
      /data:\s*text\/html/gi,
    ];
    const isSafe = (str) => !dangerousPatterns.some((p) => p.test(str));

    if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'جميع الحقول الأساسية مطلوبة' }),
        { status: 400, headers }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'البريد الإلكتروني غير صحيح' }),
        { status: 400, headers }
      );
    }
    if (!isSafe(safeName) || !isSafe(safeSubject) || !isSafe(safeMessage)) {
      return new Response(
        JSON.stringify({ success: false, error: 'يحتوي الإدخال على محتوى غير آمن' }),
        { status: 400, headers }
      );
    }

    // Persist to Neon if DATABASE_URL is configured
    const query = createQuery(env);
    await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'new', NOW())`,
      [safeName, safeEmail, safePhone || null, safeSubject, safeMessage]
    );

    // Email via Resend if configured
    if (env?.EMAIL_API_KEY && env?.EMAIL_FROM) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.EMAIL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: env.EMAIL_FROM,
            to: env.CONTACT_RECIPIENT_EMAIL || 'info@rbdcye.org',
            reply_to: safeEmail,
            subject: `[موقع رحماء بينهم] ${safeSubject}`,
            html: `<div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin:0 auto; padding:20px; background:#fafaf7; border-radius:8px;">
              <h2 style="color:#0F4C3A; margin-bottom:20px;">&#x1F4EC; رسالة جديدة من موقع رحماء بينهم</h2>
              <p><strong>الاسم:</strong> ${escapeHtmlEntities(safeName)}</p>
              <p><strong>البريد:</strong> ${escapeHtmlEntities(safeEmail)}</p>
              ${safePhone ? `<p><strong>الهاتف:</strong> ${escapeHtmlEntities(safePhone)}</p>` : ''}
              <p><strong>الموضوع:</strong> ${escapeHtmlEntities(safeSubject)}</p>
              <p style="white-space:pre-wrap; line-height:1.8;"><strong>الرسالة:</strong><br/>${escapeHtmlEntities(safeMessage)}</p>
            </div>`,
          }),
        });
        if (!emailResponse.ok) {
          console.error('Email send failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم إرسال رسالتك بنجاح، سيتواصل معك فريقنا قريباً إن شاء الله',
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.' }),
      { status: 500, headers }
    );
  }
}

export default { onRequestPost, onRequestOptions };