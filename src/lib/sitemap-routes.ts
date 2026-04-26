export interface SitemapRoute {
  url: string;
  lastModified: Date;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

const homeRoute: SitemapRoute = {
  url: '/',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 1.0,
};

export const sitemapRoutes: SitemapRoute[] = [homeRoute];

export { homeRoute };
