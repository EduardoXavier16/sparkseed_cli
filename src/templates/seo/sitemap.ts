import type { ProjectConfig } from '../types';

export function generateSitemapXml(config: ProjectConfig): string {
  const baseUrl = 'https://example.com';

  const pageEntries = config.pages.map((page) => {
    const trimmedPageName = page.trim();
    const isHomePage = trimmedPageName.toLowerCase() === 'home';
    const normalizedSlug = trimmedPageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const path = isHomePage || normalizedSlug.length === 0 ? '/' : `/${normalizedSlug}`;
    const priority = isHomePage ? '1.0' : '0.8';

    return [
      '  <url>',
      `    <loc>${baseUrl}${path}</loc>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pageEntries,
    '</urlset>',
    '',
  ].join('\n');
}

export function generateRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', 'Sitemap: https://example.com/sitemap.xml', ''].join('\n');
}
