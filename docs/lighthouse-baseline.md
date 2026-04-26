# Lighthouse Baseline

## Approach

Lighthouse cannot be run reliably until Sanity content is populated and a Vercel preview URL is available. The Sanity project ID is a placeholder; the dataset returns 404 on all fetches during the build. Without rendered content, metrics like LCP, CLS, and FCP are meaningless.

Instead, this document records the static code-quality measures applied in Task 18 that are the structural prerequisites for a >=95 score once real content is present.

## Static checks applied

- **eslint-plugin-jsx-a11y** installed and wired into `eslint.config.mjs` with `recommended` ruleset. `pnpm lint` passes with zero violations.
- **`@typescript-eslint/parser`** added as dev dependency to support ESLint 9 flat config parsing of TypeScript/TSX files.
- **lint script** updated from `next lint` (broken with ESLint 9 flat config) to `eslint 'src/**/*.{ts,tsx}'`.
- **Skip-to-main link** added at the top of `src/app/layout.tsx` body. Visually hidden except on focus (`sr-only focus:not-sr-only`). Targets `#main`.
- **`id="main"` on all `<main>` elements** across every route: `/`, `/about`, `/faq`, `/menu`, `/order`, `/press`, `/shop`, `/visit`. The `/about` page had no `<main>` wrapper — one was added.
- **Hero LCP image** (`src/components/home/Hero.tsx`): first painting in the rotation now has `priority` prop, which adds `<link rel="preload">` for the LCP candidate.
- **`<img>` replaced with `next/image` `<Image>`** in:
  - `src/components/instagram/InstagramPost.tsx` — explicit `width={256} height={256} sizes="256px"`
  - `src/components/about/PaintingGrid.tsx` — `fill` + responsive `sizes`
  - `src/components/about/PaintingModal.tsx` — `fill` inside an aspect-ratio-constrained container
  - `src/components/home/Hero.tsx` — `fill priority` on index 0, `fill` on rest; `sizes="100vw"`
  - `src/components/home/RoomGalleryCarousel.tsx` — `fill` + `sizes="min(72vw, 280px)"`
  - `src/components/home/BuzzinSince2004.tsx` — explicit `width={700} height={700}` + responsive `sizes`
  - `src/app/about/page.tsx` (Fly Art Class hero) — `fill priority` + `sizes="100vw"`
- **`next.config.ts` remote image patterns**: `cdn.sanity.io` added to `images.remotePatterns` so `next/image` can serve Sanity CDN URLs without unoptimized fallback.
- **Focus rings**: all interactive elements (Link, button) already use explicit `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2` or `focus-visible:ring-*` classes. No `outline: none` without replacement was found.
- **`prefers-reduced-motion`**: Hero rotation already respects reduced motion (Task 8). No other `setInterval`/`setTimeout` animation timers found in the codebase.
- **Form labels**: `src/components/order/IntentCaptureForm.tsx` already has `<label htmlFor={...} className="sr-only">` on the email input.
- **Redundant ARIA roles** removed: `role="list"` on `<ul>` in `src/app/shop/page.tsx` and `src/components/home/SwatShop.tsx`.

## Pending verification

The following items require a live Vercel deploy with populated Sanity content before they can be confirmed:

- Actual LCP value and element identification (expected: Hero painting or Fly Art Class image).
- CLS measurement — font loading, image layout shift, and skeleton states cannot be measured statically.
- FID/INP — interaction responsiveness under real network conditions.
- Font loading strategy — `next/font` is not yet wired; web font swap behavior is untested.
- Real Lighthouse score on each route at mobile emulation (Moto G4, 3G throttle).
- Sanity image delivery — CDN caching headers, format negotiation (WebP/AVIF), and actual byte sizes.

## Re-run plan

Once Sanity dataset is populated and a Vercel preview is deployed:

1. Run Lighthouse CI against the preview URL for each route.
2. Use mobile preset: device emulation Moto G4, 3G Fast throttle.
3. Fill in the table below.

| Route | Performance | Accessibility | Best Practices | SEO | Notes |
|-------|------------|---------------|----------------|-----|-------|
| `/` | — | — | — | — | |
| `/about` | — | — | — | — | |
| `/menu` | — | — | — | — | |
| `/faq` | — | — | — | — | |
| `/visit` | — | — | — | — | |
| `/press` | — | — | — | — | |
| `/shop` | — | — | — | — | |
| `/order` | — | — | — | — | |
