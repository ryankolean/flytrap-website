// review.ts
// Generates Review JSON-LD for press entries that are reviews.
// Source: docs/02-press-page-spec.md, docs/03-seo-aeo-strategy.md §Part 1

import type { SchemaOrgObject } from "./restaurant";

export interface SanityPressEntryReview {
  headline: string;
  outlet: string;
  publishDate: string; // ISO 8601 date string
  sourceUrl: string;
  authorName?: string;
  pullQuote?: string;
}

export function generateReviewJsonLd(
  entry: SanityPressEntryReview
): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: entry.headline,
    datePublished: entry.publishDate,
    url: entry.sourceUrl,
    author: {
      "@type": "Organization",
      name: entry.outlet,
      ...(entry.authorName
        ? {
            employee: {
              "@type": "Person",
              name: entry.authorName,
            },
          }
        : {}),
    },
    ...(entry.pullQuote ? { reviewBody: entry.pullQuote } : {}),
    itemReviewed: {
      "@type": "Restaurant",
      name: "The Fly Trap",
      url: "https://theflytrapferndale.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "22950 Woodward Ave",
        addressLocality: "Ferndale",
        addressRegion: "MI",
        postalCode: "48220",
        addressCountry: "US",
      },
    },
  };
}
