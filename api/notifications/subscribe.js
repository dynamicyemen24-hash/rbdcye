// Push Notification Subscription API
// Handles push subscription management with persistent storage

import { query } from '../database.js';

/**
 * In-memory fallback store (used only if DB unavailable)
 */
const subscriptions = new Map();

/**
 * Save a push subscription
 */
async function saveSubscription(req, res) {
  const { endpoint, keys, userAgent } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ error: 'Invalid subscription data' });
  }

  // Validate endpoint is https
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:') {
      return res.status(400).json({ error: 'Invalid endpoint protocol' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid endpoint URL' });
  }

  try {
    // Store in database for persistence across serverless restarts
    await query(
      `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent, created_at, status) 
       VALUES ($1, $2, $3, $4, NOW(), 'active') 
       ON CONFLICT (endpoint) DO UPDATE SET 
         p256dh = $2,
         auth = $3,
         user_agent = $4,
         status = 'active',
         updated_at = NOW()
       RETURNING id`,
      [endpoint, keys.p256dh, keys.auth, userAgent || null]
    );

    console.log(`New subscription saved: ${endpoint.substring(0, 50)}...`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to save subscription:', error);
    // Fallback to in-memory storage if DB is unavailable
    subscriptions.set(endpoint, { keys, createdAt: new Date().toISOString() });
    res.status(200).json({ success: true });
  }
}

/**
 * Remove a push subscription
 */
async function removeSubscription(req, res) {
  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint is required' });
  }

  try {
    await query(
      `UPDATE push_subscriptions SET status = 'removed', removed_at = NOW() WHERE endpoint = $1`,
      [endpoint]
    );
  } catch (error) {
    console.error('Failed to remove subscription from DB:', error);
  }

  subscriptions.delete(endpoint);
  res.status(200).json({ success: true });
}

/**
 * Handle unsupported methods
 */
function methodNotAllowed(res) {
  res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // CORS with restricted origins
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rohamaa.org,https://rbdcye.org').split(',');
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'POST') {
      return saveSubscription(req, res);
    } else if (req.method === 'DELETE') {
      return removeSubscription(req, res);
    } else {
      return methodNotAllowed(res);
    }
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
}

// Export subscriptions for use in sending notifications
export function getSubscriptions() {
  return subscriptions;
}