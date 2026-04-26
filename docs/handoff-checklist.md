# Handoff Checklist — The Fly Trap Website

**Date:** 2026-04-26  
**Branch:** `claude/magical-elbakyan-eabfc3`  
**Commit:** `2ea6305e00d895873d8f0d61f9743240ad3f13f3`

---

## Project Status

### Completion summary

- **22 tasks completed** across 6 task groups (Groups A–D + FINAL)
- **21 commits** since plan initiated (on dispatch branch; will be merged to main)
- **All hard constraints met:**
  - No live integrations (Instagram, Toast, commerce are stubs)
  - No paid services committed (Vercel free, Sanity free)
  - No commercial commitments on Kara's behalf
  - No emoji on site or in code
  - Voice match passed (7 violations found and fixed in Task 20)
  - Mobile-first (375px layout verified)
  - Hero rotation locked to 5 paintings; bathroom-context pieces catalog-only

### Build artifacts (local, pre-Vercel)

✓ `pnpm typecheck` — 0 errors  
✓ `pnpm lint` — 0 violations (eslint 9 flat config, jsx-a11y recommended)  
✓ `pnpm test` — 56 tests passing  
✓ `pnpm build` — success (expected warning: Sanity `production` dataset not yet configured; this is normal)  
✓ `pnpm audit:content` — all 5 hard-constraint checks PASS

**Routes built (8 main + 4 discovery + studio):**
- `/` — home (8 sections, hero rotation)
- `/about` — Fly Art Class hero, painting grid, return narrative
- `/menu` — live Sanity fetched (stub until seeded)
- `/order` — intent-capture form (email collection)
- `/shop` — swatch shop (non-commerce, visual demo)
- `/visit` — hours, address, map embed, location features
- `/press` — clipping archive + email contact stub
- `/faq` — FAQ accordion
- `/robots.txt` — static, SEO-ready
- `/sitemap.xml` — static, SEO-ready
- `/llms.txt` — AI model discovery (voice-matched)
- `/llms-full.txt` — extended AI context document
- `/studio/[[...tool]]` — Sanity CMS

---

## Deploy Steps — Run These Manually

Follow these steps **before sending the site to Kara.** They require your Sanity account and Vercel account.

### Step 1: Create Sanity project

1. Go to [sanity.io](https://sanity.io) and log in.
2. Create a new project (free tier). Name: "The Fly Trap" or similar.
3. Copy the **Project ID** and **Dataset name** (usually `production`). You'll need both.
4. Save these in a safe place; they go into environment variables in Step 4.

### Step 2: Populate test data locally

1. In the repo, create a `.env.local` file:
   ```
   SANITY_API_WRITE_TOKEN=<paste-write-token-from-sanity.io>
   ```
   The write token is found in Sanity → Project → Settings → API → Tokens.

2. Run the seed script:
   ```
   pnpm seed
   ```
   This populates the `production` dataset with:
   - 13 menu sections
   - 63 menu items
   - 17 fly paintings (5 hero rotation + 12 catalog)
   - Order metadata

3. Verify in Sanity Studio: `pnpm dev`, then navigate to `http://localhost:3000/studio`.

4. Delete `.env.local` before committing. Do not commit API tokens.

### Step 3: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click "Add New Project" → "Import Git Repository" → select `flytrap-website`.
3. Framework preset: **Next.js** (auto-detected).
4. Leave build settings on defaults. Click "Deploy."
5. Vercel will auto-deploy from the `main` branch. Wait ~2 min for the first build.

### Step 4: Set environment variables in Vercel

Once deployed, go to **Vercel Project Settings** → **Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | (from Step 1) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | (generate in Sanity → Settings → API → Tokens, read-only scope) |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel preview URL (e.g., `https://flytrap-website-xyz.vercel.app`) |

**Do NOT add:**
- `SANITY_API_WRITE_TOKEN` (never expose write tokens to production)
- `NEXT_PUBLIC_ALLOW_INDEXING` (omit to keep `noindex, nofollow` header active)
- `NEXT_PUBLIC_INSTAGRAM_LIVE` (leave mock data active)

### Step 5: Enable deployment protection (optional but recommended)

In Vercel Project Settings → **Deployment Protection**, enable:
- **Standard Protection** (requires a Vercel account to view) or
- **Password Protection** (set a password; anyone accessing the URL must enter it)

This prevents accidental discovery before handoff.

### Step 6: Deploy to Vercel

1. Push the current branch (`claude/magical-elbakyan-eabfc3`) to GitHub, or merge to `main`.
2. Vercel auto-deploys from `main`. Alternatively, click "Deploy" in the Vercel dashboard.
3. Wait ~3 min for build to complete.

### Step 7: Verify the deployment

1. Once live, check for the noindex header:
   ```
   curl -I https://<your-vercel-url>/
   ```
   You should see:
   ```
   X-Robots-Tag: noindex, nofollow
   ```

2. Check that all routes are available (no 404s):
   - `/` — hero loads
   - `/menu` — renders live Sanity data
   - `/about` — Fly Art Class painting displays
   - `/faq` — accordion works
   - `/press` — clipping links render
   - `/order` — form visible

3. **Record the preview URL here** (fill in after Step 6):
   ```
   Vercel URL: ___________________________________
   ```

---

## Final QA Checklist

Before offering the site to Kara, verify each item. Use the checklist as a sign-off template.

### Content rendering
- [ ] Home hero rotation displays 5 paintings (Fly Art Class, Fly Fly-Fishing, Flies on Dinner Date, Flies on Hilltop, Eye Doctor)
- [ ] All 8 home sections render with real content (no skeleton placeholders after Sanity seed)
- [ ] Menu shows all 13 sections and 63 items (verify in `/menu` view)
- [ ] About page hero shows Fly Art Class painting with no competing headline
- [ ] About page painting grid shows all 17 paintings (5 hero + 12 catalog, no bathroom-context on homepage)

### Navigation and structure
- [ ] All 7 secondary routes link from top nav: About, Menu, FAQ, Visit, Press, Order, Shop
- [ ] All routes also link from footer
- [ ] Breadcrumbs (if present) are correct on each page
- [ ] 404 page renders with brand voice ("We could not find that page")
- [ ] Error page renders with brand voice ("A glitch in the wing")

### Order stub and engagement
- [ ] `/order` page displays with email-capture form
- [ ] Submit email address; verify document appears in Sanity CMS under Orders
- [ ] (No Toast integration live — stub only)

### Social feed
- [ ] Instagram carousel on home page displays 12 mock posts with real styling
- [ ] (No live Instagram feed — mock data only, Phase A)

### SEO and discovery
- [ ] `/robots.txt` returns 200 with Disallow rules
- [ ] `/sitemap.xml` returns 200 with all 7 main routes listed
- [ ] `/llms.txt` returns 200 with voice-matched summary (verify "Buzzin' since 2004" is present)
- [ ] `/llms-full.txt` returns 200 with full context document

### JSON-LD and rich results
- [ ] View page source and find valid JSON-LD blocks for:
  - Organization (homepage)
  - LocalBusiness (Visit page)
  - BreadcrumbList (secondary routes)
  - FAQPage (FAQ page)
  - NewsArticle or Review (Press clippings, if applicable)
- [ ] Run top 3 routes through [Google Rich Results Test](https://search.google.com/test/rich-results). Record URLs in log below.
  
  **Rich Results Test URLs verified:**
  - [ ] Homepage: ___________________________________
  - [ ] Menu: ___________________________________
  - [ ] About: ___________________________________

### Performance and accessibility
- [ ] Lighthouse mobile score on `/` is ≥95 across all four metrics:
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO
  
  **Lighthouse scores** (record after deploy):
  - Performance: ____  
  - Accessibility: ____  
  - Best Practices: ____  
  - SEO: ____  

- [ ] Skip-to-main link is visible on Tab key press (focus-visible)
- [ ] All images have alt text or `alt=""` if decorative
- [ ] All form labels are correctly associated with inputs
- [ ] Color contrast passes WCAG AA on all text

### Photos and branding
- [ ] No identifiable people visible in any photo on public routes
  - (Two back-bar shots with staff member at POS and customer at counter are held/removed per photo handling rules)
- [ ] Brand voice check — read these sections aloud:
  - [ ] Hero: "Twenty years of Buzzin'..." (check for "magnificent eggs")
  - [ ] About return story: "...the McMillians came home..." (check for "Under Old Management")
  - [ ] Buzzin' Since 2004 section: full narrative (verify no "elevated," no "embrace the magic," etc.)
  - [ ] Footer: "Buzzin' since 2004" present
- [ ] No emoji on rendered pages (verified by build)

### Responsive design
- [ ] Mobile (375px): all sections stack vertically, no horizontal scroll
- [ ] Tablet (768px): hero and content adjust appropriately
- [ ] Desktop (1280px+): full layout with sidebars/grids visible
- [ ] Hero painting scales smoothly across all breakpoints

---

## Audit Results Summary

### Hard-constraint audit (Task 19)
All 5 checks PASS (see `.claude/dispatch/reports/audit-2026-04-26_14-03-58.md`):
- ✓ No identifiable people in excluded photo filenames
- ✓ Hero rotation locked to 5 approved paintings
- ✓ Bathroom-context paintings are catalog-only (not in hero)
- ✓ All JSON-LD generators have @context and @type
- ✓ No emoji codepoints in public code

### Voice-match audit (Task 20)
All 7 violations found and fixed (see `docs/voice-audit-report.md`):
- ✗ "elevated" → removed (4 instances across visit page + llms.txt files)
- ✗ "third-party validation" → "people writing about us"
- ✗ "Press archive is being assembled" → "We're still pulling the clippings together"
- ✗ "the entry point and brand experience" → "the front door"
- ✓ 5 high-stakes copy sections already voice-matched and preserved

Post-rewrite banned-word scan: **0 matches** across `src/` and `docs/discoverability/`.

---

## Open Questions Snapshot

From `docs/OPEN-QUESTIONS.md`. Flag these with Kara at handoff if needed:

1. **Fly-painting artist** — Name not gathered. Affects whether Phase 1.5 spot illustrations are commissioned from the same artist.
2. **Domain ownership** — Confirm Kara owns `theflytrapferndale.com` (canonical on print). Current live site is `.net` from prior ownership era.
3. **"Under Old Management" wording** — No receipt close-up captured. Verify exact spelling/phrasing before printing on signage.
4. **Return-visit photo assets** — Exterior daytime, dining room overall, food plates, shaker collection still needed for future phases.
5. **Press contact email** — Provide email address for `/press` page form. Currently stubbed to `mailto:`.

---

## Recommended Phase B (Post-handoff)

### Quick wins (same free-tier services)
- Plausible Analytics integration (privacy-first alternative to Google Analytics)
- Toast online ordering connector (when Kara provides credentials)
- Shopify Lite or Square commerce integration
- Meta OAuth for live Instagram feed (when Kara provides credentials)

### Deferred scope items
- Professional food photography (currently no plated-dish shots)
- Commissioned spot illustrations from original fly-painting artist
- Custom domain DNS (`theflytrapferndale.com` → Vercel nameservers, if Kara owns domain)
- Motion catalog from design doc §10 (low-priority, high-effort)

---

## Deferred from Spec Build

Per CLAUDE.md and design doc:

- **Live integrations** — Instagram feed, Toast POS integration, Shopify/Square commerce remain Phase 2
- **Paid services** — Plausible, premium Sanity tier, pro food photography, commissioned illustrations
- **DNS and domain** — No domain changes made; `.net` remains live until explicit handoff decision
- **Motion design** — Design doc §10 lists a fly-painting motion catalog; deferred to Phase 1.5 per architectural review

---

## Lighthouse Re-run Plan

After Step 2 (Sanity seeded) and Step 6 (Vercel deployed):

1. Wait 10 min for Vercel to cache CDN images.
2. Open [PageSpeed Insights](https://pagespeed.web.dev/) in incognito mode.
3. Enter your Vercel URL and run for **mobile** (Moto G4, 3G Fast throttle).
4. Run for each route:
   - `/`
   - `/about`
   - `/menu`
   - `/faq`
   - `/visit`
   - `/press`
   - `/shop`
5. Record scores in the table below.

**Lighthouse baseline (fill in after Step 6):**

| Route | Performance | Accessibility | Best Practices | SEO | Notes |
|-------|-------------|----------------|-----------------|----|-------|
| `/` | — | — | — | — | |
| `/about` | — | — | — | — | |
| `/menu` | — | — | — | — | |
| `/faq` | — | — | — | — | |
| `/visit` | — | — | — | — | |
| `/press` | — | — | — | — | |
| `/shop` | — | — | — | — | |
| `/order` | — | — | — | — | |

---

## Sign-Off

Once you've walked through the Deploy Steps and verified the QA checklist:

- [ ] I have seeded Sanity data locally and verified all 13 sections + 63 items render
- [ ] I have deployed to Vercel and set all environment variables
- [ ] I have verified the `X-Robots-Tag: noindex, nofollow` header is present
- [ ] I have verified all 8 routes render without errors or 404s
- [ ] I have completed the QA checklist above
- [ ] I have recorded Lighthouse scores for all routes
- [ ] I have flagged any Open Questions with Kara that need resolution before public launch

**Ready to offer to Kara?** [ ] Yes, all checks pass.

---

## Contact & Next Steps

For questions during handoff:
- **Site repo:** `https://github.com/ryankolean/flytrap-website`
- **Design docs:** See `docs/` directory for strategic context, voice rules, and photo handling rules
- **Sanity Studio:** Runs on `/studio` route when locally deployed or in Vercel preview

**Transition to Kara's ownership:**
1. Kara creates her own Sanity project (or Summit retains and shares access).
2. Kara provides Toast credentials (when ready) for Phase B online-ordering integration.
3. Kara provides Meta app credentials (when ready) for live Instagram feed.
4. Custom domain DNS set up when/if Kara owns `theflytrapferndale.com`.

---

_Generated by Task 21: Vercel Deploy Prep + Handoff Checklist. Last updated: 2026-04-26._
