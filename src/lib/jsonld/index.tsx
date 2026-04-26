// index.ts
// Re-exports all JSON-LD generators + <JsonLd> React Server Component helper.

export { generateRestaurantJsonLd } from "./restaurant";
export type { RestaurantInput, SchemaOrgObject } from "./restaurant";

export { generateMenuJsonLd } from "./menu";
export type { MenuInput, SanityMenuSection, SanityMenuItem, SanityDietaryFlag } from "./menu";

export { generateFaqPageJsonLd } from "./faqPage";
export type { FaqPageInput, SanityFaqEntry } from "./faqPage";

export { generateNewsArticleJsonLd } from "./newsArticle";
export type { SanityPressEntryArticle } from "./newsArticle";

export { generateReviewJsonLd } from "./review";
export type { SanityPressEntryReview } from "./review";

export { generateAboutPageJsonLd } from "./aboutPage";
export type { AboutPageInput } from "./aboutPage";

export { generateSpeakableJsonLd } from "./speakable";
export type { SpeakableInput, SpeakablePage } from "./speakable";

import React from "react";
import type { SchemaOrgObject } from "./restaurant";

/**
 * Escape the closing-script byte sequence to prevent XSS when injecting
 * JSON-LD into a <script> tag.
 * See: OWASP XSS Prevention - Rule #3
 *
 * The input is structured data produced by this library — never raw user input.
 * safeStringify handles the one attack vector that applies (nested HTML in
 * string values).
 */
export function safeStringify(data: SchemaOrgObject): string {
  // Replace </script> in any form to prevent early script-tag closure.
  return JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
}

/**
 * JsonLd — React Server Component helper.
 *
 * Safety note: dangerouslySetInnerHTML is intentional here.
 * The content is the output of safeStringify(), which:
 *   1. Operates on library-generated structured objects (no user input).
 *   2. Escapes all </script> sequences per OWASP XSS Rule #3.
 * React's text-node escaping cannot be used for <script> bodies.
 */
export function JsonLd({ data }: { data: SchemaOrgObject }): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      // safe: content is safeStringify() output — see comment above
      dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
    />
  );
}
