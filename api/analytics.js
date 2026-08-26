// ============================================================
// Advanced Analytics Engine — AI-Powered Insights
// Generates actionable intelligence from donation/project data
// ============================================================
import { query } from '../database.js';
import { verifyToken } from '../auth.js';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://rbdcye.org').split(',');

function setCors(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'public, max-age=300');
}

// GET — Full analytics report
async function getAnalytics(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { period = '30d' } = req.query;
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
  const days = daysMap[period] || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [
    donationTrend,
    topDonors,
    projectPerformance,
    geographicDistribution,
    conversionFunnel,
    hourlyPattern,
    donorRetention,
    projectROI,
  ] = await Promise.all([
    // Daily donation trend
    query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as total
      FROM donations WHERE created_at >= $1
      GROUP BY DATE(created_at) ORDER BY date
    `, [since]),

    // Top donors (by total amount)
    query(`
      SELECT donor, email, COUNT(*) as donations, SUM(amount) as total, AVG(amount) as avg,
             MAX(created_at) as last_donation
      FROM donations WHERE created_at >= $1 AND status = 'completed'
      GROUP BY donor, email ORDER BY total DESC LIMIT 10
    `, [since]),

    // Project performance
    query(`
      SELECT project, COUNT(*) as donations, SUM(amount) as total,
             AVG(amount) as avg, COUNT(DISTINCT email) as unique_donors
      FROM donations WHERE project IS NOT NULL AND created_at >= $1
      GROUP BY project ORDER BY total DESC
    `, [since]),

    // Geographic distribution (from beneficiary locations)
    query(`
      SELECT governorate, COUNT(*) as count FROM beneficiaries
      WHERE governorate IS NOT NULL GROUP BY governorate ORDER BY count DESC LIMIT 10
    `),

    // Conversion funnel
    query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
      FROM donations WHERE created_at >= $1
    `, [since]),

    // Hourly donation pattern
    query(`
      SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
      FROM donations WHERE created_at >= $1
      GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY hour
    `, [since]),

    // Donor retention (repeat donors)
    query(`
      SELECT
        COUNT(DISTINCT email) as total_donors,
        COUNT(DISTINCT email) FILTER (WHERE email IN (
          SELECT email FROM donations WHERE created_at < $1 AND status = 'completed'
        )) as returning_donors
      FROM donations WHERE created_at >= $1 AND status = 'completed'
    `, [since]),

    // Project ROI (donations vs budget)
    query(`
      SELECT d.project, SUM(d.amount) as raised, p.budget,
             CASE WHEN p.budget > 0 THEN ROUND(SUM(d.amount) / p.budget * 100, 1) ELSE 0 END as funding_pct
      FROM donations d
      LEFT JOIN projects p ON d.project = p.title
      WHERE d.project IS NOT NULL AND d.status = 'completed' AND d.created_at >= $1
      GROUP BY d.project, p.budget ORDER BY raised DESC LIMIT 10
    `, [since]),
  ]);

  // Calculate insights
  const totalDonations = donationTrend.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
  const totalAmount = donationTrend.rows.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
  const avgDaily = totalDonations / days;
  const returningDonorRate = parseInt(donorRetention.rows[0]?.returning_donors || 0) /
    Math.max(1, parseInt(donorRetention.rows[0]?.total_donors || 1)) * 100;

  // Generate AI insights
  const insights = [];

  if (avgDaily > 5) {
    insights.push({ type: 'positive', text: `متوسط ${Math.round(avgDaily)} تبرع يومياً — أداء ممتاز` });
  } else if (avgDaily > 1) {
    insights.push({ type: 'neutral', text: `متوسط ${Math.round(avgDaily)} تبرع يومياً — يمكن تحسينه` });
  } else {
    insights.push({ type: 'negative', text: 'معدل التبرعات منخفض — يُنصح بحملة تسويقية' });
  }

  if (returningDonorRate > 30) {
    insights.push({ type: 'positive', text: `${Math.round(returningDonorRate)}% من المتبرعين عائدون — ولاء ممتاز` });
  } else if (returningDonorRate > 10) {
    insights.push({ type: 'neutral', text: `${Math.round(returningDonorRate)}% معدل العودة — يمكن تحسينه بحملات الاحتفاظ` });
  }

  const conversionRate = parseInt(conversionFunnel.rows[0]?.completed || 0) /
    Math.max(1, totalDonations) * 100;
  if (conversionRate < 50) {
    insights.push({ type: 'warning', text: `معدل التحويل ${Math.round(conversionRate)}% — يحتاج تحسين تجربة الدفع` });
  }

  if (projectPerformance.rows.length > 0) {
    const topProject = projectPerformance.rows[0];
    insights.push({ type: 'info', text: `أكثر المشاريع تمويلاً: ${topProject.project} (${parseFloat(topProject.total).toLocaleString()} ر.ي)` });
  }

  res.status(200).json({
    success: true,
    period,
    data: {
      summary: {
        totalDonations,
        totalAmount,
        avgDailyDonations: Math.round(avgDaily),
        avgDonationAmount: totalDonations > 0 ? Math.round(totalAmount / totalDonations) : 0,
        returningDonorRate: Math.round(returningDonorRate),
        conversionRate: Math.round(conversionRate),
      },
      trend: donationTrend.rows,
      topDonors: topDonors.rows,
      projectPerformance: projectPerformance.rows,
      geographic: geographicDistribution.rows,
      funnel: conversionFunnel.rows[0],
      hourlyPattern: hourlyPattern.rows,
      projectROI: projectROI.rows,
      insights,
    },
  });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') return getAnalytics(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
