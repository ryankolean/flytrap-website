# SEO — current state, gaps, and the domain cutover

Audited against `main` on **2026-08-05**.

---

## The headline

The site is **not yet the production site**. `theflytrapferndale.com` still serves the
old legacy site; this repo deploys to
`https://ryankolean.github.io/flytrap-website/`. `theflytrapferndale.net` does not
currently resolve.

Most of the SEO work is written but **not merged** — it lives in open PR
[#114 `feat(seo): structured data, social meta & crawlable content`](https://github.com/ryankolean/flytrap-website/pull/114).
Merging that PR and doing the DNS cutover is the entire near-term SEO plan.

---

## What is on `main` today

In `index.html`:

- `<title>The Fly Trap — a finer diner · Ferndale, MI</title>`
- `<meta name="description">` — location, "buzzin' since 2004", hours
- `<meta name="theme-color" content="#FD0003">`
- Responsive viewport with `viewport-fit=cover`
- Favicons at 32px and 192px, plus `apple-touch-icon`
- `<html lang="en">`

In the app itself, things that help without being "SEO tags":

- Semantic sectioning — `<nav>`, `<main>`, `<header>`, `<section id="…">`, `<footer>`
- Real `alt` text on every content image; decorative images are `alt="" aria-hidden`
- `aria-label` on icon-only controls, `aria-current` on the active menu tab,
  `aria-live` on the rotating press quote
- Visible `:focus-visible` ring on every interactive control
- Full `prefers-reduced-motion` support
- Outbound links carry `rel="noopener"`
- `loading="lazy"` on content images
- Self-hosted fonts with `font-display: swap`

## What is missing on `main`

| Gap | Impact |
|---|---|
| **No server-rendered content** — the served `<body>` is `<div id="root"></div>` | Google can render JS, but Bing and the AI answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot) generally do not. They see an empty page. |
| **No `<h1>` on the home page** | The hero is an image; the only `<h1>` in the codebase is on the `#daily-buzz` page. |
| No `Restaurant` JSON-LD | Loses the highest-value local-search and AI-citation asset (hours, address, phone, menu, cuisine, price range). |
| No Open Graph / Twitter Card tags, no share image | Links shared to social or messaging render with no preview. |
| No `canonical` | Nothing consolidates the `.com` / `.net` / `github.io` copies. |
| No `robots.txt`, no `sitemap.xml`, no `llms.txt` | No crawl guidance; sitemap can't be submitted to Search Console. |
| No `CNAME` file | A custom-domain binding set in the Pages UI can be dropped by a redeploy. |
| No `404.html` | Deep links from the old site 404 with GitHub's default page. |
| React **development** build in production | Larger payload and slower parse than `react.production.min.js`. Real Core Web Vitals cost. |
| `Caveat` loaded from Google Fonts via CSS `@import` | Render-blocking third-party request; the other two families are self-hosted. |

---

## What PR #114 adds

All of it as **static payload that needs no JavaScript**, so it works inside the
no-build constraint:

- **`Restaurant` JSON-LD** — name, address, phone, geocoded coordinates,
  `openingHoursSpecification`, cuisine, `priceRange`, `acceptsReservations: false`,
  `hasMenu`, `sameAs` (Instagram + Food Network).
- **Open Graph + Twitter Card** with a generated `assets/og-image.jpg` (1200×630).
- **`<noscript>` content block** — hours, address, contact, menu highlights, press.
  Real crawlable text for JS-less bots.
- **Visually hidden `<h1>`** on the home page.
- **`canonical`**, geo meta, `robots` directive.
- **`robots.txt`**, **`sitemap.xml`**, **`llms.txt`**.
- **`CNAME`** = `theflytrapferndale.com`, so the domain binding survives redeploys.
- **`404.html`** redirecting stale deep links to the canonical root.
- **React production build** with updated SRI hashes.
- An inline hostname-canonicalisation script that redirects `.net` → `.com`,
  preserving path, query and hash.

The PR notes an audited health score of **44/100** before these changes.

### Before merging, confirm

1. The geo coordinates in the JSON-LD: `42.46221144744633, -83.13511323639223`.
2. That the `.com` cutover is actually happening — the `CNAME` file assumes it.
3. Re-verify against current `main`: the PR was opened 2026-07-19 and `main` has moved
   (the Toast bot commits several times a day). Check it still merges cleanly and that
   `guardrails.yml` passes.

---

## Domain strategy

**`.com` is the single canonical home. `.net` funnels into it.** Two indexable copies
of the same site split ranking signals and invite duplicate-content handling.

### Cutover checklist (registrar + GitHub, not in the repo)

1. **`.com` (primary)** — apex `A`/`AAAA` (or `ALIAS`) records → GitHub Pages IPs;
   `www` `CNAME` → `ryankolean.github.io`. Set the custom domain in
   **Settings → Pages** and enable **Enforce HTTPS**. Merge PR #114 so the `CNAME`
   file is in the repo.
2. **`.net` (alias)** — a registrar- or host-level **301 forward** to
   `https://theflytrapferndale.com`, preserving path. Do **not** point `.net` at
   GitHub Pages: Pages serves one custom domain with TLS, and the certificate only
   covers the `CNAME` value. The in-page JS redirect is a fallback, not the mechanism.
3. **Old-site content** — the current `.com` is a legacy frameset site with
   `/The_Fly_Trap/*.html` deep links. Map anything with inbound links to a 301, or let
   `404.html` catch them.
4. **After launch** — verify both domains in Google Search Console and Bing Webmaster
   Tools, submit `sitemap.xml`, and request re-indexing. Verifying both is what lets
   Google observe the `.net` → `.com` redirect.
5. **Check the Google Business Profile** points at `https://theflytrapferndale.com`.
   For a single-location restaurant, GBP and the `Restaurant` JSON-LD together carry
   most of the local-search weight.

---

## Ongoing SEO maintenance

- The menu and specials change themselves, which is genuinely good for freshness —
  no action needed.
- `sitemap.xml` (once merged) needs its `lastmod` refreshed occasionally; it is a
  static file with one real URL, so this is low-effort.
- The press section is real, verified, high-authority coverage (Food Network, Hour
  Detroit, Crain's). Keep `FT_DATA.press` current — it feeds the `sameAs` and the
  E-E-A-T signal.
- If the `#daily-buzz` page is kept, either link to it from the site or drop it. An
  unlinked hash route is invisible to crawlers and to users. See
  [ROADMAP.md](../ROADMAP.md).
