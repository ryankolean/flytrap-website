# Code Report
**Repo:** ryankolean/flytrap-website
**Commit:** d7b9873095977e1bc9df4c940cf1a615274486e1
**Generated:** 2026-04-25T00:00:00Z
**Branch:** main

## Tech Stack
- **Languages:** none yet (greenfield, pre-scaffold)
- **Frameworks (planned):** Next.js 15 (App Router), Tailwind CSS, Sanity Studio v3
- **Database:** Sanity Content Lake (CMS-backed, no relational DB)
- **Build tooling (planned):** Next.js built-in (Turbopack), Tailwind CLI, Sanity CLI
- **Test framework (planned):** Vitest + React Testing Library; Playwright for e2e (deferred)
- **CI/CD (planned):** GitHub Actions for lint/typecheck/build verification; Vercel for preview + production deploys
- **Hosting:** Vercel (free tier)

## Architecture Overview
Greenfield Next.js 15 App Router site with Sanity Studio as the content backend. The site is a single long-scroll home page plus seven secondary routes. All "live integrations" (Instagram OAuth, Toast online ordering, Shopify/Square commerce) are explicitly stubbed during the spec build per CLAUDE.md hard constraints — Instagram pulls from a local mock JSON, Toast is a Coming Soon stub with email intent-capture, commerce is placeholder cards. Real content (menu, press, FAQ, fly-painting catalog, daily specials, taglines, hours) flows from Sanity. Build-then-offer engagement: nothing live, no commitments on the owner's behalf.

## Directory Structure
```
flytrap-website/
├── CLAUDE.md                      ← engagement constraints + stack decisions (8 hard constraints)
├── README.md                      ← short pointer to CLAUDE.md and docs/
├── .gitignore                     ← excludes assets/photos-full-res/, node_modules, .env, etc.
├── .claude/
│   └── dispatch/
│       ├── plans/                 ← architect plans live here
│       └── reports/               ← code reports + agent reports
├── docs/
│   ├── README.md                  ← bundle entry point (read first)
│   ├── 01-design-document-v1.7.md ← strategic spine (the source of truth)
│   ├── 02-press-page-spec.md
│   ├── 03-seo-aeo-strategy.md
│   ├── 04-instagram-integration-spec.md
│   ├── 05-shot-list-v2.md
│   ├── 06-capture-debrief.md
│   ├── 07-capture-audit-and-discoveries.md
│   ├── 08-capture-reconciliation.md  ← resolves 06↔07 conflicts; trust this one
│   ├── 09-game-day-and-kickoff-prompt.md
│   ├── OPEN-QUESTIONS.md          ← 5 non-blocking TODOs
│   ├── menu-extracted.json        ← OCR of physical menu (63 items, 13 sections)
│   ├── menu-extraction-report.md  ← OCR confidence summary + flagged items
│   ├── design-tokens.md           ← human-readable token reference
│   ├── tailwind-theme-snippet.ts  ← drop-in Tailwind theme.extend export
│   ├── tokens-css-vars.css        ← :root CSS custom properties
│   ├── sanity-schemas/            ← 8 doc types + index.ts (TypeScript v3 syntax)
│   │   ├── menuItem.ts
│   │   ├── menuSection.ts
│   │   ├── pressEntry.ts
│   │   ├── faqEntry.ts
│   │   ├── dailySpecial.ts
│   │   ├── flyPainting.ts
│   │   ├── intentCaptureSubmission.ts
│   │   ├── siteSettings.ts
│   │   └── index.ts
│   └── discoverability/
│       ├── robots.txt
│       ├── llms.txt
│       ├── llms-full.txt
│       └── sitemap-routes.ts
└── assets/
    └── photos-web/                ← 13MB, 33 web-optimized photos
        ├── 01-artwork/fly-paintings/
        ├── 02-bar/
        ├── 04-details/
        ├── 07-menu/
        ├── 09-room-overall/
        └── 10-chalkboards/
```

Full-resolution photo originals live in a separate private repo: `ryankolean/flytrap-website-assets-archive`.

## Key Patterns Observed (planned conventions)
- **Code style:** ESLint + Prettier with Next.js defaults; Tailwind class-sorting via `prettier-plugin-tailwindcss`
- **Error handling:** Let Next.js error boundaries surface; no try/catch around server-component data fetches unless the failure is recoverable
- **State management:** Server components by default; client components only where interaction is needed (intent-capture form, Instagram carousel, mobile nav drawer). No global client store.
- **API design:** Sanity GROQ queries co-located with the page that consumes them; one Server Action for the intent-capture form post; no REST API surface beyond Next.js conventions (`sitemap.ts`, `robots.ts`)
- **Authentication:** none (Sanity Studio uses Sanity's built-in auth; site is fully public)

## Dependencies of Note (planned)
- `next@15.x`, `react@19.x`, `react-dom@19.x`
- `tailwindcss@4.x`, `@tailwindcss/postcss`
- `sanity@3.x`, `@sanity/client`, `next-sanity`, `@sanity/image-url`, `@sanity/orderable-document-list`
- `zod` for Server Action validation
- `clsx` + `tailwind-merge` for class composition

## Test Coverage Assessment
- **Test structure:** None yet. Plan introduces lightweight unit tests for the intent-capture validation, the Instagram mock-data shape, and JSON-LD generators.
- **Coverage gaps:** All — greenfield.
- **Test types present:** None.

## Risks and Technical Debt
1. **OCR confidence** — Beverages section has ~27% items with illegible prices (per `docs/menu-extraction-report.md`). Plan includes a "needs_reverification" flag on those items; do not invent prices.
2. **Domain ownership unknown** — Print uses `theflytrapferndale.com`, live site is `.net`. Plan defaults canonical to `.com`; verify pre-deploy or update.
3. **Five paintings hero rotation** — non-negotiable. Bathroom-context pieces (Fly on the Toilet, Bathroom Line, Flies at Urinals) must NOT enter the home-page rotation. Schema has an `inHeroRotation` boolean; UI must validate.
4. **Identifiable people** — Two back-bar shots show staff at POS and a customer at counter. Plan requires either cropping or holding those photos until consent post-handoff. Auditor task at the end of the build verifies no people-shot ships.
5. **AI-slop word avoidance** — Voice register is the existing About-page copy. Plan includes a voice-match audit task; bans words like "delve, leverage, seamless, robust, cutting-edge, streamline, empower, unlock."

## Note on prep work
Four parallel Haiku agents pre-extracted artifacts before this plan was written:
- Menu OCR → `docs/menu-extracted.json`
- Design tokens → `docs/tailwind-theme-snippet.ts`, `docs/tokens-css-vars.css`, `docs/design-tokens.md`
- Sanity schemas → `docs/sanity-schemas/` (8 doc types ready to drop into Studio)
- Discoverability → `docs/discoverability/` (robots/llms/sitemap-routes ready to copy to `/public` and `/app`)

These artifacts are inputs to the dispatch plan, not blockers. Tasks below reference them directly.
