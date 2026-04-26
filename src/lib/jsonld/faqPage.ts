// faqPage.ts
// Generates FAQPage JSON-LD with mainEntity Question/Answer pairs.
// Source: docs/03-seo-aeo-strategy.md §Part 2

import type { SchemaOrgObject } from "./restaurant";

export interface SanityFaqEntry {
  question: string;
  answer: string;
}

export interface FaqPageInput {
  entries: SanityFaqEntry[];
  url?: string;
}

export function generateFaqPageJsonLd(input: FaqPageInput): SchemaOrgObject {
  const { entries, url = "https://theflytrapferndale.com/faq" } = input;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}
