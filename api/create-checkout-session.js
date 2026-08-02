// Stripe Checkout Session API - Serverless Function
// Creates a Stripe checkout session for donations

// Lazy-load Stripe to avoid build-time module resolution errors
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://rohamaa.org'];
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

async function getStripe() {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  const { default: Stripe } = await import('stripe');
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // التحقق من وجود Stripe
  let stripe;
  try {
    stripe = await getStripe();
  } catch {
    return res.status(503).json({ 
      error: 'خدمة الدفع غير متاحة حالياً',
      message: 'يرجى التواصل مع المؤسسة مباشرةً للتبرع'
    });
  }

  try {
    const { amount, currency, donor, email, phone, project, type } = req.body;

    // Sanitize inputs
    const sanitizedAmount = parseFloat(amount);
    const sanitizedDonor = String(donor || '').trim().slice(0, 100);
    const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const sanitizedProject = String(project || '').trim().slice(0, 100);
    const sanitizedType = String(type || 'once').slice(0, 20);

    if (!sanitizedAmount || sanitizedAmount <= 0 || sanitizedAmount > 1000000) {
      return res.status(400).json({ error: 'مبلغ التبرع مطلوب ويجب أن يكون بين 0.01 و 1,000,000' });
    }

    // التحقق من صحة البريد الإلكتروني
    if (sanitizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    }

    // التحقق من صيغة العملة
    const validCurrencies = ['usd', 'eur', 'gbp', 'aud', 'cad', 'jpy'];
    const validatedCurrency = (currency || 'usd').toLowerCase();
    if (!validCurrencies.includes(validatedCurrency)) {
      return res.status(400).json({ error: 'عملة غير مدعومة' });
    }

    // تحويل المبلغ إلى سنتات (Stripe يستخدم الوحدات الصغيرة)
    // ملاحظة: المبالغ تُرسل بالسنتات (100 سنت = 1 دولار)
    const amountInCents = Math.round(sanitizedAmount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: validatedCurrency,
            product_data: {
              name: `تبرع لمؤسسة رحماء بينهم${project ? ` - ${project}` : ''}`,
              description: `دعم ${project || 'المشاريع الخيرية'} | المتبرع: ${donor || 'كريم'}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'https://rohamaa.org'}/donate?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'https://rohamaa.org'}/donate?cancelled=1`,
      metadata: {
        donor: sanitizedDonor || 'anonymous',
        email: sanitizedEmail || '',
        phone: sanitizedPhone || '',
        project: sanitizedProject || 'general',
        type: sanitizedType || 'once',
      },
      customer_email: sanitizedEmail || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
      // إضافة البيانات للـ receipt
      payment_intent_data: {
        description: `تبرع خيري لمؤسسة رحماء بينهم`,
        statement_descriptor_suffix: 'Rohamaa',
      },
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    // إرجاع رسالة خطأ واضحة للمستخدم
    res.status(500).json({ 
      error: error.message || 'فشل إنشاء جلسة الدفع',
      message: 'يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى'
    });
  }
}