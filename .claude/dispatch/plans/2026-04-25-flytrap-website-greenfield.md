# Dispatch Plan: Fly Trap Website (Greenfield)

**Created:** 2026-04-25T00:00:00Z
**Repo:** ryankolean/flytrap-website
**Branch:** main
**Base commit:** d7b9873095977e1bc9df4c940cf1a615274486e1
**Code report:** `.claude/dispatch/reports/code-report-d7b98730.md`

## Project Summary
Speculative ("build-then-offer") website for The Fly Trap diner in Ferndale, Michigan. Single long-scroll mobile-first home page plus seven secondary routes. Live integrations are explicitly stubbed: Instagram pulls from a local mock JSON shaped like the Graph API, Toast online ordering is a Coming Soon stub with email intent-capture, commerce is placeholder. Sanity Studio is the CMS for menu, press, FAQ, fly-painting catalog, daily specials, and site settings. Stack: Next.js 15 App Router + Tailwind + Sanity v3 + TypeScript + Vercel free tier.

## Scope

**In scope:**
- Next.js 15 App Router scaffold with TypeScript, Tailwind 4, ESLint, Prettier
- Tailwind theme wired from `docs/tailwind-theme-snippet.ts`; CSS vars from `docs/tokens-css-vars.css`
- Sanity Studio v3 mounted at `/studio` route, schemas from `docs/sanity-schemas/` deployed
- Seed Sanity dataset from `docs/menu-extracted.json`, painting catalog metadata, press entries, FAQ, site settings
- Home page with all eight scroll sections per design doc §9 (Hero, Today's Buzzing, Menu Tease, Order Online stub, The Room/Fly Gallery, Buzzin' Since 2004, Swat Shop, Visit) plus footer
- Secondary routes: `/menu`, `/order`, `/shop`, `/about`, `/press`, `/faq`, `/visit`
- Instagram UI wired to `app/data/instagram-mock.json` matching Graph API shape
- Toast Coming Soon stub with email intent-capture posting via Server Action to a Sanity `intentCaptureSubmission` document
- All JSON-LD schemas (Restaurant, Menu, MenuSection, MenuItem with `suitableForDiet`, LocalBusiness, FAQPage, Review, NewsArticle) generated from Sanity content
- `robots.txt`, `app/sitemap.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` at root
- AI-generated fly spot-illustrations as placeholders, marked TODO with the artist-attribution open question
- Lighthouse mobile ≥95 across Performance, Accessibility, Best Practices, SEO
- WCAG 2.2 AA compliance
- Auditor pass: no identifiable-people photos shipped, no emojis, voice-match check, hero-rotation discipline
- Vercel preview deploy

**Out of scope:**
- Live Instagram OAuth (Phase B post-handoff)
- Live Toast online ordering integration
- Live commerce / cart / checkout
- Domain registration or DNS changes
- Meta app creation or any Kara-side credentials
- Professional food photography (return-visit task)
- Commissioned spot illustrations from the actual fly-painting artist
- Pitching, contacting, or messaging Kara during the build
- Production deploy on a custom domain (preview URL only)

## Design Decisions

**Approach.** Next.js 15 App Router with React Server Components for all content pages; client components only where interactive (intent-capture form, mobile nav, hero rotation, Instagram carousel). Sanity Studio is mounted at `/studio` to keep deployment a single Vercel project. Content is fetched at build time (ISR with `revalidate: 60`) so the staging URL is fast and Sanity cost stays at zero. JSON-LD is generated from a single shared library that consumes Sanity types — no duplication between page-head blocks and crawler files.

**Rejected alternatives:**
- *Astro instead of Next.js:* simpler for static content, but the Server Action pattern for intent-capture and the `next-sanity` integration ecosystem make Next.js cheaper to build and maintain.
- *Headless WordPress:* Kara's team is small; Sanity Studio is a friendlier editing surface for the menu/press/FAQ workflow than WP admin.
- *Separate Sanity Studio repo:* doubles deploy surface and breaks the type-share between Studio and site. Mounted Studio is standard for solo-build Sanity projects.

**Three-zone color discipline.** Per `docs/07` and `docs/08`, the room is zoned (gray bar / mustard corridor / red dining room). The site mirrors this: each section/route has one primary zone, never multiple at once. Hero and brand-forward sections lean red; menu and order-flow lean gray-fog; about/visit lean mustard. Implemented via section-level CSS-var scopes.

**Hero rotation hard rule.** The `flyPainting` schema has `inHeroRotation: boolean`. Only the five canonical paintings are eligible. Bathroom-context pieces (Fly on the Toilet, Bathroom Line, Flies at Urinals) belong to the catalog (`/about` secondary grid) and are excluded by query in the hero component. Auditor task at the end verifies.

**Instagram swap surface.** Per `docs/04`, Phase A wires the UI to a local JSON file matching the Graph API response. Phase B (post-handoff) is a single data-source swap — replace `import mock from '@/data/instagram-mock.json'` with `await fetchInstagram()`. UI components must consume the typed shape, not the mock import directly.

**Voice match.** Hero copy, About copy, Buzzin' Since 2004 narrative, and FAQ answers must read in the existing About-page register: "magnificent life," "beloved and inquisitive customers," "Buzzin' since 2004." Banned AI-slop words: delve, leverage (verb), seamless, robust, dive deep, cutting-edge, game-changer, streamline, empower, unlock, at the end of the day, in today's fast-paced world. Voice-match auditor task verifies.

## Risk Register

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Bathroom-context paintings leak into home-page hero rotation | `inHeroRotation` boolean enforced by query; auditor task verifies |
| 2 | Identifiable people in shipped photos | Auditor task scans every shipped image; default to crop or hold |
| 3 | OCR price gaps in beverages section | Items flagged `needs_reverification` render as "Ask your server" with a Sanity flag; do not invent |
| 4 | Domain ownership of `.com` unconfirmed | Plan defaults canonical to `.com` per print; OPEN-QUESTIONS.md tracks; auditor flags pre-handoff |
| 5 | Voice drift toward AI-slop | Voice-match auditor task with banned-word list runs before final |
| 6 | Sanity schema vs JSON-LD drift | Single `lib/jsonld.ts` consumes typed Sanity outputs; unit-tested |
| 7 | Lighthouse score regression from large hero images | All photos served via `next/image` with `sizes` and `priority` discipline; LCP image is the AVIF/WebP variant |
| 8 | XSS via JSON-LD injection | Generator escapes the closing-script sequence per OWASP guidance; unit test confirms escaping |

## Execution Overview

| Group | Tasks | Parallelism | Est. Total Tokens |
|-------|-------|-------------|-------------------|
| A (Foundation) | 1, 2, 3 | All parallel | ~120,000 |
| B (Content + Shared libs) | 4, 5, 6, 7 | All parallel after A | ~180,000 |
| C (Pages + Components) | 8, 9, 10, 11, 12, 13, 14, 15 | All parallel after B | ~360,000 |
| D (Integrations) | 16, 17, 18 | All parallel after C | ~110,000 |
| FINAL (Audit + Deploy) | 19, 20, 21 | Sequential | ~80,000 |
| **Total** | **21 tasks** | | **~850,000** |

## Model Budget

| Model | Task Count | Est. Tokens | Why |
|-------|-----------|-------------|-----|
| Haiku | 11 | ~330,000 | Scaffolding, schema wiring, content seeding, mock data, route stubs, file scaffolds |
| Sonnet | 8 | ~420,000 | Component implementation, Tailwind composition, Server Actions, JSON-LD generation, Lighthouse fixes |
| Opus | 2 | ~100,000 | Hero composition + voice-matched copy (creative judgment); final voice-match + people-photo auditor |

---

## Tasks

### Task 1: Next.js 15 + Tailwind + Tooling Scaffold

**Execution group:** A
**Depends on:** none
**Estimated tokens:** 40,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Initialize a Next.js 15 App Router TypeScript project at the repo root (alongside the existing `docs/`, `assets/`, `.claude/`, `CLAUDE.md`, `README.md` — do NOT delete or move any of those). Use `pnpm` as the package manager.

Steps:
1. Run `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-pnpm` — accept defaults that don't conflict with the file list above. If `create-next-app` refuses because the directory is non-empty, manually scaffold (see step 2).
2. Manual scaffold equivalent if needed: create `package.json` with `next@latest`, `react@latest`, `react-dom@latest`, `typescript`, `@types/react`, `@types/node`, `tailwindcss@latest`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`. Add scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`.
3. Create `src/app/layout.tsx`, `src/app/page.tsx` (empty placeholder), `src/app/globals.css`.
4. Wire `tailwind.config.ts` to import the theme from `docs/tailwind-theme-snippet.ts` — copy that file's exported object into the `theme.extend` of the config. Reference `@tailwindcss/postcss` per Tailwind 4 conventions.
5. Copy `docs/tokens-css-vars.css` contents into `src/app/globals.css` as a `:root` block above the `@tailwind` directives.
6. Create `tsconfig.json` with `strict: true`, `paths: { "@/*": ["./src/*"] }`.
7. Create `.prettierrc` and `.eslintrc.json` (or `eslint.config.mjs`) extending `next/core-web-vitals`. Add `prettier-plugin-tailwindcss`.
8. Create `.env.example` with `NEXT_PUBLIC_SANITY_PROJECT_ID=`, `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN=`, `SANITY_API_WRITE_TOKEN=`. Do NOT create `.env.local`.
9. Update `.gitignore` to add `/.next`, `/out`, `/coverage`, `/.vercel` (some are already there — do not duplicate).
10. Run `pnpm install` and `pnpm build` to verify the scaffold compiles. The page can render an empty `<main />`.

#### Acceptance Criteria
- [ ] `pnpm dev` starts a Next.js dev server with no errors
- [ ] `pnpm build` succeeds with TypeScript strict mode passing
- [ ] `pnpm lint` runs with no errors
- [ ] `tailwind.config.ts` imports the theme from the docs snippet (or inlines an exact copy)
- [ ] `src/app/globals.css` contains the `:root` CSS custom properties from `docs/tokens-css-vars.css`
- [ ] All pre-existing files in the repo are intact: `CLAUDE.md`, `README.md`, `docs/`, `assets/`, `.claude/`
- [ ] `.env.example` exists; `.env.local` does NOT exist

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/tailwind-theme-snippet.ts | Source of theme.extend |
| READ   | docs/tokens-css-vars.css | Source of :root vars |
| READ   | CLAUDE.md | Constraints — no emojis, no extra dependencies |
| CREATE | package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs, eslint.config.mjs, .prettierrc, .env.example | Scaffold |
| CREATE | src/app/layout.tsx, src/app/page.tsx, src/app/globals.css | Minimal app shell |
| MODIFY | .gitignore | Add Next.js artifacts |

#### Risk Flags
None (low-risk scaffolding). If `create-next-app` would overwrite existing files, fall through to manual scaffold.

---

### Task 2: Sanity Studio Mount + Client Setup

**Execution group:** A
**Depends on:** none (does NOT depend on Task 1's `pnpm install` — uses its own package additions; these merge cleanly during Group B)
**Estimated tokens:** 35,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Set up Sanity Studio mounted at `/studio` route plus the client utilities for content fetching.

Steps:
1. Add to `package.json` dependencies: `sanity@latest`, `next-sanity@latest`, `@sanity/client@latest`, `@sanity/image-url@latest`, `@sanity/vision@latest`, `@sanity/orderable-document-list@latest`, `styled-components` (Sanity v3 peer dep).
2. Create `sanity.config.ts` at repo root with:
   - `projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!`
   - `dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!`
   - `basePath: '/studio'`
   - `plugins: [structureTool({ structure: customStructure }), visionTool(), orderableDocumentListDeskItem(...)]`
   - `schema: { types: schemaTypes }` — import from `./src/sanity/schemas`
3. Create `src/sanity/schemas/` directory and copy ALL files from `docs/sanity-schemas/` into it verbatim. Keep the `index.ts` barrel export.
4. Create `src/sanity/structure.ts` with a custom desk structure that singletons `siteSettings` (one document only) and orders `menuSection`, `flyPainting`, `pressEntry`, `faqEntry`, `dailySpecial` via `orderableDocumentListDeskItem`.
5. Create `src/sanity/lib/client.ts` exporting `client` from `next-sanity` with `useCdn: process.env.NODE_ENV === 'production'` and `apiVersion: '2026-04-01'`.
6. Create `src/sanity/lib/image.ts` exporting `urlFor` from `@sanity/image-url`.
7. Create `src/sanity/lib/queries.ts` with named GROQ exports: `siteSettingsQuery`, `homeQuery`, `menuQuery`, `pressQuery`, `faqQuery`, `dailySpecialsQuery`, `heroPaintingsQuery` (filter `inHeroRotation == true`), `aboutPaintingsQuery`. Each query selects exactly the fields needed by the consuming page — do NOT use `*[_type=='X']{...}` with `...`.
8. Create `src/app/studio/[[...tool]]/page.tsx` and `src/app/studio/[[...tool]]/layout.tsx` per the standard `next-sanity` mount recipe. Layout disables the root layout's wrapping (no global nav/footer inside Studio).
9. Add `experimental: { taint: true }` to `next.config.ts` and import `next-sanity/webhook` types where needed.

#### Acceptance Criteria
- [ ] All 8 schema files (+ index.ts) exist under `src/sanity/schemas/` and are referenced by `sanity.config.ts`
- [ ] `pnpm typecheck` passes with the schemas integrated
- [ ] Visiting `/studio` in dev mode loads the Sanity Studio interface (assuming env vars are present)
- [ ] `siteSettings` is a singleton in the Studio desk (no "Create new" button visible)
- [ ] Hero paintings query filters by `inHeroRotation == true`
- [ ] No GROQ query uses `...` spread; every field is enumerated

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/sanity-schemas/*.ts | Schema source (copy verbatim into src/sanity/schemas) |
| READ   | docs/04-instagram-integration-spec.md | Reference for any Instagram-related schema notes |
| CREATE | sanity.config.ts | Studio config |
| CREATE | src/sanity/schemas/* (copies) | Schema types |
| CREATE | src/sanity/structure.ts | Custom desk structure |
| CREATE | src/sanity/lib/client.ts, image.ts, queries.ts | Client utilities |
| CREATE | src/app/studio/[[...tool]]/page.tsx, layout.tsx | Studio mount |
| MODIFY | package.json | Add Sanity deps |
| MODIFY | next.config.ts | experimental.taint |

#### Risk Flags
None (low-risk). Coordinate with Task 1 on `package.json` merge — both tasks add deps; the Group B integration runs `pnpm install` after both complete.

---

### Task 3: Repo Hygiene — CI, README, License

**Execution group:** A
**Depends on:** none
**Estimated tokens:** 18,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Set up the supporting repo infrastructure that doesn't depend on the application code.

Steps:
1. Create `.github/workflows/ci.yml` with: install pnpm, install deps, run `pnpm lint`, `pnpm typecheck`, `pnpm build`. Run on `push` to `main` and on `pull_request`. Cache pnpm store. Use Node 20.
2. Create `.github/dependabot.yml` for weekly npm + GitHub Actions updates.
3. Create `.editorconfig` with project-standard line endings, 2-space indent, trim trailing whitespace, final newline.
4. Update `README.md` with: status badge for CI, quick-start section (`pnpm install`, `pnpm dev`, env vars), studio access note, link to `CLAUDE.md` and `docs/README.md`.
5. Create `LICENSE` file: leave as `Proprietary — All rights reserved.` short text (this is a spec build, not OSS).
6. Create `CONTRIBUTING.md` with one paragraph: "Solo build by Summit Software Solutions. External contributions are not accepted during the spec phase."
7. Create `.vscode/settings.example.json` (gitignored already permits this) with format-on-save, default formatter Prettier, recommended extensions list.

#### Acceptance Criteria
- [ ] `.github/workflows/ci.yml` runs lint + typecheck + build
- [ ] `README.md` has a quick-start section
- [ ] `LICENSE` exists with proprietary statement
- [ ] No emojis anywhere in generated files

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | CLAUDE.md, README.md | Existing repo state |
| CREATE | .github/workflows/ci.yml | CI pipeline |
| CREATE | .github/dependabot.yml | Dep updates |
| CREATE | .editorconfig | Editor norms |
| CREATE | LICENSE, CONTRIBUTING.md | Repo hygiene |
| CREATE | .vscode/settings.example.json | IDE hints |
| MODIFY | README.md | Quick start + status badge |

#### Risk Flags
None.

---

### Task 4: Sanity Seed Script — Content Migration

**Execution group:** B
**Depends on:** Task 2 (schemas mounted)
**Estimated tokens:** 50,000
**Recommended model:** Sonnet
**Risk level:** medium

#### Instructions
Write a one-shot seed script that populates a freshly-created Sanity dataset with all content available pre-handoff: menu (from OCR JSON), fly painting catalog (from `docs/06-capture-debrief.md`), site settings (hours, address, phone, taglines, social handles, canonical domain), starter FAQ (from `docs/03-seo-aeo-strategy.md`), starter press entries (from `docs/02-press-page-spec.md`).

Steps:
1. Create `scripts/seed.ts` — uses `@sanity/client` with a write token (read from `SANITY_API_WRITE_TOKEN` env var; fail fast if absent).
2. Read `docs/menu-extracted.json`. For each section, create a `menuSection` document. For each item, create a `menuItem` document referencing its section. Items with `needs_reverification: true` get the same flag in Sanity and a `null` price (UI will render "Ask your server" — see Task 9).
3. Read `docs/06-capture-debrief.md` to extract the 17-painting catalog. For each painting, create a `flyPainting` document with `name`, `slug`, `description`, `inHeroRotation` (true ONLY for the five: Fly Art Class, Fly Fly-Fishing, Flies on a Dinner Date, Flies Kissing on a Hilltop, The Eye Doctor), `category` ("dining-room" or "bathroom-context" — bathroom for Fly on the Toilet, Bathroom Line, Flies at Urinals), `imageRef` (upload from `assets/photos-web/01-artwork/fly-paintings/`), `artistAttribution: null` with a TODO comment.
4. Create the singleton `siteSettings` document with: address `22950 Woodward Ave, Ferndale, MI 48220`, phone `(248) 399-5150`, hours `Mon-Sun 8am-3pm`, owners `Kara & Gavin McMillian`, taglines `["a finer diner", "Under Old Management", "Catch a Buzz"]`, originHandle `Buzzin' since 2004`, ddDFeature `true`, canonicalDomain `theflytrapferndale.com`, instagramHandle `@theflytrapferndale`. Leave press email `null` (open question).
5. Read `docs/03-seo-aeo-strategy.md` FAQ section. Create a `faqEntry` document for each Q&A. For the 4 TBD entries flagged in `docs/discoverability/llms-full.txt`, create the entries with `answer: null` and `needsContent: true` so the UI can hide them until populated.
6. Read `docs/02-press-page-spec.md`. Create `pressEntry` documents for the press inventory. Where pull-quotes are available, populate them verbatim.
7. Upload each photo from `assets/photos-web/` referenced in the documents using `client.assets.upload()` and link the returned asset reference into the document.
8. Make the script idempotent: detect existing docs by slug and update rather than create-duplicate.
9. Add a `pnpm seed` script to `package.json`.
10. Document the run procedure in `scripts/SEED.md`: prerequisites (project created in sanity.io, env vars set), command, expected output, how to reset (`sanity dataset delete production && sanity dataset create production`).

#### Acceptance Criteria
- [ ] `pnpm seed` runs without errors against an empty dataset
- [ ] After running: 13 menu sections, 63 menu items, 17 fly paintings, 1 siteSettings, 4+ FAQ entries (some with needsContent flag), N press entries created
- [ ] Exactly 5 fly paintings have `inHeroRotation: true` (the canonical five)
- [ ] All 3 bathroom-context paintings have `inHeroRotation: false` AND `category: "bathroom-context"`
- [ ] Photos are uploaded as Sanity assets, not stored as URLs
- [ ] No identifiable-people photo (the two back-bar shots flagged in capture debrief) is uploaded
- [ ] Script is idempotent: running twice doesn't create duplicates
- [ ] `scripts/SEED.md` documents the procedure

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/menu-extracted.json | Menu source |
| READ   | docs/06-capture-debrief.md | Painting catalog |
| READ   | docs/02-press-page-spec.md | Press inventory |
| READ   | docs/03-seo-aeo-strategy.md | FAQ source |
| READ   | docs/discoverability/llms-full.txt | TBD FAQ list |
| READ   | docs/08-capture-reconciliation.md | Hero rotation rule, people-photo flags |
| READ   | assets/photos-web/01-artwork/fly-paintings/* | Painting images |
| CREATE | scripts/seed.ts, scripts/SEED.md | Seed script + docs |
| MODIFY | package.json | Add `seed` script |

#### Risk Flags
**Medium risk.** This task writes to a Sanity dataset. Verify before run: the dataset is empty or the user explicitly wants to overwrite. Hero-rotation discipline is hard-coded — auditor task verifies. People-photo exclusion is hard-coded by filename allowlist — list every excluded path in `scripts/SEED.md`.

Rollback: `sanity dataset delete production && sanity dataset create production` and re-run.

---

### Task 5: JSON-LD Library

**Execution group:** B
**Depends on:** Task 2 (Sanity types)
**Estimated tokens:** 35,000
**Recommended model:** Sonnet
**Risk level:** medium

#### Instructions
Build a single shared library that generates every JSON-LD block consumed by the site. One source of truth means no drift between page-head blocks and crawler files.

Steps:
1. Create `src/lib/jsonld/` directory with one file per schema:
   - `restaurant.ts` — Restaurant + LocalBusiness merged graph
   - `menu.ts` — Menu, MenuSection, MenuItem (each MenuItem includes `suitableForDiet` mapped from Sanity dietary flags: `vegetarian` → `https://schema.org/VegetarianDiet`, etc.)
   - `faqPage.ts` — FAQPage with mainEntity Question/Answer
   - `newsArticle.ts` — for press entries that are articles
   - `review.ts` — for press entries that are reviews
   - `index.ts` — re-exports + a `<JsonLd>` React Server Component helper
2. Each generator is a pure function: `(input: SanityType) => SchemaOrgObject`. No fetching inside. Strict types.
3. Add the canonical `@context: "https://schema.org"` and `@type` to every output.
4. The `<JsonLd>` helper renders a `<script type="application/ld+json">` element. The script body is `JSON.stringify(data)` with one critical safety step: every occurrence of the closing-script byte sequence (less-than slash s c r i p t) inside the stringified output must be replaced with an escaped form (e.g. `<\\/script>`). This is the OWASP guidance for inline JSON-LD and prevents an attacker-controlled field from breaking out of the script element. Implement as a small `safeStringify` helper. Unit-test that the helper escapes the sequence.
5. Create unit tests in `src/lib/jsonld/*.test.ts` using Vitest. Each generator gets at least: a happy-path snapshot test and an edge-case test (item missing optional field, dietary flags array empty, etc.). Add Vitest to `package.json` with config in `vitest.config.ts`.
6. Validate output against the Schema.org spec by inspection — every required property for each `@type` is present (use schema.org's Type pages for reference).

#### Acceptance Criteria
- [ ] Every JSON-LD `@type` listed in scope has a generator
- [ ] `MenuItem.suitableForDiet` correctly maps Sanity dietary flags to Schema.org URLs
- [ ] `<JsonLd>` helper escapes the closing-script byte sequence (verified by unit test)
- [ ] Unit test coverage on every generator (>80% line)
- [ ] `pnpm test` passes
- [ ] Output passes Google Rich Results Test on representative samples (manual check, document URLs in `src/lib/jsonld/REPORT.md`)

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/03-seo-aeo-strategy.md | Schema requirements |
| READ   | src/sanity/schemas/* | Type sources |
| CREATE | src/lib/jsonld/*.ts (6 files) | Generators |
| CREATE | src/lib/jsonld/*.test.ts | Unit tests |
| CREATE | src/lib/jsonld/REPORT.md | Manual validation log |
| CREATE | vitest.config.ts | Test config |
| MODIFY | package.json | Add vitest, @vitest/ui |

#### Risk Flags
**Medium risk.** Schema.org compliance is verified manually post-build via Rich Results Test (Task 19). If a generator emits invalid JSON-LD, search engines may de-rank or warn. The closing-script escape is a security-critical step — reviewer must read the unit test and verify the assertion.

---

### Task 6: Mock Data — Instagram, Press, Daily Specials

**Execution group:** B
**Depends on:** Task 2 (types)
**Estimated tokens:** 30,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Create the local mock data files that stand in for live integrations during the spec build.

Steps:
1. Create `src/data/instagram-mock.json` matching the Instagram Graph API `/me/media` response shape exactly (per `docs/04-instagram-integration-spec.md`). Include 12 posts: 4 daily-special posts (with `#flytrapspecial` in caption), 4 dish/food posts, 4 room-and-vibe posts. Each post: `id`, `caption`, `media_type` (IMAGE/CAROUSEL_ALBUM), `media_url`, `permalink`, `timestamp`, `username: "theflytrapferndale"`. Use placeholder `media_url`s referencing `assets/photos-web/` images that DO NOT contain identifiable people.
2. Create `src/data/instagram-mock.types.ts` exporting the TypeScript shape of the response. Hand-written to mirror the Graph API.
3. Create `src/lib/instagram.ts` with `getInstagramFeed(): Promise<InstagramMedia[]>` that imports the JSON and returns it (typed). Mark with a TODO comment: "Phase B: replace with `await fetchInstagramGraph(token)`."
4. Create `src/lib/dailySpecial.ts` with `getCurrentDailySpecial()`: pulls the most recent Sanity `dailySpecial` document, or falls back to the most recent `#flytrapspecial`-tagged Instagram mock post if none. Implements the 7-day staleness fallback per `docs/04-instagram-integration-spec.md`.
5. Document in `src/data/README.md` exactly what is mocked and what the Phase B swap looks like (one paragraph each, no marketing language).

#### Acceptance Criteria
- [ ] `instagram-mock.json` validates against the typed shape
- [ ] At least 4 posts include `#flytrapspecial` in their caption
- [ ] No `media_url` references a photo with identifiable people
- [ ] `getInstagramFeed()` returns a typed `InstagramMedia[]`
- [ ] `getCurrentDailySpecial()` correctly falls back when no Sanity special exists

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/04-instagram-integration-spec.md | API shape + fallback rules |
| READ   | docs/06-capture-debrief.md | People-photo flags |
| CREATE | src/data/instagram-mock.json, instagram-mock.types.ts, README.md | Mock data |
| CREATE | src/lib/instagram.ts, dailySpecial.ts | Data accessors |

#### Risk Flags
None.

---

### Task 7: Layout, Nav, Footer, Theme Provider

**Execution group:** B
**Depends on:** Task 1 (scaffold)
**Estimated tokens:** 45,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the global layout primitives that every page consumes.

Steps:
1. Replace `src/app/layout.tsx` with a real layout that:
   - Sets `<html lang="en">` and applies design-token CSS vars at the body level
   - Imports global font (Sanity GROQ-fetch the chosen font from `siteSettings`, or fall back to a typeface from `docs/01-design-document-v1.7.md` §7 "Typography" — three options exist; pick the first one named there as the default and add a TODO to revisit in Phase 1 design review)
   - Wraps content in `<ThemeZoneProvider>` (see step 4)
   - Includes site-wide Restaurant + LocalBusiness JSON-LD (from Task 5) in the document head
2. Create `src/components/layout/Nav.tsx`:
   - Mobile-first: hamburger drawer at `<md`, horizontal at `>=md`
   - Logo (text wordmark for now, marked TODO for vector trace from menus per `docs/08`)
   - Links: Menu, Order, Shop, About, Press, FAQ, Visit
   - Phone number tap-to-call on mobile (`tel:+12483995150`)
   - "Open until 3pm" live badge component (computes from current time + hours from siteSettings; displays "Closed" outside hours)
3. Create `src/components/layout/Footer.tsx`:
   - Address, phone, hours
   - Real social links (Instagram only; no other handles confirmed)
   - "Buzzin' since 2004" mark
   - Copyright + "Designed by Summit Software Solutions" (small, low contrast)
   - Disclaimer: site under construction (TODO: remove at handoff)
4. Create `src/components/layout/ThemeZoneProvider.tsx` (client component) and `src/components/layout/ThemeZone.tsx` (server component wrapper). Each `<ThemeZone zone="red" | "gray" | "mustard">` sets section-scoped CSS vars per the three-zone model. Hero/red sections, menu/gray, about/mustard.
5. Wire everything: `layout.tsx` renders `<Nav />` + `{children}` + `<Footer />`.

#### Acceptance Criteria
- [ ] Mobile nav drawer opens/closes via hamburger; closed by default
- [ ] Open/closed badge correctly reflects time vs hours
- [ ] Three-zone CSS-var scoping works: a `<ThemeZone zone="red">` section's `--color-bg` differs from a `<ThemeZone zone="gray">` section
- [ ] Restaurant + LocalBusiness JSON-LD renders in the document head site-wide
- [ ] Footer phone, hours, social link match siteSettings
- [ ] No emojis in any rendered string

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md | Voice, typography, footer copy |
| READ   | docs/07-capture-audit-and-discoveries.md | Three-zone model |
| READ   | docs/design-tokens.md | Token names |
| MODIFY | src/app/layout.tsx | Real layout |
| CREATE | src/components/layout/{Nav,Footer,ThemeZoneProvider,ThemeZone,OpenBadge}.tsx | Layout primitives |

#### Risk Flags
None.

---

### Task 8: Home Page — Section 1 (Hero) + Section 5 (Buzzin' Since 2004)

**Execution group:** C
**Depends on:** Tasks 4, 5, 6, 7
**Estimated tokens:** 60,000
**Recommended model:** Opus
**Risk level:** medium

#### Instructions
Build the two highest-creative-judgment sections of the home page: the hero and the return-story.

Steps:
1. Create `src/components/home/Hero.tsx`:
   - 100vh on mobile, 80vh on desktop
   - Three stacked taglines: "a finer diner" (primary, large), "Under Old Management" (secondary, mid), "Catch a Buzz" (tertiary, small) — one composition; explore vertical stack with the primary at hero center
   - Background: rotating fly-painting display (5 paintings only, from Sanity `inHeroRotation == true`). Cross-fade every 6 seconds. Respects `prefers-reduced-motion` (no rotation; show only the Fly Art Class painting per the About-page anchor rule, but for hero use the first by `orderRank`).
   - Two CTAs: "Order Online" (primary red) → `/order`, "See Menu" (secondary outline) → `/menu`
   - "Open until 3pm" badge (re-uses the layout component)
   - One-sentence manifesto under taglines — write it in the existing About-page register (no AI-slop). Sample a draft: *"Twenty years of Buzzin', a room loud in the best way, and a pan of magnificent eggs."* Iterate until it reads like the existing About copy.
2. Create `src/components/home/BuzzinSince2004.tsx`:
   - Section title: "Buzzin' Since 2004"
   - Body copy: the return story — Kara & Gavin opened in 2004, returned to ownership October 2024. Voice-match the existing About page exactly. Include the line "magnificent life" from the existing copy. Pull narrative facts only from `docs/01-design-document-v1.7.md`; do NOT invent details.
   - Visual: the Fly Art Class painting OR a room photo (cropped to no people)
3. Wire both sections into `src/app/page.tsx` with `<ThemeZone zone="red">` for the hero and `<ThemeZone zone="mustard">` for Buzzin' Since 2004.

#### Acceptance Criteria
- [ ] Hero renders all three taglines with the primary (`a finer diner`) most prominent
- [ ] Hero rotation cycles only the 5 canonical paintings; bathroom-context paintings never appear
- [ ] `prefers-reduced-motion` disables rotation
- [ ] Hero copy contains zero AI-slop words (delve, leverage, seamless, robust, cutting-edge, streamline, empower, unlock)
- [ ] Hero copy uses voice matching the existing About page (verified against doc samples)
- [ ] Both CTAs link to working routes
- [ ] Buzzin' Since 2004 narrative is factually grounded in the design doc; no invented details
- [ ] Both sections pass mobile (375px) layout: no horizontal scroll, tap targets ≥44×44px

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §6, §7, §9 | Voice, hero spec, taglines |
| READ   | docs/06-capture-debrief.md | Hero rotation rule (5 paintings) |
| READ   | docs/08-capture-reconciliation.md | Hero discipline confirmation |
| CREATE | src/components/home/Hero.tsx, BuzzinSince2004.tsx | Sections |
| MODIFY | src/app/page.tsx | Mount sections |

#### Risk Flags
**Medium risk — creative judgment.** Voice-match is the highest-stakes copy in the build. The Phase 4 voice auditor will catch slop, but reviewer should read the hero copy before merge. If unsure between two phrasings, leave both in a comment block and let the auditor + human pick.

---

### Task 9: Home Page — Section 3 (Menu Tease) + `/menu` Route

**Execution group:** C
**Depends on:** Tasks 4, 5, 7
**Estimated tokens:** 55,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the home-page Menu Tease and the full `/menu` route.

Steps:
1. Create `src/components/home/MenuTease.tsx`:
   - Five horizontally-scrolling chapter cards: All Things Eggs, Oh Sugar Shack, Green Things, Between Bread, Other Stuff (per design doc §9)
   - Each card: chapter name, 3 featured dishes (name + one-line description + photo + price), "See full chapter" link to `/menu#section-slug`
   - Snap-scroll on mobile (`scroll-snap-type: x mandatory`)
2. Create `src/app/menu/page.tsx`:
   - Full menu rendered from Sanity GROQ query (Task 2's `menuQuery`)
   - Section anchors for deep-links from the Menu Tease
   - Each `MenuItem` renders: name, description, price (or "Ask your server" if `needsReverification: true` or `price: null`), dietary flag pills (V, VG, GF), modifiers
   - Sticky section-nav strip on mobile (jumps to anchor)
   - Menu JSON-LD from Task 5 in the document head
3. Create `src/components/menu/MenuItemCard.tsx` for the line-item presentation. Reused by both the tease (compact variant) and full menu (full variant) via a `variant` prop.
4. Photographs: each menu item gets the photo from Sanity if present, else a fly-spot-illustration placeholder (see Task 13 for the placeholder set).

#### Acceptance Criteria
- [ ] Menu Tease shows all 5 chapters with snap-scroll on mobile
- [ ] `/menu` renders all 13 sections + 63 items from the seed data
- [ ] Items flagged `needsReverification` show "Ask your server" instead of a fabricated price
- [ ] Dietary flags render as accessible pills (with `aria-label`)
- [ ] Menu JSON-LD with `MenuSection`/`MenuItem` (with `suitableForDiet`) renders in the document head
- [ ] Menu JSON-LD passes Google Rich Results Test (logged in `src/lib/jsonld/REPORT.md`)
- [ ] All link targets work; no `href="#"` placeholders

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §9.3 | Menu Tease spec |
| READ   | docs/menu-extracted.json | Menu content (already seeded into Sanity) |
| CREATE | src/components/home/MenuTease.tsx, src/components/menu/MenuItemCard.tsx | Components |
| CREATE | src/app/menu/page.tsx | Full menu route |
| MODIFY | src/app/page.tsx | Mount Menu Tease section |

#### Risk Flags
None.

---

### Task 10: Home Section 3.5 (Order Online stub) + `/order` Route + Intent-Capture Server Action

**Execution group:** C
**Depends on:** Tasks 2, 4, 7
**Estimated tokens:** 35,000
**Recommended model:** Sonnet
**Risk level:** medium

#### Instructions
Build the Toast "Coming Soon" stub with email intent-capture posting to Sanity.

Steps:
1. Create `src/components/home/OrderComingSoon.tsx`:
   - Card with "Online ordering — coming soon" copy (verbatim from design doc §9 §3.5)
   - Greyscale "Powered by Toast" attribution (text-only, no Toast logo asset — they're trademarked; use the wordmark in the Toast sans approximation)
   - Email intent-capture form: single email field + "Notify me" submit
   - Microcopy under: "We'll send one email when ordering goes live. No marketing."
2. Create `src/app/order/page.tsx` rendering the same component at the route level (so the home stub and `/order` are visually consistent).
3. Create `src/app/actions/intent-capture.ts` Server Action:
   - Validates email with Zod (`z.string().email()`)
   - Posts to Sanity as an `intentCaptureSubmission` document with `email`, `submittedAt`, `source: "home" | "order-page"`
   - Honeypot field (hidden CSS) to defeat basic bots
   - Rate-limit: in-memory IP-based counter (max 5 / hour). Module-level `Map<ip, timestamps[]>` is fine for a single-region Vercel deploy.
   - Returns `{ ok: true }` or `{ ok: false, error }`
4. Form component is a client component using `useFormState` + `useFormStatus` for React 19 / Next 15 patterns. Optimistic UI on submit; error inline.
5. Submitted emails are not displayed back; success state is "Thanks. We'll be in touch."

#### Acceptance Criteria
- [ ] Form submits a valid email and creates a Sanity `intentCaptureSubmission` document
- [ ] Invalid email shows inline error without page reload
- [ ] Submitting the honeypot field is silently rejected (returns `{ ok: true }` but skips the Sanity write)
- [ ] More than 5 submissions from the same IP within an hour are rate-limited
- [ ] No third-party tracker fires from this form (no Plausible, no GA — those are deferred)

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §9 §3.5 | Stub spec |
| CREATE | src/components/home/OrderComingSoon.tsx, src/components/order/IntentCaptureForm.tsx | UI |
| CREATE | src/app/order/page.tsx | Route |
| CREATE | src/app/actions/intent-capture.ts | Server Action |
| MODIFY | src/app/page.tsx | Mount section |

#### Risk Flags
**Medium risk.** The Server Action writes user-provided email to Sanity. Verify: rate-limit works, honeypot works, Zod email validation rejects garbage. Review the actual Sanity document on a few test submissions before merging.

Rollback: drop `intentCaptureSubmission` documents from the dataset; nothing else depends on them.

---

### Task 11: Home Section 4 (The Room + Fly Gallery) + `/about` Route

**Execution group:** C
**Depends on:** Tasks 4, 7
**Estimated tokens:** 50,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the home-page room-and-art section and the full `/about` route.

Steps:
1. Create `src/components/home/TheRoom.tsx`:
   - Two-column on desktop / stacked on mobile
   - Left: short room narrative (tin ceiling, marble bar, jewel-tone spheres) — 2-3 sentences voice-matched
   - Right: Fly Gallery teaser — horizontal carousel of the 5 hero-rotation paintings with painting name on hover/tap
   - "See the full collection" CTA → `/about`
2. Create `src/app/about/page.tsx`:
   - **Hero anchor:** Fly Art Class painting fills the top of the page. NO competing headline copy. Just the painting and a small caption.
   - Below: the return story (re-use BuzzinSince2004 component or extract shared piece) + room narrative
   - Painting catalog grid: all 17 paintings, with a clear visual divider before the bathroom-context group ("Also in the bathroom" subhead)
   - Each painting card: photo, name, brief description; click opens a modal with full image
   - Crew of brand facts: address, hours, owners, Buzzin' since 2004 mark
3. Create `src/components/about/PaintingGrid.tsx` and `src/components/about/PaintingModal.tsx`.
4. About page uses `<ThemeZone zone="mustard">`.

#### Acceptance Criteria
- [ ] About page top is the Fly Art Class painting with no competing headline
- [ ] All 17 paintings render in the catalog grid
- [ ] Bathroom-context paintings are visually grouped under a clear divider
- [ ] Painting modal closes on Escape and click-outside; focus returns to trigger
- [ ] Home Section 4 and About painting grid use the same data source (Sanity flyPainting query)
- [ ] Voice on the About page matches the existing About-page register

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md | About copy, room narrative |
| READ   | docs/06-capture-debrief.md | Painting catalog with categories |
| CREATE | src/components/home/TheRoom.tsx | Home section |
| CREATE | src/app/about/page.tsx | About route |
| CREATE | src/components/about/PaintingGrid.tsx, PaintingModal.tsx | About primitives |
| MODIFY | src/app/page.tsx | Mount section |

#### Risk Flags
None.

---

### Task 12: Home Section 6 (Swat Shop) + `/shop` Route

**Execution group:** C
**Depends on:** Task 7
**Estimated tokens:** 30,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the retail surface — stubbed only, no working checkout.

Steps:
1. Create `src/components/home/SwatShop.tsx`:
   - Three product cards: Swat Sauces, Gift Cards, T-Shirts
   - Each card: product name, one-line description (voice-matched), photo placeholder (fly spot-illustration from Task 13), price range, "Coming soon" badge
   - Each card links to `/shop#product-slug`
2. Create `src/app/shop/page.tsx`:
   - Full retail list with descriptions and "Coming soon" stub for each product
   - Email intent-capture form (re-use `IntentCaptureForm` from Task 10 with `source: "shop"`)
3. Add a TODO comment at the top of `/shop/page.tsx`: "Replace with real product cards + Shopify Lite or Square integration post-handoff."

#### Acceptance Criteria
- [ ] All 3 retail cards render with voice-matched descriptions
- [ ] No "Add to cart" button is wired — all CTAs are "Notify me" or stubbed
- [ ] Intent-capture form on /shop posts to Sanity with `source: "shop"`

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §9 Section 6 | Swat Shop spec |
| CREATE | src/components/home/SwatShop.tsx | Home section |
| CREATE | src/app/shop/page.tsx | Shop route |
| MODIFY | src/app/page.tsx | Mount section |

#### Risk Flags
None.

---

### Task 13: Fly Spot-Illustration Placeholder Set

**Execution group:** C
**Depends on:** Task 1
**Estimated tokens:** 25,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Generate a small set of stylized fly spot-illustrations as placeholders for use across the site (per design doc §7.3 "Fly Character System").

Steps:
1. Generate 8 simple SVG fly illustrations as inline SVG components, each in a distinct context per design doc:
   - `FlyTippingHat.tsx` (hero)
   - `FlyPouringCoffee.tsx` (Today's Buzzing)
   - `FlyAtCheckout.tsx` (Swat Shop)
   - `FlyBookended.tsx` (footer mark)
   - `FlyOnBlankPage.tsx` (404 / empty states)
   - `FlySleeping.tsx` (Coming Soon stubs)
   - `FlyReading.tsx` (FAQ)
   - `FlyWaving.tsx` (visit/contact)
2. Each component takes a `className` prop for sizing/coloring via Tailwind.
3. Style: monoline, minimal, 1-2 colors, scalable. Reference the actual fly paintings in `docs/06-capture-debrief.md` for visual cues but do NOT replicate any specific artist work.
4. Add a TODO comment in each file: "Placeholder. Replace with commissioned spot-illustrations if Kara engages the original fly-painting artist post-handoff. See OPEN-QUESTIONS.md #1."
5. Create `src/components/illustrations/index.ts` barrel export.
6. Create `src/components/illustrations/README.md` documenting: each illustration's intended context, why it's a placeholder, and the swap path.

#### Acceptance Criteria
- [ ] 8 inline SVG fly components exist and render
- [ ] Each component scales cleanly via `className`
- [ ] Each file has the placeholder TODO comment referencing OPEN-QUESTIONS.md #1
- [ ] No copyrighted reference replicated

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §7.3 | Fly Character System spec |
| READ   | docs/OPEN-QUESTIONS.md | Open question #1 (artist) |
| CREATE | src/components/illustrations/*.tsx, index.ts, README.md | Placeholder set |

#### Risk Flags
None.

---

### Task 14: `/press` + `/faq` + `/visit` Routes

**Execution group:** C
**Depends on:** Tasks 4, 5, 7
**Estimated tokens:** 50,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the three remaining secondary routes.

Steps:
1. `src/app/press/page.tsx`:
   - Press inventory rendered from Sanity `pressEntry` query
   - Two visual styles: NewsArticle entries (long-form, with body) and Review entries (pull-quote style)
   - Each entry includes JSON-LD per Task 5
   - Pull-quote bank section: featured short pull-quotes per `docs/02-press-page-spec.md`
2. `src/app/faq/page.tsx`:
   - All `faqEntry` documents rendered as expandable Q&A
   - Entries with `needsContent: true` are hidden (do not render with empty answer)
   - FAQPage JSON-LD aggregates all visible entries
3. `src/app/visit/page.tsx`:
   - Hours, address, phone, parking info, accessibility note, dog policy
   - Embedded Google Map (use `<iframe>` to maps.google.com — no API key needed for the embed; gated by user click to prevent third-party load before consent — implement a "Load map" button that swaps in the iframe)
   - LocalBusiness JSON-LD (already in layout, but page can include richer Place data)
4. Each route uses an appropriate `<ThemeZone>` (press: gray, faq: gray, visit: mustard).

#### Acceptance Criteria
- [ ] All three routes render real content from Sanity
- [ ] FAQ entries with `needsContent: true` are hidden (not rendered as empty)
- [ ] Pull-quotes on `/press` match `docs/02-press-page-spec.md` verbatim
- [ ] `/visit` map is consent-gated (does not load iframe until user clicks)

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/02-press-page-spec.md | Press inventory + pull-quotes |
| READ   | docs/03-seo-aeo-strategy.md | FAQ source |
| READ   | docs/01-design-document-v1.7.md | Visit info |
| CREATE | src/app/press/page.tsx, src/app/faq/page.tsx, src/app/visit/page.tsx | Routes |
| CREATE | src/components/{press,faq,visit}/* | Sub-components |

#### Risk Flags
None.

---

### Task 15: Home Section 2 (Today's Buzzing) + Section 7 (Visit teaser)

**Execution group:** C
**Depends on:** Tasks 4, 6, 7
**Estimated tokens:** 35,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the two remaining home-page sections.

Steps:
1. `src/components/home/TodaysBuzzing.tsx`:
   - Pulls current daily special via `getCurrentDailySpecial()` (Task 6)
   - Renders: special name, photo, 1-2 sentence description, "See on Instagram" link if from IG
   - 7-day staleness fallback: if no recent special, hide the section gracefully (no empty card)
   - Includes the `FlyPouringCoffee` illustration as a small accent
2. `src/components/home/VisitTeaser.tsx`:
   - Address, hours, "Get directions" CTA → maps app
   - Small card-style block, ThemeZone mustard
3. Wire both into `src/app/page.tsx` in section order: Hero, Today's Buzzing, Menu Tease, Order Coming Soon, The Room, Buzzin' Since 2004, Swat Shop, Visit Teaser, Footer.

#### Acceptance Criteria
- [ ] Today's Buzzing pulls from Sanity dailySpecial OR Instagram mock with `#flytrapspecial`
- [ ] Section gracefully hides if both sources are stale (>7 days)
- [ ] Visit Teaser shows hours and links to map app (deep-link `https://maps.apple.com/?q=...` on iOS, `geo:` on Android, web fallback)
- [ ] Home page now contains all 8 scroll sections in correct order

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/01-design-document-v1.7.md §9 | Home section specs |
| READ   | docs/04-instagram-integration-spec.md | Daily-special fallback rule |
| CREATE | src/components/home/{TodaysBuzzing,VisitTeaser}.tsx | Sections |
| MODIFY | src/app/page.tsx | Final section order |

#### Risk Flags
None.

---

### Task 16: Discoverability — robots.txt, sitemap.xml, llms.txt, llms-full.txt

**Execution group:** D
**Depends on:** Tasks 2, 5, 14
**Estimated tokens:** 25,000
**Recommended model:** Haiku
**Risk level:** low

#### Instructions
Wire the AI-discoverability files prepared in `docs/discoverability/` into Next.js routes/static.

Steps:
1. Copy `docs/discoverability/robots.txt` to `public/robots.txt`. Update the sitemap URL in it to the Vercel preview URL (or leave a `{{HOST}}` placeholder swapped at runtime; preferred: use a dynamic `app/robots.ts` instead — Next.js will generate it).
2. Convert `docs/discoverability/robots.txt` to `src/app/robots.ts` (Next.js convention) so the `Sitemap:` line uses the dynamic host.
3. Create `src/app/sitemap.ts` consuming `docs/discoverability/sitemap-routes.ts` (or move that file to `src/lib/sitemap-routes.ts` and import). Include dynamic Sanity-driven URLs: `/menu#section-X` anchors are not separate URLs — keep top-level routes only. Add `lastModified` from Sanity's `_updatedAt` for menu/about/press/faq.
4. Create `src/app/llms.txt/route.ts` and `src/app/llms-full.txt/route.ts` returning the contents of `docs/discoverability/llms.txt` and `llms-full.txt` with `Content-Type: text/plain`. At runtime, replace any `{{HOST}}`, `{{HOURS}}`, `{{PHONE}}` tokens with values from siteSettings.
5. Verify all four files at the deployed URL serve correctly with `curl`.

#### Acceptance Criteria
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt` all serve with status 200 and correct Content-Type
- [ ] `robots.txt` allows OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot
- [ ] `sitemap.xml` lists all 8 site routes with valid `lastModified`, `changeFrequency`, `priority`
- [ ] `llms.txt` and `llms-full.txt` reflect actual siteSettings (not template tokens)

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/discoverability/* | Source files |
| CREATE | src/app/robots.ts, sitemap.ts | Next.js conventions |
| CREATE | src/app/llms.txt/route.ts, llms-full.txt/route.ts | Custom routes |
| MOVE   | docs/discoverability/sitemap-routes.ts → src/lib/sitemap-routes.ts | Consumed by app/sitemap.ts |

#### Risk Flags
None.

---

### Task 17: Instagram UI Carousel

**Execution group:** D
**Depends on:** Tasks 6, 7
**Estimated tokens:** 35,000
**Recommended model:** Sonnet
**Risk level:** low

#### Instructions
Build the Instagram UI components consumed by Today's Buzzing and (optionally) The Room sections.

Steps:
1. Create `src/components/instagram/InstagramCarousel.tsx`:
   - Pulls feed via `getInstagramFeed()` (Task 6)
   - Mobile: swipe-snap horizontal scroll
   - Each card: image, caption (truncated to 2 lines), permalink to Instagram
   - "Tag us @theflytrapferndale" microcopy below
2. Create `src/components/instagram/InstagramPost.tsx` (single post card, used by carousel and Today's Buzzing).
3. Both components consume the typed shape from `src/data/instagram-mock.types.ts` — never the JSON file directly. This is the Phase B swap surface.
4. Add a small visible badge: "Showing recent posts (mock data — live feed at handoff)". Removable via env var `NEXT_PUBLIC_INSTAGRAM_LIVE=true`.

#### Acceptance Criteria
- [ ] Carousel renders 12 mock posts
- [ ] Mock-data badge is visible by default
- [ ] Setting `NEXT_PUBLIC_INSTAGRAM_LIVE=true` hides the badge (no other code change needed)
- [ ] Components depend only on the typed Instagram shape, not the mock import path

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/04-instagram-integration-spec.md | UI spec |
| CREATE | src/components/instagram/InstagramCarousel.tsx, InstagramPost.tsx | UI |

#### Risk Flags
None.

---

### Task 18: Accessibility, Mobile Performance, Image Optimization Pass

**Execution group:** D
**Depends on:** Tasks 8, 9, 10, 11, 12, 14, 15, 17
**Estimated tokens:** 50,000
**Recommended model:** Sonnet
**Risk level:** medium

#### Instructions
Sweep the build to meet the Lighthouse ≥95 (mobile) and WCAG 2.2 AA bars.

Steps:
1. Run Lighthouse against the dev server (Vercel preview) for: `/`, `/menu`, `/order`, `/about`, `/press`, `/faq`, `/visit`. Document scores in `docs/lighthouse-baseline.md`.
2. Address any score below 95 on Performance, Accessibility, Best Practices, SEO. Common fixes:
   - Replace any `<img>` with `next/image`; provide explicit `width`, `height`, `sizes`
   - Set `priority` on the LCP image (hero painting on `/`)
   - Use AVIF/WebP via `next/image` defaults
   - Ensure all interactive elements have visible focus rings
   - Verify `prefers-reduced-motion` disables all motion (hero rotation, carousel auto-advance)
   - Color contrast: every text/background pair ≥4.5:1 for body, ≥3:1 for large text. Check the red-zone variant especially.
   - All form fields have associated labels
   - All buttons have accessible names
   - Skip-to-main link at top of layout
3. Add `eslint-plugin-jsx-a11y` to the lint config; fix all violations.
4. Verify with axe-core (run via Playwright or `@axe-core/cli` against the dev server). Document zero serious/critical violations.
5. Run a mobile-viewport (375×667) screenshot pass: take a screenshot of every route and verify no horizontal overflow (`document.documentElement.scrollWidth === clientWidth`).
6. Mobile-only: confirm tap targets are ≥44×44 px on every interactive element.

#### Acceptance Criteria
- [ ] Lighthouse mobile scores ≥95 on Performance, Accessibility, Best Practices, SEO for every route
- [ ] axe-core reports zero serious/critical violations
- [ ] No horizontal scroll at 375px viewport
- [ ] All tap targets ≥44×44 px
- [ ] `prefers-reduced-motion` disables all motion
- [ ] Lighthouse log saved to `docs/lighthouse-baseline.md` with scores per route

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | (most src/ files; broad sweep) | Audit pass |
| MODIFY | (any underperforming components) | Fix as needed |
| CREATE | docs/lighthouse-baseline.md | Score log |

#### Risk Flags
**Medium risk.** A single overlooked oversized image can tank the LCP. Reviewer should re-run Lighthouse on the deployed Vercel preview before merging.

---

### Task 19: People-Photo + Hero-Rotation + JSON-LD Auditor (Automated)

**Execution group:** FINAL
**Depends on:** Tasks 1-18
**Estimated tokens:** 30,000
**Recommended model:** Sonnet
**Risk level:** high

#### Instructions
Run an automated auditor that catches the highest-stakes hard-constraint violations.

Steps:
1. Create `scripts/audit.ts`:
   - **People-photo check:** Walk every photo asset shipped via `next/image` or in `public/`. Cross-reference filenames against an exclusion list defined in `scripts/people-photo-exclusions.ts` (the two back-bar shots from `docs/06-capture-debrief.md`). Fail if any excluded path appears in the build output (`.next/static`, `public/`, or rendered HTML).
   - **Hero-rotation check:** Run the `heroPaintingsQuery` against Sanity. Fail if the result includes anything other than the five canonical names: Fly Art Class, Fly Fly-Fishing, Flies on a Dinner Date, Flies Kissing on a Hilltop, The Eye Doctor.
   - **JSON-LD check:** For each page route, render the page (using a minimal Playwright headless run or `next/server` API), extract every `<script type="application/ld+json">`, and validate against Schema.org with `schema-dts` types. Fail if any block is missing required properties or has invalid `@type`.
   - **Bathroom-context check:** Verify all 3 bathroom-context paintings have `inHeroRotation: false` in the dataset.
   - **Emoji check:** Grep all `.tsx`, `.ts`, `.md`, `.json`, `.txt` shipped under `src/`, `public/`, and rendered HTML for emoji codepoints (U+1F300-U+1FAFF, U+2600-U+27BF). Fail if any found.
2. Run the audit in CI as a separate job. Fail the build on any audit failure.
3. Output a Markdown report to `.claude/dispatch/reports/audit-<timestamp>.md` with pass/fail per check.

#### Acceptance Criteria
- [ ] `pnpm audit:content` (new script) runs all 5 checks and exits 0 on pass, 1 on fail
- [ ] CI runs the audit as a required job
- [ ] Audit catches a deliberately-injected emoji in a test fixture
- [ ] Audit catches a deliberately-injected bathroom-context painting added to the hero rotation
- [ ] Report committed to `.claude/dispatch/reports/`

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | docs/06-capture-debrief.md, docs/08-capture-reconciliation.md | People-photo flags, hero rule |
| CREATE | scripts/audit.ts, scripts/people-photo-exclusions.ts | Auditor |
| CREATE | .github/workflows/audit.yml | CI integration |
| MODIFY | package.json | Add `audit:content` script |

#### Risk Flags
**High risk.** This is the last gate before deploy. If the auditor itself has a bug (false negatives), the constraint violation ships. Reviewer must:
1. Manually verify the auditor catches each constraint by introducing a test violation and confirming red.
2. Read every emit `.next/static` for one route end-to-end at least once before trusting the auditor on subsequent routes.

Rollback if a violation lands in production: revert the offending PR, re-run audit on the preview before re-deploying.

---

### Task 20: Voice-Match Auditor (Manual Pass)

**Execution group:** FINAL
**Depends on:** Task 19
**Estimated tokens:** 40,000
**Recommended model:** Opus
**Risk level:** high

#### Instructions
Read every shipped string for voice match and AI-slop violations. This is a human-grade review that benefits from Opus's judgment on tone.

Steps:
1. Extract every visible string from the rendered site (HTML output, Sanity content, hardcoded copy in components). Tools:
   - Crawl the deployed Vercel preview with a script that visits each route and saves `document.body.innerText`
   - Concatenate Sanity content via a one-shot GROQ query (`*[!(_type match "intentCaptureSubmission")]{..., _type, _id}`)
   - Grep `src/**/*.tsx` for string literals over 10 chars
2. Build a single text file: `docs/voice-audit-input.txt` with every distinct string, deduplicated.
3. Read `docs/01-design-document-v1.7.md` voice section + the existing About-page samples to internalize the register.
4. Pass through the input file and flag every string that:
   - Contains banned AI-slop words: delve, leverage (verb), seamless, robust, dive deep, cutting-edge, game-changer, streamline, empower, unlock, at the end of the day, in today's fast-paced world
   - Reads like generic marketing copy ("our award-winning chefs," "elevated cuisine," "experience the magic")
   - Doesn't sound like the existing About page ("magnificent life," "beloved and inquisitive customers," "Buzzin' since 2004")
5. Output `docs/voice-audit-report.md` with: total strings audited, violations found, suggested rewrites verbatim, file paths to fix.
6. Apply rewrites. Re-run.

#### Acceptance Criteria
- [ ] `docs/voice-audit-report.md` exists with at least one entry per violation found and "OK" if none
- [ ] After rewrites, no banned word appears in any shipped string
- [ ] Sample 10 random strings score "matches register" by a human reviewer

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| READ   | (every shipped string) | Audit input |
| READ   | docs/01-design-document-v1.7.md (voice section) | Register reference |
| CREATE | docs/voice-audit-input.txt, docs/voice-audit-report.md | Audit artifacts |
| MODIFY | (any component or Sanity content with violations) | Rewrites |

#### Risk Flags
**High risk for brand integrity.** If voice drift slips through, the spec build doesn't read like the place. Reviewer should personally read at least the hero, About page, and Buzzin' Since 2004 narrative end-to-end before signing off.

---

### Task 21: Vercel Deploy + Final QA

**Execution group:** FINAL
**Depends on:** Tasks 19, 20
**Estimated tokens:** 15,000
**Recommended model:** Haiku
**Risk level:** medium

#### Instructions
Deploy to a private Vercel preview URL and run the final QA pass.

Steps:
1. Connect the GitHub repo to Vercel (free tier). Project name: `flytrap-website`. Framework preset: Next.js. Auto-deploy on push to `main`. Set env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`. NO `SANITY_API_WRITE_TOKEN` in Vercel — that's local-only for the seed script.
2. Set the Vercel project to private (or use Vercel's password protection on the preview). Do NOT make the URL public-indexable — set `X-Robots-Tag: noindex` via `next.config.ts` headers until handoff. Override only via env var `NEXT_PUBLIC_ALLOW_INDEXING=true`.
3. Trigger a deploy. Note the preview URL.
4. Run a final QA checklist on the deployed URL:
   - [ ] All 8 home sections render with real content
   - [ ] All 7 secondary routes link from nav and footer
   - [ ] Menu shows all 13 sections, 63 items
   - [ ] Hero rotation shows 5 paintings only
   - [ ] About hero is Fly Art Class painting with no headline
   - [ ] Order stub email-capture submits successfully (test 1 email; verify Sanity doc)
   - [ ] Instagram carousel shows 12 mock posts
   - [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt` all return 200
   - [ ] All JSON-LD blocks pass Google Rich Results Test (record URLs in `docs/handoff-checklist.md`)
   - [ ] Lighthouse mobile ≥95 across all four metrics on `/`
   - [ ] No identifiable people in any visible photo
   - [ ] Voice match passes (read hero + About + Buzzin' personally)
   - [ ] No emoji on any rendered page
5. Create `docs/handoff-checklist.md` summarizing: preview URL, deploy timestamp, audit + voice-audit results, Lighthouse scores, open questions snapshot, recommended Phase B steps.

#### Acceptance Criteria
- [ ] Vercel preview URL is live and password-protected (or `noindex`-gated)
- [ ] All checklist items above are checked
- [ ] `docs/handoff-checklist.md` exists with all artifacts

#### File Manifest
| Action | Path | Notes |
|--------|------|-------|
| MODIFY | next.config.ts | Add `X-Robots-Tag: noindex` header conditional on env |
| CREATE | docs/handoff-checklist.md | Final summary |

#### Risk Flags
**Medium risk.** Indexable preview = accidental public exposure of a build that hasn't been offered to Kara. Verify `noindex` is in effect via `curl -I` on every route. Verify Vercel password protection is on (or repo is private and Vercel deploys are gated behind GitHub auth).

Rollback: delete the Vercel project; the GitHub repo stays.

---

## Handoff Instructions

To execute this plan with Claude Dispatch:

1. Review all 21 tasks above. Edit any instructions, acceptance criteria, or model assignments as needed.
2. For each execution group (A, B, C, D, FINAL), dispatch all tasks in that group to Dispatch workers in parallel.
3. Wait for the group to complete before starting the next group.
4. After Group FINAL completes, review Task 21's `docs/handoff-checklist.md` and run any items that need a human eye.
5. Notifications: existing ntfy.sh convention.

### Dispatch Commands

For each task, provide Dispatch with:
- The task instructions (copy the Instructions section verbatim)
- The file manifest (worker scope)
- The acceptance criteria (self-verification)
- The recommended model (or your override)

### Risk Summary

| Task | Risk | Mitigation |
|------|------|-----------|
| 4 | Hero-rotation discipline + people-photo exclusion in seed | Auditor (Task 19) verifies before deploy |
| 5 | JSON-LD compliance + closing-script escape | Unit tests + Rich Results Test in Task 19 |
| 8 | Voice match in hero + return story | Voice auditor (Task 20) + human read |
| 10 | Email intent-capture user input | Zod + honeypot + rate-limit; manual sample inspect |
| 18 | Lighthouse regression from images | Re-run on preview pre-merge |
| 19 | Auditor false-negatives | Manually inject violations and confirm red |
| 20 | Voice drift | Human reads hero/About/Buzzin' personally |
| 21 | Accidental public preview | `noindex` + password protection + curl verify |

### Build-order Summary

```
Group A (parallel): 1, 2, 3
   ↓
Group B (parallel): 4, 5, 6, 7
   ↓
Group C (parallel): 8, 9, 10, 11, 12, 13, 14, 15
   ↓
Group D (parallel): 16, 17, 18
   ↓
Group FINAL (sequential): 19 → 20 → 21
```

Total: 21 tasks, 5 groups, ~850K tokens, mix of Haiku/Sonnet/Opus per task.
