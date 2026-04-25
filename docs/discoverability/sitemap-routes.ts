/**
 * Sitemap routes for The Fly Trap website.
 *
 * This module exports the route list that Next.js app-router `sitemap.ts`
 * will consume to generate the dynamic sitemap.xml at the site root.
 *
 * Routes include priority, changeFrequency, and lastModified per page.
 * Priority ranges from 0.0 (lowest) to 1.0 (highest).
 * changeFrequency hints to search engines how often content updates.
 */

export interface SitemapRoute {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Home page — highest priority, updated weekly with new press or seasonal changes.
 */
const homeRoute: SitemapRoute = {
  url: "/",
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 1.0,
};

/**
 * Menu page — high priority, updated as dishes and specials change.
 * Frequency set to daily during service periods.
 */
const menuRoute: SitemapRoute = {
  url: "/menu",
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.95,
};

/**
 * Order page — high priority, coming-soon stub that converts to live ordering.
 * Set to weekly during stub phase; will change to daily once Toast integration is live.
 */
const orderRoute: SitemapRoute = {
  url: "/order",
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
};

/**
 * Shop page — retail catalog for Swat Sauces, gift cards, and merchandise.
 * Updated as inventory and pricing change.
 */
const shopRoute: SitemapRoute = {
  url: "/shop",
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
};

/**
 * About page — origin story, ownership arc, and design philosophy.
 * Rarely updated after launch; monthly suffices.
 */
const aboutRoute: SitemapRoute = {
  url: "/about",
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.85,
};

/**
 * Press page — coverage, reviews, and the Diners, Drive-Ins and Dives feature.
 * Updated whenever new press coverage is published; weekly is conservative.
 */
const pressRoute: SitemapRoute = {
  url: "/press",
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
};

/**
 * FAQ page — answers to common questions, critical for AEO.
 * Updated when questions are added or answers change; monthly is conservative.
 */
const faqRoute: SitemapRoute = {
  url: "/faq",
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.85,
};

/**
 * Visit page — hours, location, parking, accessibility, dog policy.
 * Updated when hours or access information changes; monthly is conservative.
 */
const visitRoute: SitemapRoute = {
  url: "/visit",
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.8,
};

/**
 * Sitemap routes array.
 *
 * Used by Next.js generateSitemapxml() to produce the dynamic sitemap.xml.
 * Passed in order: home, menu, order, shop, about, press, faq, visit.
 */
export const sitemapRoutes: SitemapRoute[] = [
  homeRoute,
  menuRoute,
  orderRoute,
  shopRoute,
  aboutRoute,
  pressRoute,
  faqRoute,
  visitRoute,
];

/**
 * Export individual routes for test/verification purposes.
 */
export { homeRoute, menuRoute, orderRoute, shopRoute, aboutRoute, pressRoute, faqRoute, visitRoute };
