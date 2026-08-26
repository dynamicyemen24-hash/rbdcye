// ============================================================
// Real-Time Dashboard API — Live Metrics + WebSocket Events
// Returns aggregated data across ALL systems in real-time
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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
}

// GET — Real-time dashboard metrics
async function getDashboard(req, res) {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Execute all queries in parallel for maximum performance
  const [
    totalDonations,
    todayDonations,
    weekDonations,
    monthDonations,
    pendingDonations,
    completedDonations,
    totalProjects,
    activeProjects,
    totalVolunteers,
    pendingVolunteers,
    totalBeneficiaries,
    unreadMessages,
    unreadNotifications,
    recentActivity,
    donationByProject,
    donationByMethod,
    donationTrend,
    agreementStats,
    programStats,
  ] = await Promise.all([
    // Donation totals
    query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total, COALESCE(AVG(amount), 0) as avg FROM donations`),
    query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= $1`, [todayStart]),
    query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= $1`, [weekAgo]),
    query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE created_at >= $1`, [monthAgo]),
    query(`SELECT COUNT(*) as count FROM donations WHERE status = 'pending'`),
    query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE status = 'completed'`),

    // Projects
    query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active') as active FROM projects`),
    query(`SELECT COUNT(*) as count FROM projects WHERE status = 'active'`),

    // Volunteers
    query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'pending') as pending FROM volunteers`),

    // Beneficiaries
    query(`SELECT COUNT(*) as count FROM beneficiaries WHERE status = 'active'`),

    // Messages & Notifications
    query(`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'`),
    query(`SELECT COUNT(*) as count FROM notifications WHERE read = false`),

    // Recent activity (last 10 items across all entities)
    query(`
      SELECT 'donation' as type, id, donor as label, amount::text as value, status, created_at FROM donations
      UNION ALL
      SELECT 'volunteer' as type, id, name as label, status as value, status, applied_at as created_at FROM volunteers
      UNION ALL
      SELECT 'contact' as type, id, name as label, subject as value, status, created_at FROM contact_messages
      ORDER BY created_at DESC LIMIT 15
    `),

    // Donations by project
    query(`SELECT project, COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE project IS NOT NULL GROUP BY project ORDER BY total DESC LIMIT 10`),

    // Donations by method
    query(`SELECT method, COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations WHERE method IS NOT NULL GROUP BY method ORDER BY total DESC`),

    // Donation trend (last 7 days)
    query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM donations WHERE created_at >= $1
      GROUP BY DATE(created_at) ORDER BY date ASC
    `, [weekAgo]),

    // Agreement stats
    query(`SELECT status, COUNT(*) as count FROM agreements GROUP BY status`),

    // Program stats
    query(`SELECT status, COUNT(*) as count FROM programs GROUP BY status`),
  ]);

  res.status(200).json({
    success: true,
    timestamp: now.toISOString(),
    data: {
      overview: {
        totalDonations: parseInt(totalDonations.rows[0].count),
        totalDonationAmount: parseFloat(totalDonations.rows[0].total),
        avgDonationAmount: parseFloat(totalDonations.rows[0].avg),
        totalProjects: parseInt(totalProjects.rows[0].total),
        activeProjects: parseInt(activeProjects.rows[0].count),
        totalVolunteers: parseInt(totalVolunteers.rows[0].total),
        pendingVolunteers: parseInt(pendingVolunteers.rows[0].pending),
        totalBeneficiaries: parseInt(totalBeneficiaries.rows[0].count),
        unreadMessages: parseInt(unreadMessages.rows[0].count),
        unreadNotifications: parseInt(unreadNotifications.rows[0].count),
      },
      today: {
        donations: parseInt(todayDonations.rows[0].count),
        amount: parseFloat(todayDonations.rows[0].total),
      },
      thisWeek: {
        donations: parseInt(weekDonations.rows[0].count),
        amount: parseFloat(weekDonations.rows[0].total),
      },
      thisMonth: {
        donations: parseInt(monthDonations.rows[0].count),
        amount: parseFloat(monthDonations.rows[0].total),
      },
      pendingReview: {
        donations: parseInt(pendingDonations.rows[0].count),
        volunteers: parseInt(pendingVolunteers.rows[0].pending),
      },
      completed: {
        donations: parseInt(completedDonations.rows[0].count),
        amount: parseFloat(completedDonations.rows[0].total),
      },
      recentActivity: recentActivity.rows,
      analytics: {
        byProject: donationByProject.rows,
        byMethod: donationByMethod.rows,
        trend: donationTrend.rows,
      },
      agreements: agreementStats.rows,
      programs: programStats.rows,
    },
  });
}

// GET — Live stats for polling (lightweight)
async function getLiveStats(req, res) {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM donations WHERE status = 'pending') as pending_donations,
      (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed' AND created_at >= CURRENT_DATE) as today_completed,
      (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') as new_messages,
      (SELECT COUNT(*) FROM notifications WHERE read = false) as unread_notifications,
      (SELECT COUNT(*) FROM volunteers WHERE status = 'pending') as pending_volunteers
  `);

  res.status(200).json({ success: true, data: result.rows[0] });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { live } = req.query;
      if (live === 'true') return getLiveStats(req, res);
      return getDashboard(req, res);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
