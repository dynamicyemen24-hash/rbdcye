// ============================================================
// Performance Monitoring API — Core Web Vitals + PWA Metrics
// Tracks LCP, FID, CLS, TTFB, and custom business metrics
// ============================================================
import { query } from '../database.js';

export default async function handler(req, res) {
  // CORS — allow all origins for metrics collection
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const metrics = req.body;
    if (!metrics || !metrics.type) return res.status(400).json({ error: 'Invalid metrics' });

    // Store metrics (non-blocking)
    const storeMetric = async (table, data) => {
      try {
        await query(
          `INSERT INTO site_settings (key, value, category, updated_at)
           VALUES ($1, $2, 'metrics', NOW())
           ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
          [`${metrics.type}_${Date.now()}`, JSON.stringify(data)]
        );
      } catch { /* non-critical */ }
    };

    switch (metrics.type) {
      case 'web-vitals':
        await storeMetric('web-vitals', {
          name: metrics.name,
          value: metrics.value,
          rating: metrics.rating,
          id: metrics.id,
          url: metrics.url,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
        });
        break;

      case 'pwa-metric':
        await storeMetric('pwa', {
          metric: metrics.metric,
          value: metrics.value,
          url: metrics.url,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'error':
        await storeMetric('error', {
          message: metrics.message,
          stack: metrics.stack,
          url: metrics.url,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
        });
        break;

      case 'interaction':
        await storeMetric('interaction', {
          target: metrics.target,
          type: metrics.type,
          url: metrics.url,
          timestamp: new Date().toISOString(),
        });
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    // Metrics collection should never fail the app
    res.status(200).json({ success: true });
  }
}
