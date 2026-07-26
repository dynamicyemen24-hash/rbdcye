// Contact API - Handle contact form submissions
export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'جميع الحقول الأساسية مطلوبة' 
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'البريد الإلكتروني غير صحيح' 
      });
    }

    // Log contact (in production, send email via Resend/SendGrid)
    console.log('📧 New Contact:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // Here you would integrate with email service
    // For now, simulate success
    // In production: await sendEmail({ to: 'info@example.com', ... })

    return res.status(200).json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح',
      data: { name, email, subject }
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.' 
    });
  }
}