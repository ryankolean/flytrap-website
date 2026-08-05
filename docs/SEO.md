# SEO — current state, gaps, and the domain cutover

Audited against `main` on **2026-08-05**.

---

## The headline

The site is **not yet the production site**. `theflytrapferndale.com` still serves the
old legacy site; this repo deploys to
`https://ryankolean.github.io/flytrap-website/`. `theflytrapferndale.net` does not
currently resolve.

The SEO/AEO payload is **on `main`** (PR
[#114](https://github.com/ryankolean/flytrap-website/pull/114)). What remains is the
**DNS cutover** plus the one-line `CNAME` file, which are deliberately held together —
see [below](#cname-is-deliberately-not-committed-yet).

---

## What is on `main` today

Search / social / AI-answer payload in `index.html` — all of it static, so it works
without JavaScript:

- `<title>` and `<meta name="description">`
- **`Restaurant` JSON-LD** — name, address, phone, geocoded coordinates,
  `openingHoursSpecification`, cuisine, `priceRange`, `acceptsReservations: false`,
  `hasMenu`, `sameAs` (Instagram + Food Network)
- **Open Graph + Twitter Card** with `assets/og-image.jpg` (1200×630)
- **`<noscript>` block** — hours, address, contact, menu highlights, verified press.
  Real crawlable text for the engines that don't run JS
- **Visually hidden `<h1>`** on the home page
- `canonical` → `https://theflytrapferndale.com/`, `robots` directive, geo meta
- `theme-color`, responsive viewport, favicons + `apple-touch-icon`, `lang="en"`
- A hostname-canonicalisation script: `.net` → `.com`, preserving path/query/hash

At the repo root: **`robots.txt`**, **`sitemap.xml`**, **`llms.txt`**, **`404.html`**.

Performance: React and ReactDOM load from the **production** minified builds with SRI
hashes, behind a `preconnect` to unpkg.

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

## What is still missing

| Gap | Impact |
|---|---|
| **The domain cutover hasn't happened** | Everything above points at `theflytrapferndale.com`, which still serves the old site. Until DNS moves, the canonical target is wrong. |
| **No `CNAME` file** (deliberate — see below) | The custom-domain binding won't survive a redeploy until it's committed at cutover. |
| Content is still client-rendered | The `<noscript>` block covers the essentials, but the live menu and specials are only visible to crawlers that execute JS. |
| `Caveat` loaded from Google Fonts via CSS `@import` | Render-blocking third-party request; the other two families are self-hosted. |

---

## Where this came from

PR [#114](https://github.com/ryankolean/flytrap-website/pull/114) landed the whole
payload above. The problem it solved: the site renders entirely client-side, so the
served `<body>` was just `<div id="root"></div>`. Google can render JS, but Bing and
the AI answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot)
generally do not — they saw an empty page with nothing to index or cite. The audited
health score before those changes was **44/100**.

Every addition is static payload requiring no JavaScript, so it stays inside the
repo's no-build constraint.

### `CNAME` is deliberately not committed yet

A `CNAME` file makes GitHub Pages bind the custom domain and **301-redirect
`ryankolean.github.io/flytrap-website/` to it**. DNS for `theflytrapferndale.com`
still points at the old legacy site, so shipping `CNAME` before the DNS change would
send every visitor of the staging URL to the old site — effectively taking the new
site offline.

**Add it at cutover, not before.** It is one line:

```
theflytrapferndale.com
```

Commit that file in the same change as the DNS switch (step 1 below).

---

## Domain strategy

**`.com` is the single canonical home. `.net` funnels into it.** Two indexable copies
of the same site split ranking signals and invite duplicate-content handling.

### Cutover checklist (registrar + GitHub, not in the repo)

1. **`.com` (primary)** — apex `A`/`AAAA` (or `ALIAS`) records → GitHub Pages IPs;
   `www` `CNAME` → `ryankolean.github.io`. Then commit the one-line `CNAME` file
   (see above), set the custom domain in **Settings → Pages**, and enable
   **Enforce HTTPS**. Do these together — the `CNAME` file redirects the staging URL
   the moment it deploys.
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
- `sitemap.xml` needs its `lastmod` refreshed occasionally; it is a
  static file with one real URL, so this is low-effort.
- The press section is real, verified, high-authority coverage (Food Network, Hour
  Detroit, Crain's). Keep `FT_DATA.press` current — it feeds the `sameAs` and the
  E-E-A-T signal.
- The site is a single indexable URL. If a second page is ever added, add it to
  `sitemap.xml` and give it its own `<title>`, description and `<h1>`.
