// ============================================================
// AI Content Recommendations — Smart Content Curation
// Uses donation/project patterns to suggest content
// ============================================================
import { query } from '../database.js';
import { sanityClient } from '@/sanity/client';

const CACHE_KEY = 'rh_recommendations';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// ─── Recommendation Engine ─────────────────────────────────
async function generateRecommendations() {
  const insights = await Promise.all([
    // Most popular projects (by donation count)
    query(`
      SELECT project, COUNT(*) as count, SUM(amount) as total
      FROM donations WHERE project IS NOT NULL AND status = 'completed'
      GROUP BY project ORDER BY count DESC LIMIT 5
    `),

    // Most active donor sectors
    query(`
      SELECT project, COUNT(DISTINCT email) as unique_donors
      FROM donations WHERE project IS NOT NULL AND status = 'completed'
      GROUP BY project ORDER BY unique_donors DESC LIMIT 5
    `),

    // Recent high-impact stories (from Sanity)
    sanityClient.fetch(`*[_type == "successStory"] | order(publishDate desc)[0...3]{_id, title, story, beneficiaryName, mainImage}`),

    // Trending topics (based on recent donations)
    query(`
      SELECT unnest(tags) as tag, COUNT(*) as count
      FROM donations, jsonb_array_elements_text(CASE WHEN metadata->'tags' IS NOT NULL THEN metadata->'tags' ELSE '[]'::jsonb END) as tags
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY tag ORDER BY count DESC LIMIT 5
    `),
  ]);

  const popularProjects = insights[0].rows;
  const activeSectors = insights[1].rows;
  const recentStories = insights[2] || [];
  const trendingTopics = insights[3].rows;

  // Generate recommendations
  const recommendations = {
    featuredProjects: popularProjects.slice(0, 3).map(p => ({
      type: 'project',
      title: p.project,
      reason: `${parseInt(p.count)} تبرع — الأكثر شعبية`,
      metric: `${parseFloat(p.total).toLocaleString('ar')} ر.ي`,
    })),

    suggestedContent: recentStories.map(s => ({
      type: 'story',
      title: s.title,
      reason: 'قصة نجاح حديثة',
      image: s.mainImage,
    })),

    trendingTopics: trendingTopics.map(t => ({
      type: 'topic',
      title: t.tag || 'عام',
      reason: `${t.count} تبرع هذا الشهر`,
    })),

    callToAction: popularProjects.length > 0 ? {
      type: 'donate',
      title: `ادعم مشروع ${popularProjects[0].project}`,
      reason: 'الأكثر حاجة للدعم',
      amount: Math.max(10, Math.round((parseFloat(popularProjects[0].total) / parseInt(popularProjects[0].count)) / 10) * 10),
    } : null,
  };

  return recommendations;
}

// ─── API Handler ───────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const recommendations = await generateRecommendations();
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(200).json({ success: true, data: {} }); // Graceful fallback
  }
}
