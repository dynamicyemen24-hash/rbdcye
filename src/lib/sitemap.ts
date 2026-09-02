interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export function getStaticUrls(): SitemapUrl[] {
  const baseUrl = 'https://rbdcye.org';
  const now = new Date().toISOString();

  return [
    { loc: baseUrl, lastmod: now, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/about`, lastmod: now, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/projects`, lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/news`, lastmod: now, changefreq: 'daily', priority: 0.9 },
    { loc: `${baseUrl}/donate`, lastmod: now, changefreq: 'monthly', priority: 0.9 },
    { loc: `${baseUrl}/contact`, lastmod: now, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/volunteer`, lastmod: now, changefreq: 'monthly', priority: 0.7 },
  ];
}


