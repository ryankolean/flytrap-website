// aboutPage.ts
// Generates AboutPage + Organization JSON-LD.
// Source: docs/01-design-document-v1.7.md §2, docs/03-seo-aeo-strategy.md §Part 1

import type { SchemaOrgObject } from "./restaurant";

export interface AboutPageInput {
  url?: string;
  description?: string;
}

export function generateAboutPageJsonLd(
  input: AboutPageInput = {}
): SchemaOrgObject {
  const {
    url = "https://theflytrapferndale.com/about",
    description,
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url,
    ...(description ? { description } : {}),
    mainEntity: {
      "@type": "Organization",
      name: "The Fly Trap",
      url: "https://theflytrapferndale.com",
      foundingDate: "2004-12-28",
      founder: [
        { "@type": "Person", name: "Kara McMillian" },
        { "@type": "Person", name: "Gavin McMillian" },
      ],
      knowsAbout: [
        "American diner cuisine",
        "Diners Drive-Ins and Dives",
      ],
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
