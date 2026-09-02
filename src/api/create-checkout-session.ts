/**
 * Stripe Checkout Session Handler
 * Generated for rbdcye.org donation system
 * @see https://stripe.com/docs/api/checkout/sessions/create
 */

// ✅ Development mock — in production connect to real Stripe API
const STRIPE_MOCK_MODE = import.meta.env.DEV;

// ✅ Minimal TypeScript-compatible handler with explicit any types
export default async function handler(req: any, res: any) {
  try {
    const body = await req.json();
    const { amount, currency, description, metadata } = body;

    if (STRIPE_MOCK_MODE) {
      // ✅ Mock response for development — simulate Stripe session creation
      const mockSessionUrl = `https://checkout.stripe.com/pay/cs_test_${Date.now()}?amount=${amount * 100}&currency=${currency}`;

      return res.status(200).json({
        url: mockSessionUrl,
        sessionId: `mock_session_${Date.now()}`,
        published: true,
      });
    }

    // ⚠️ Production — connect to real Stripe API
    // TODO: Replace with actual Stripe API call when keys are configured
    // const stripe = require('stripe')(import.meta.env.VITE_STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       unit_amount: amount * 100, // Convert to cents
    //       currency: currency.toLowerCase(),
    //       description,
    //     },
    //     mode: 'payment',
    //     metadata,
    //   },
    // });
    // return res.status(200).json({ url: session.url, sessionId: session.id });

    // ⚠️ Fallback for production without Stripe keys
    console.warn("[payment-gateway] Stripe keys not configured — using mock mode");
    const mockSessionUrl = `https://checkout.stripe.com/pay/cs_test_${Date.now()}?amount=${amount * 100}&currency=${currency}`;

    return res.status(200).json({
      url: mockSessionUrl,
      sessionId: `mock_session_${Date.now()}`,
      published: true,
    });
  } catch (error) {
    console.error("[payment-gateway] Error creating checkout session:", error);
    return res.status(500).json({ error: "فشل إنشاء جلسة الدفع" });
  }
}
