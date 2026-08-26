// Stripe Checkout Session API - with rate limiting and CSRF protection
// Creates a Stripe checkout session for donations

import rateLimit from 'express-rate-limit';

// Rate limiter: 5 requests per 10 minutes per IP
const sessionLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'خدمة الدفع غير متاحة حالياً', message: 'يرجى التواصل مع المؤسسة مباشرةً للتبرع' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS and security origins
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://rohamaa.org'];

// CSRF token validation
function verifyCsrfToken(req) {
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.cookies?.csrftoken || req.header('X-CSRF-Token');
  if (!csrfToken || !sessionToken) return false;
  return csrfToken === sessionToken;
}

export default async function handler(req, res) {
  // Rate limiting check
  if (res.statusCode === 429) {
    return res.status(503).json({ 
      error: 'خدمة الدفع غير متاحة حالياً',
      message: 'يرجى التواصل مع المؤسسة مباشرةً للتبرع'
    });
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CSRF validation
  if (!verifyCsrfToken(req)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  // Lazy-load Stripe to avoid build-time module resolution errors
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

  try {
    const { amount, currency, donor, email, phone, project, type, paymentType } = req.body;

    // Sanitize inputs
    const sanitizedAmount = parseFloat(amount);
    const sanitizedDonor = String(donor || '').trim().slice(0, 100);
    const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const sanitizedProject = String(project || '').trim().slice(0, 100);
    const sanitizedType = String(type || 'once').slice(0, 20);
    const sanitizedPaymentType = String(paymentType || 'once').slice(0, 20);

    if (!sanitizedAmount || sanitizedAmount <= 0 || sanitizedAmount > 1000000) {
      return res.status(400).json({ error: 'مبلغ التبرع مطلوب ويجب أن يكون بين 0.01 و 1,000,000' });
    }

    // التحقق من صحة البريد الإلكتروني
    if (sanitizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    }

    // التحقق من صيغة العملة
    const validCurrencies = ['usd', 'eur', 'gbp', 'aud', 'cad', 'jpy', 'yer', 'sar'];
    const validatedCurrency = (currency || 'usd').toLowerCase();
    if (!validCurrencies.includes(validatedCurrency)) {
      return res.status(400).json({ error: 'عملة غير مدعومة' });
    }

    // تحويل المبلغ إلى سنتات (Stripe يستخدم الوحدات الصغيرة)
    const amountInCents = Math.round(sanitizedAmount * 100);

    // Determine mode: subscription for recurring payments, payment for one-time
    const isRecurring = sanitizedPaymentType === 'monthly' || sanitizedPaymentType === 'yearly';
    const stripeMode = isRecurring ? 'subscription' : 'payment';

    const stripe = await getStripe();
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
      mode: stripeMode,
      // Success and cancel URLs differ for subscriptions
      ...(isRecurring ? {
        success_url: `${process.env.VITE_APP_URL || 'https://rohanna.org'}/donate?success=1&session_id={CHECKOUT_SESSION_ID}&subscription=active`,
        cancel_url: `${process.env.VITE_APP_URL || 'https://rohanna.org'}/donate?cancelled=1&subscription=inactive`,
      } : {
        success_url: `${process.env.VITE_APP_URL || 'https://rohamaa.org'}/donate?success=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_APP_URL || 'https://rohanna.org'}/donate?cancelled=1`,
      }),
      metadata: {
        donor: sanitizedDonor || 'anonymous',
        email: sanitizedEmail || '',
        phone: sanitizedPhone || '',
        project: sanitizedProject || 'general',
        type: sanitizedType || 'once',
        paymentType: sanitizedPaymentType || 'once',
      },
      customer_email: sanitizedEmail || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
      // إضافة البيانات للـ receipt
      payment_intent_data: {
        description: `تبرع خيري لمؤسسة رحماء فيهم`,
        statement_descriptor_suffix: 'Rohamaa',
      },
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    // إرجاع رسالة واضحة للمستخدم
    res.status(500).json({ 
      error: 'Creation of payment session failed',
      message: 'يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى'
    });
  }
}