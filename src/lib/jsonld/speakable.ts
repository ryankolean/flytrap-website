// speakable.ts
// Generates SpeakableSpecification JSON-LD for /about and /visit.
// Source: docs/03-seo-aeo-strategy.md §Part 1

import type { SchemaOrgObject } from "./restaurant";

export type SpeakablePage = "about" | "visit";

const SPEAKABLE_CONFIG: Record<
  SpeakablePage,
  { url: string; cssSelector: string[] }
> = {
  about: {
    url: "https://theflytrapferndale.com/about",
    cssSelector: ["[data-speakable='about-intro']", "[data-speakable='about-owners']"],
  },
  visit: {
    url: "https://theflytrapferndale.com/visit",
    cssSelector: [
      "[data-speakable='visit-hours']",
      "[data-speakable='visit-address']",
    ],
  },
};

export interface SpeakableInput {
  page: SpeakablePage;
  cssSelector?: string[];
}

export function generateSpeakableJsonLd(input: SpeakableInput): SchemaOrgObject {
  const config = SPEAKABLE_CONFIG[input.page];
  const selectors = input.cssSelector ?? config.cssSelector;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: config.url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: selectors,
    },
  };
}
