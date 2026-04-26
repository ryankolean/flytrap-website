import { MetadataRoute } from 'next';
import { sitemapRoutes } from '@/lib/sitemap-routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theflytrapferndale.com';

  // TODO: Fetch _updatedAt from Sanity siteSettings when configured
  // For now, use current date as fallback
  const lastModified = new Date();

  return sitemapRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: route.lastModified || lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
