// newsArticle.ts
// Generates NewsArticle JSON-LD for press entries that are articles.
// Source: docs/02-press-page-spec.md, docs/03-seo-aeo-strategy.md §Part 1

import type { SchemaOrgObject } from "./restaurant";

export interface SanityPressEntryArticle {
  headline: string;
  outlet: string;
  publishDate: string; // ISO 8601 date string, e.g. "2024-10-15"
  sourceUrl: string;
  authorName?: string;
  pullQuote?: string;
}

export function generateNewsArticleJsonLd(
  entry: SanityPressEntryArticle
): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: entry.headline,
    datePublished: entry.publishDate,
    url: entry.sourceUrl,
    publisher: {
      "@type": "Organization",
      name: entry.outlet,
    },
    ...(entry.authorName
      ? {
          author: {
            "@type": "Person",
            name: entry.authorName,
          },
        }
      : {}),
    ...(entry.pullQuote ? { description: entry.pullQuote } : {}),
    about: {
      "@type": "LocalBusiness",
      name: "The Fly Trap",
      url: "https://theflytrapferndale.com",
    },
  };
}
