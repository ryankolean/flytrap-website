/**
 * scripts/people-photo-exclusions.ts
 *
 * Photos that contain identifiable people (staff or customers) and must NOT be
 * published until explicit consent is obtained post-handoff.
 *
 * Source: docs/06-capture-debrief.md "The Bar" section (§ back-bar POS terminal
 * and staff visible at counter) and docs/08-capture-reconciliation.md
 * (People-in-photos consent row in the reconciliation table).
 *
 * From doc 08: "staff at POS and customer at counter visible in back-bar shots;
 * recommends cropping or consent".
 *
 * The git-tracked photo at assets/photos-web/02-bar/back-bar-wide-with-staff.jpg
 * is the confirmed problem file (also encoded in scripts/seed.ts
 * EXCLUDED_PEOPLE_PHOTOS). back-bar-portrait-painting.jpg is a painting of a
 * vintage athlete (likely Joe Strummer) — no consent issue.
 *
 * TODO: verify exact filenames against docs/06 § photo handling rules and the
 * original capture batch if any additional back-bar or counter shots were
 * added post-seed. This list is the minimum-permissive set.
 */

export const EXCLUDED_FILES: string[] = [
  // Confirmed: wide back-bar shot with staff member visible at POS terminal.
  // See docs/08-capture-reconciliation.md and scripts/seed.ts EXCLUDED_PEOPLE_PHOTOS.
  "back-bar-wide-with-staff.jpg",

  // Permissive placeholder: any additional back-bar frame that includes a
  // visible person at the counter. If no such file exists the audit still passes
  // (the check only fails when an excluded name IS found in public/ or src/).
  // TODO: verify against docs/06 §photo handling rules for exact filename.
  "counter-customer.jpg",
];
