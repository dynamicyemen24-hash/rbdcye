// ============================================================
// Email Notification Service — Automated Transactional Emails
// Supports: Resend, SendGrid, or SMTP fallback
// ============================================================

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@rbdcye.org';
const SITE_URL = process.env.VITE_APP_URL || 'https://rbdcye.org';

// ─── Email Templates (Arabic) ──────────────────────────────
const templates = {
  donation_received: (data) => ({
    subject: `تأكيد استلام تبرعك - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0F4C3A; font-size: 24px;">رحماء بينهم</h1>
          <p style="color: #666; font-size: 14px;">مؤسسة إنسانية تنموية مرخصة</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F4C3A; margin-bottom: 20px;">شكراً لك على كرمك</h2>
          <p style="color: #374151; line-height: 1.8;">مرحباً ${data.donorName}،</p>
          <p style="color: #374151; line-height: 1.8;">تم استلام تبرعك بنجاح وهو قيد المراجعة.</p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;">المبلغ:</td><td style="padding: 8px 0; font-weight: bold; color: #0F4C3A;">${data.amount} ${data.currency || 'YER'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">المشروع:</td><td style="padding: 8px 0; font-weight: bold;">${data.project || 'عام'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">رقم التبرع:</td><td style="padding: 8px 0; font-weight: bold;">${data.donationId}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">التاريخ:</td><td style="padding: 8px 0;">${new Date().toLocaleDateString('ar-YE')}</td></tr>
            </table>
          </div>
          <p style="color: #374151; line-height: 1.8;">سنقوم بمراجعة تبرعك وإبلاغك بالنتيجة قريباً إن شاء الله.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${SITE_URL}/donor-portal" style="background: #0F4C3A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">متابعة التبرع</a>
          </div>
        </div>
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">هذه رسالة تلقائية، لا ترد عليها</p>
      </div>
    `,
  }),

  donation_approved: (data) => ({
    subject: `تم قبول تبرعك - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0F4C3A; font-size: 24px;">رحماء بينهم</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 30px;">✓</div>
          </div>
          <h2 style="color: #0F4C3A; text-align: center;">تم قبول تبرعك بنجاح</h2>
          <p style="color: #374151; line-height: 1.8; text-align: center;">مرحباً ${data.donorName}،</p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">تمت الموافقة على تبرعك بمبلغ <strong>${data.amount} ${data.currency || 'YER'}</strong></p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">شكراً لك على ثقتكم وكرمكم. سيظهر تبرعكم في لوحة الإحصائيات قريباً.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${SITE_URL}/donor-portal" style="background: #0F4C3A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">لوحة المتبرع</a>
          </div>
        </div>
      </div>
    `,
  }),

  donation_rejected: (data) => ({
    subject: `متابعة تبرعك - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F4C3A; text-align: center;">متابعة تبرعك</h2>
          <p style="color: #374151; line-height: 1.8; text-align: center;">مرحباً ${data.donorName}،</p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">نأسف لإبلاغك بأن تبرعك لم يُعتمد في هذه المرة.</p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">${data.reason || 'يرجى التواصل معنا لمزيد من التفاصيل.'}</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${SITE_URL}/contact" style="background: #0F4C3A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none;">تواصل معنا</a>
          </div>
        </div>
      </div>
    `,
  }),

  volunteer_approved: (data) => ({
    subject: `تم قبول طلب التطوع - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F4C3A; text-align: center;">مرحباً بك في فريق رحماء</h2>
          <p style="color: #374151; line-height: 1.8; text-align: center;">مرحباً ${data.name}،</p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">تم قبول طلب التطوع الخاص بك. نرحب بانضمامك لفريقنا.</p>
          <p style="color: #374151; line-height: 1.8; text-align: center;">يرجى التواصل معنا لتحديد موعد لبدء العمل الميداني.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${SITE_URL}/volunteer" style="background: #0F4C3A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none;">بوابة المتطوعين</a>
          </div>
        </div>
      </div>
    `,
  }),

  agreement_proposed: (data) => ({
    subject: `اقتراح اتفاقية جديدة - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F4C3A; text-align: center;">اتفاقية جديدة</h2>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td style="padding: 5px 0; color: #666;">الطرف:</td><td style="font-weight: bold;">${data.donorName}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">النوع:</td><td style="font-weight: bold;">${data.type}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">المبلغ:</td><td style="font-weight: bold;">${data.amount || 'غير محدد'} ${data.currency || 'YER'}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">رقم الاتفاقية:</td><td style="font-weight: bold;">${data.agreementNumber}</td></tr>
            </table>
          </div>
          <p style="color: #374151; line-height: 1.8;">يرجى مراجعة الاقتراح والرد عليه من خلال لوحة التحكم.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${SITE_URL}/admin/agreements" style="background: #0F4C3A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none;">مراجعة الاتفاقية</a>
          </div>
        </div>
      </div>
    `,
  }),

  contact_reply: (data) => ({
    subject: `رد على رسالتك - مؤسسة رحماء بينهم`,
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafaf7; border-radius: 12px;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F4C3A;">رد على رسالتك</h2>
          <p style="color: #374151; line-height: 1.8;">مرحباً ${data.name}،</p>
          <p style="color: #374151; line-height: 1.8;">شكراً لتواصلك معنا. إليك ردنا على رسالتك:</p>
          <div style="background: #f9fafb; border-right: 3px solid #0F4C3A; padding: 15px; margin: 20px 0;">
            <p style="color: #374151; line-height: 1.8;">${data.reply}</p>
          </div>
          <p style="color: #374151; line-height: 1.8;">إذا كان لديك أي استفسار آخر، لا تتردد في التواصل معنا.</p>
        </div>
      </div>
    `,
  }),
};

// ─── Email Sender ──────────────────────────────────────────
async function sendEmail(to, templateName, data) {
  const template = templates[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);

  const { subject, html } = template(data);

  // Try provider-specific sending
  try {
    if (EMAIL_PROVIDER === 'resend' && EMAIL_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: EMAIL_FROM, to: [to], subject, html }),
      });
      if (response.ok) return { success: true, provider: 'resend' };
    }

    if (EMAIL_PROVIDER === 'sendgrid' && EMAIL_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: EMAIL_FROM },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (response.ok) return { success: true, provider: 'sendgrid' };
    }

    // Fallback: log email (development)
    console.log(`[Email] ${templateName} → ${to}: ${subject}`);
    return { success: true, provider: 'console' };
  } catch (error) {
    console.error(`[Email] Failed to send:`, error.message);
    return { success: false, error: error.message };
  }
}

// ─── API Handler ───────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, template, data } = req.body;
    if (!to || !template) return res.status(400).json({ error: 'to and template are required' });

    const result = await sendEmail(to, template, data);
    res.status(200).json(result);
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { sendEmail, templates };
