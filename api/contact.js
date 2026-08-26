// Contact API - Handle contact form submissions with email delivery
import { query } from './database.js';

const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://rohamaa.org', 'https://rbdcye.org'];

function escapeHtmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // CORS with restricted origins
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation with sanitization
    const sanitizedName = String(name || '').trim().slice(0, 100);
    const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const sanitizedSubject = String(subject || '').trim().slice(0, 200);
    const sanitizedMessage = String(message || '').trim().slice(0, 5000);

    // Block XSS - remove dangerous HTML
    const dangerousPatterns = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, /javascript\s*:/gi, /data:\s*text\/html/gi];
    const isSafe = (str) => !dangerousPatterns.some(p => p.test(str));

    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
      return res.status(400).json({ success: false, error: 'جميع الحقول الأساسية مطلوبة' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ success: false, error: 'البريد الإلكتروني غير صحيح' });
    }

    if (!isSafe(sanitizedName) || !isSafe(sanitizedSubject) || !isSafe(sanitizedMessage)) {
      return res.status(400).json({ success: false, error: 'يحتوي الإدخال على محتوى غير آمن' });
    }

    // Save contact to database if available
    try {
      await query(
        `INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, 'new', NOW())`,
        [sanitizedName, sanitizedEmail, sanitizedPhone || null, sanitizedSubject, sanitizedMessage]
      );
    } catch (dbError) {
      console.error('DB save failed, continuing without persistence:', dbError);
    }

    // Send email notification via Resend if configured
    if (process.env.EMAIL_API_KEY && process.env.EMAIL_FROM) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: process.env.CONTACT_RECIPIENT_EMAIL || 'info@rohamaa.org',
            reply_to: sanitizedEmail,
            subject: `[موقع رحماء بينهم] ${sanitizedSubject}`,
            html: `
              <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafaf7; border-radius: 8px;">
                <h2 style="color: #1A5C48; margin-bottom: 20px;">&#x1F4EC; رسالة جديدة من موقع رحماء بينهم</h2>
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                  <tr><td style="padding: 10px 15px; font-weight: bold; background: #f0fdf4; color: #1A5C48; width: 120px;">الاسم</td><td style="padding: 10px 15px;">${escapeHtmlEntities(sanitizedName)}</td></tr>
                  <tr><td style="padding: 10px 15px; font-weight: bold; background: #f0fdf4; color: #1A5C48;">البريد</td><td style="padding: 10px 15px;">${escapeHtmlEntities(sanitizedEmail)}</td></tr>
                  ${sanitizedPhone ? `<tr><td style="padding: 10px 15px; font-weight: bold; background: #f0fdf4; color: #1A5C48;">الهاتف</td><td style="padding: 10px 15px;" dir="ltr">${escapeHtmlEntities(sanitizedPhone)}</td></tr>` : ''}
                  <tr><td style="padding: 10px 15px; font-weight: bold; background: #f0fdf4; color: #1A5C48;">الموضوع</td><td style="padding: 10px 15px;">${escapeHtmlEntities(sanitizedSubject)}</td></tr>
                  <tr><td style="padding: 10px 15px; font-weight: bold; background: #f0fdf4; color: #1A5C48; vertical-align: top;">الرسالة</td><td style="padding: 10px 15px; white-space: pre-wrap; line-height: 1.8;">${escapeHtmlEntities(sanitizedMessage)}</td></tr>
                </table>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email send failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح، سيتواصل معك فريقنا قريباً إن شاء الله',
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.' 
    });
  }
}