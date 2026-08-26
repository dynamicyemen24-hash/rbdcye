// ============================================================
// Stripe Webhook Handler — Payment Confirmation
// Receives payment events from Stripe and creates donation records
// ============================================================
import crypto from 'crypto';
import { query } from '../database.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

async function getStripe() {
  if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not configured');
  const { default: Stripe } = await import('stripe');
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Stripe webhook signature
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  try {
    const stripe = await getStripe();
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle specific event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;
      default:
        // Unhandled event type — still return 200
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Processing error:', error);
    // Return 200 to prevent Stripe retries for processing errors
    // (we don't want to retry if the DB write failed)
    res.status(200).json({ received: true, error: error.message });
  }
}

// ─── Event Handlers ──────────────────────────────────────────

async function handleCheckoutCompleted(session) {
  const metadata = session.metadata || {};
  const donor = metadata.donor || session.customer_details?.name || 'Anonymous';
  const email = metadata.email || session.customer_details?.email || '';
  const project = metadata.project || '';
  const type = metadata.type || 'once';
  const amount = (session.amount_total || 0) / 100; // Convert from cents
  const currency = (session.currency || 'usd').toUpperCase();

  // Check if donation already exists (idempotency)
  const existing = await query(
    'SELECT id FROM donations WHERE metadata->>\'stripe_session_id\' = $1',
    [session.id]
  );

  if (existing.rows.length > 0) {
    return; // Already processed
  }

  // Create donation record
  const donationResult = await query(
    `INSERT INTO donations (donor, email, amount, currency, project, method, type, status, notes, metadata)
     VALUES ($1, $2, $3, $4, $5, 'stripe', $6, 'completed', $7, $8)
     RETURNING *`,
    [donor, email, amount, currency, project, type,
     `Stripe payment: ${session.payment_intent || session.id}`,
     JSON.stringify({ stripe_session_id: session.id, stripe_payment_intent: session.payment_intent })]
  );

  const donation = donationResult.rows[0];

  // Create movement record
  await query(
    `INSERT INTO movements (type, category, amount, currency, reference_id, reference_type, description, status, metadata)
     VALUES ('donation', $1, $2, $3, $4, 'donation', $5, 'completed', $6)`,
    [project || 'عام', amount, currency, donation.id,
     `تبرع عبر Stripe من ${donor} - ${type}`,
     JSON.stringify({ stripe_session_id: session.id, payment_method: 'stripe' })]
  );

  // Create approval record (auto-approved for Stripe payments)
  await query(
    `INSERT INTO donation_approvals (donation_id, action, status, metadata)
     VALUES ($1, 'auto_approved', 'approved', $2)`,
    [donation.id, JSON.stringify({ source: 'stripe_webhook', auto: true })]
  );

  // Notify admin
  await query(
    `INSERT INTO notifications (type, title, message, data, priority)
     VALUES ('donation_completed', 'تبرع مكتمل عبر Stripe', $1, $2, 'high')`,
    [`تبرع جديد من ${donor} بمبلغ ${amount} ${currency} عبر Stripe`,
     JSON.stringify({ donation_id: donation.id, amount, currency, donor })]
  );

  console.log(`[Stripe] Donation created: ${donation.id} - ${amount} ${currency} from ${donor}`);
}

async function handlePaymentSucceeded(paymentIntent) {
  // Additional processing if needed
  console.log(`[Stripe] Payment succeeded: ${paymentIntent.id} - ${paymentIntent.amount / 100} ${paymentIntent.currency}`);
}

async function handlePaymentFailed(paymentIntent) {
  // Mark associated donation as failed
  await query(
    `UPDATE donations SET status = 'rejected', updated_at = NOW()
     WHERE metadata->>'stripe_payment_intent' = $1`,
    [paymentIntent.id]
  );
  console.log(`[Stripe] Payment failed: ${paymentIntent.id}`);
}

async function handleRefund(charge) {
  // Find the donation linked to this charge
  const donation = await query(
    `SELECT id FROM donations WHERE metadata->>'stripe_payment_intent' = $1`,
    [charge.payment_intent]
  );

  if (donation.rows.length > 0) {
    const donationId = donation.rows[0].id;

    // Update donation status
    await query(
      "UPDATE donations SET status = 'refunded', updated_at = NOW() WHERE id = $1",
      [donationId]
    );

    // Create reversal movement
    await query(
      `INSERT INTO movements (type, category, amount, currency, reference_id, reference_type, description, status, metadata)
       VALUES ('refund', 'استرداد', $1, $2, $3, 'donation', $4, 'completed', $5)`,
      [charge.amount_refunded / 100, charge.currency?.toUpperCase() || 'USD', donationId,
       `استرداد تبرع ${charge.amount_refunded / 100} ${charge.currency}`,
       JSON.stringify({ stripe_charge_id: charge.id, refund_reason: charge.refunds?.data?.[0]?.reason })]
    );

    console.log(`[Stripe] Refund processed for donation: ${donationId}`);
  }
}
