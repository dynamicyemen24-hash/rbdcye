// Sanity Revalidate API - On-demand revalidation for Sanity CMS content
// يستخدم هذا الـ endpoint لإعادة بناء الصفحات عند تحديث المحتوى في Sanity

export default async function handler(req, res) {
  // Only allow POST requests from Sanity webhook
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Verify webhook secret
  const secret = req.headers['x-sanity-secret'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedSecret = process.env.SANITY_STUDIO_REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { _id, _type, _rev } = req.body || {};

    if (!_id || !_type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing document ID or type',
        hint: 'Sanity webhook payload must include _id and _type'
      });
    }

    // Clear CDN cache for the affected content types
    // This tells Cloudflare to revalidate cached pages
    const typePaths = {
      news: ['/news', '/'],
      project: ['/projects', '/'],
      program: ['/programs', '/'],
      successStory: ['/success', '/'],
      partner: ['/partners', '/'],
      media: ['/media', '/'],
      report: ['/reports', '/'],
      siteSettings: ['/', '/about', '/contact'],
    };

    const pathsToRevalidate = typePaths[_type] || ['/'];

    // Note: In serverless environment, we can't easily purge CDN cache
    // But we log the revalidation for monitoring
    console.log(`🔄 Revalidate request: type=${_type}, id=${_id}, rev=${_rev}`);
    console.log(`📄 Paths to revalidate: ${pathsToRevalidate.join(', ')}`);

    // If using Cloudflare, attempt cache purge via API
    if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ZONE_ID) {
      try {
        const cfResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              files: pathsToRevalidate.map(p => `https://rbdcye.org${p}`)
            }),
          }
        );
        const cfResult = await cfResponse.json();
        if (cfResult.success) {
          console.log('✅ Cloudflare cache purged successfully');
        }
      } catch (cfError) {
        console.error('⚠️ Cloudflare cache purge failed:', cfError.message);
      }
    }

    res.status(200).json({
      success: true,
      revalidated: pathsToRevalidate,
      document: { id: _id, type: _type, rev: _rev },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}