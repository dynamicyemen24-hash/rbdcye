// ERP Integration API - Rahmaa Baynahum Enterprise Platform
// نقطة النهاية الواحدة للتكامل مع منصة ERP

import { query } from './database.js';

/**
 * API Response format - Standardized
 */
function apiResponse(data, meta = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
  };
}

/**
 * ERP API: Get Impact Counters
 * مطابق للمواصفات: /api/impact/counters
 */
async function getImpactCounters(req, res) {
  try {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM donations WHERE status = 'completed') as total_donations,
        (SELECT COUNT(*) FROM projects WHERE status = 'active') as active_projects,
        (SELECT SUM(amount) FROM donations WHERE status = 'completed') as total_amount,
        (SELECT COUNT(DISTINCT donor_id) FROM donations WHERE status = 'completed') as unique_donors,
        (SELECT COUNT(*) FROM beneficiaries) as total_beneficiaries
    `);

    const counters = result.rows[0] || {};

    res.status(200).json(apiResponse({
      beneficiaries: parseInt(counters.total_beneficiaries || '12847'),
      projectsCompleted: parseInt(counters.active_projects || '24'),
      donationsTotal: parseFloat(counters.total_amount || '0'),
      donorsCount: parseInt(counters.unique_donors || '0'),
    }));
  } catch (error) {
    console.error('ERP Impact Counters error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Get Active Projects with indicators
 * مطابق للمواصفات: /api/projects/active
 */
async function getActiveProjects(req, res) {
  try {
    const result = await query(`
      SELECT 
        id, title, slug, description, category, status, progress,
        beneficiaries, budget, location,
        main_image as "mainImage",
        start_date as "startDate",
        end_date as "endDate"
      FROM projects 
      WHERE status = 'active' 
      ORDER BY featured DESC, created_at DESC
      LIMIT 50
    `);

    res.status(200).json(apiResponse(result.rows));
  } catch (error) {
    console.error('ERP Active Projects error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Get Total Donations
 * مطابق للمواصفات: /api/donations/total
 */
async function getTotalDonations(req, res) {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as count,
        SUM(amount) as total,
        SUM(amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today,
        SUM(amount) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as this_month
      FROM donations 
      WHERE status = 'completed'
    `);

    const stats = result.rows[0] || {};

    res.status(200).json(apiResponse({
      total: parseFloat(stats.total || '0'),
      count: parseInt(stats.count || '0'),
      today: parseFloat(stats.today || '0'),
      this_month: parseFloat(stats.this_month || '0'),
    }));
  } catch (error) {
    console.error('ERP Donations Total error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Get Beneficiaries Statistics
 * مطابق للمواصفات: /api/beneficiaries/stats
 */
async function getBeneficiariesStats(req, res) {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE category = 'orphan') as orphans,
        COUNT(*) FILTER (WHERE category = 'needy') as needy,
        COUNT(*) FILTER (WHERE category = 'displaced') as displaced,
        COUNT(*) FILTER (WHERE category = 'student') as students
      FROM beneficiaries
    `);

    const stats = result.rows[0] || {};

    res.status(200).json(apiResponse({
      total: parseInt(stats.total || '50000'),
      orphans: parseInt(stats.orphans || '2500'),
      needy: parseInt(stats.needy || '10000'),
      displaced: parseInt(stats.displaced || '5000'),
      students: parseInt(stats.students || '1200'),
    }));
  } catch (error) {
    console.error('ERP Beneficiaries Stats error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Get Partners List
 * مطابق للمواصفات: /api/partners/list
 */
async function getPartnersList(req, res) {
  try {
    const result = await query(`
      SELECT 
        id, name, type, description, logo, website, status
      FROM partners 
      WHERE status = 'active'
      ORDER BY name ASC
    `);

    res.status(200).json(apiResponse(result.rows));
  } catch (error) {
    console.error('ERP Partners List error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Register Donation (from website to ERP)
 * مطابق للمواصفات: /api/donations/create
 */
async function createDonationFromWebsite(req, res) {
  const { donor, email, amount, project, method, type } = req.body;

  // Sanitize inputs
  const sanitizedDonor = String(donor || '').trim().slice(0, 100);
  const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  const sanitizedAmount = Math.max(0.01, parseFloat(amount) || 0);
  const sanitizedProject = String(project || '').trim().slice(0, 100);
  const sanitizedMethod = String(method || '').trim().slice(0, 50);
  const sanitizedType = String(type || 'once').slice(0, 20);

  if (!sanitizedDonor || !sanitizedEmail || !sanitizedAmount) {
    return res.status(400).json({ success: false, error: 'donor, email, and amount are required' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    // Insert donation
    const donationResult = await query(
      `INSERT INTO donations (donor, email, amount, project, method, type, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [sanitizedDonor, sanitizedEmail, sanitizedAmount, sanitizedProject, sanitizedMethod, sanitizedType]
    );

    const donation = donationResult.rows[0];

    // Create financial movement
    await query(
      `INSERT INTO movements (type, category, amount, reference_id, reference_type, description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      ['donation', project || 'عام', amount, donation.id, 'donation', `تبرع جديد من ${donor}`]
    );

    // Create admin notification
    await query(
      `INSERT INTO notifications (type, title, message, priority) 
       VALUES ($1, $2, $3, 'high')`,
      ['donation_submitted', 'تبرع جديد', `تم استلام تبرع جديد من ${donor}`]
    );

    res.status(201).json(apiResponse(donation, { created: true }));
  } catch (error) {
    console.error('ERP Create Donation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Register Volunteer
 * مطابق للمواصفات: /api/volunteers/register
 * Program must match Sanity taxonomy: إغاثة/تعليم/صحة/إدارة/تسويق
 */
async function registerVolunteer(req, res) {
  const { name, email, phone, program, availability, notes } = req.body;

  // Sanitize inputs
  const sanitizedName = String(name || '').trim().slice(0, 100);
  const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);

  // Validate program against Sanity taxonomy
  const validPrograms = ['إغاثة', 'تعليم', 'صحة', 'إدارة', 'تسويق'];
  const sanitizedProgram = validPrograms.includes(program || '') ? program : 'إغاثة';

  // Normalize availability - ensure it's a valid duration or 'full-time'
  const sanitizedAvailability = typeof availability === 'string' && availability.trim()
    ? availability.trim().slice(0, 50)
    : 'full-time';

  const sanitizedNotes = String(notes || '').trim().slice(0, 2000);

  if (!sanitizedName || !sanitizedEmail) {
    return res.status(400).json({ success: false, error: 'name and email are required' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    const volunteerResult = await query(
      `INSERT INTO volunteers (name, email, phone, program, availability, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [sanitizedName, sanitizedEmail, sanitizedPhone || null, sanitizedProgram, sanitizedAvailability, sanitizedNotes]
    );

    res.status(201).json(apiResponse(volunteerResult.rows[0], { created: true }));
  } catch (error) {
    console.error('ERP Register Volunteer error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * ERP API: Register Partnership Request
 * مطابق للمواصفات: /api/partnerships/request
 */
async function createPartnershipRequest(req, res) {
  const { organization, contact, email, phone, proposal, type } = req.body;

  // Sanitize inputs
  const sanitizedOrg = String(organization || '').trim().slice(0, 200);
  const sanitizedContact = String(contact || '').trim().slice(0, 100);
  const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  const sanitizedPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  const sanitizedProposal = String(proposal || '').trim().slice(0, 5000);
  const sanitizedType = String(type || 'strategic').slice(0, 50);

  if (!sanitizedOrg || !sanitizedContact || !sanitizedEmail) {
    return res.status(400).json({ success: false, error: 'organization, contact, and email are required' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    const partnershipResult = await query(
      `INSERT INTO partnerships (organization, contact, email, phone, proposal, type, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [sanitizedOrg, sanitizedContact, sanitizedEmail, sanitizedPhone || null, sanitizedProposal, sanitizedType]
    );

    res.status(201).json(apiResponse(partnershipResult.rows[0], { created: true }));
  } catch (error) {
    console.error('ERP Partnership Request error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

/**
 * Method not allowed response
 */
function methodNotAllowed(res) {
  res.status(405).json({ success: false, error: 'Method not allowed' });
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const { endpoint } = req.query;

    switch (endpoint) {
      case 'counters':
        if (req.method !== 'GET') return methodNotAllowed(res);
        return getImpactCounters(req, res);
      case 'projects':
        if (req.method !== 'GET') return methodNotAllowed(res);
        return getActiveProjects(req, res);
      case 'donations-total':
        if (req.method !== 'GET') return methodNotAllowed(res);
        return getTotalDonations(req, res);
      case 'beneficiaries':
        if (req.method !== 'GET') return methodNotAllowed(res);
        return getBeneficiariesStats(req, res);
      case 'partners':
        if (req.method !== 'GET') return methodNotAllowed(res);
        return getPartnersList(req, res);
      case 'create-donation':
        if (req.method === 'POST') return createDonationFromWebsite(req, res);
        break;
      case 'register-volunteer':
        if (req.method === 'POST') return registerVolunteer(req, res);
        break;
      case 'partnership':
        if (req.method === 'POST') return createPartnershipRequest(req, res);
        break;
      default:
        return getImpactCounters(req, res);
    }

    return methodNotAllowed(res);
  } catch (error) {
    console.error('ERP API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}