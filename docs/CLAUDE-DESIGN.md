# CLAUDE-DESIGN.md — Single-Page Design Handoff

Single-source design + content reference for The Fly Trap website implementation. Read this file first. All other docs are deeper drill-downs.

**Project:** The Fly Trap diner, 22950 Woodward Ave, Ferndale, MI 48220
**Owners:** Kara & Gavin McMillian (returned October 2024)
**Build model:** speculative build-then-offer by Summit Software Solutions. No client commitments. No outreach to Kara until handoff.
**Capture date:** 2026-04-25 (Saturday). Single on-site visit, 33 photos, 17 fly paintings catalogued.

---

## 1. Hard constraints (non-negotiable)

1. **Single-page site.** One `/` route with anchor sections. No multi-route App Router.
2. **No live integrations.** Instagram = mock JSON. Toast ordering = "Coming Soon" + email capture. Commerce = stubbed.
3. **No paid services committed.** Vercel free tier only. No Plausible, EmbedSocial, Curator, etc., until post-handoff.
4. **No commercial commitments on Kara's behalf.** No domain registration, no Meta app, no Toast credentials, no DNS.
5. **No emojis** anywhere — copy, code, commits, headings, microcopy.
6. **No CMS.** Static content lives in component files or a single JSON. Sanity Studio stripped.
7. **Mobile-first.** Every layout starts at 375px viewport. Tested at 375 / 768 / 1280.
8. **Voice match.** Existing About-page register preserved verbatim where it exists.
9. **Hero rotation discipline.** 5 paintings only on home rotation (see §6). Bathroom-context pieces stay catalog-only.
10. **No identifiable people** in published photos without consent. Crop or hold.
11. **noindex header** until handoff. Gated by `NEXT_PUBLIC_ALLOW_INDEXING !== 'true'`.

---

## 2. Brand facts (locked)

| Fact | Value |
|---|---|
| Address | 22950 Woodward Ave, Ferndale, MI 48220 |
| Phone | (248) 399-5150 |
| Hours | Mon–Sun, 8am–3pm |
| POS | Toast |
| Founded | 2004 |
| DDD feature | Food Network's *Diners, Drive-Ins and Dives* |
| Print domain | `theflytrapferndale.com` (live `.net` is prior-ownership; verify `.com` ownership and prefer it) |

### Taglines

| Tagline | Tier |
|---|---|
| *a finer diner* | Primary |
| *Under Old Management* | Secondary |
| *Catch a Buzz* | Tertiary |
| *Buzzin' since 2004* | Origin handle |

### Wordmark

Red display serif "the fly trap" + script tagline "a finer diner" + small fly + double-line flourish, framed by checkerboard border. Vector redraw pending (open question #5 in design doc).

---

## 3. Voice rules

### Anchor phrases (preserve verbatim)
- *"magnificent life"* / *"magnificent eggs"*
- *"beloved and inquisitive customers"*
- *"Buzzin' since 2004"*
- *"a finer diner"*, *"Under Old Management"*, *"Catch a Buzz"*

### Register
Specific over abstract. Funny over polished. Warm over corporate. Contractions yes. Active voice. Name dishes by name. Let the room argue for itself.

### Banned words (auto-fail)
`elevated`, `delve`, `leverage` (verb), `seamless`, `robust`, `dive deep`, `cutting-edge`, `game-changer`, `streamline`, `empower`, `unlock`, `at the end of the day`, `in today's fast-paced world`, `third-party validation`, `entry point`, `brand experience`, `craft` (as marketing verb).

### Sample passes (already voice-matched)
- *"Twenty years of Buzzin', a room loud in the best way, and a pan of magnificent eggs waiting on Woodward."*
- *"American comfort food with global cooks' tables since 2004 — pho, Thai peanut, Italian, breakfast all day."*
- *"We're still pulling the clippings together. Check back soon."*

Full audit: `docs/voice-audit-report.md`.

---

## 4. Design tokens

### 4a. Colors

#### Primary brand reds

| Token | Hex | Use |
|---|---|---|
| `flytrap-red-deep` | `#992F1E` | Marble bar epoxy. Primary brand accent, CTAs, body accents |
| `flytrap-red-bright` | `#CC4433` | Placeholder for dining-room wall (return-visit sample TBD). Hero impact |

#### Wall zones (6-wall expanded model — see §5)

Sampled from 2026-04-26 photo batch. Any wall zone can back any section per §5.

| Token | Hex | Wall source | Use |
|---|---|---|---|
| `cream-paper` | `#F5EEDC` | Page canvas | Default page bg, body sections, menu cards |
| `butter-yellow` | `#C8B880` | Solid butter wall (corridor) | Warm/inviting sections, accent fills |
| `chartreuse` | `#C8B000` | Atomic-pendant back-bar | High-energy sections, bold accents |
| `terracotta` | `#D88858` | Burnt-orange wall | Loud sections (about, press), warm callouts |
| `plum` | `#685050` | Ceramic-jacks installation room | Loud sections, dark callouts |
| `navy-slate` | `#383838` | Chalkboard-menu wall | Dark sections, footer, contrast bg |
| `back-bar-mauve` | `#6A6A6E` | Joe Strummer back-bar wall | Mid-tone neutrals, data-dense sections |
| `checker-black` | `#1A1A1A` | Floor / structural | Text, borders, structural framing |

#### Semantic text + bg

| Token | Hex | Use |
|---|---|---|
| `text-ink` | `#1A1A1A` | Body text, headings |
| `text-charcoal` | `#4A4A4E` | Secondary text |
| `text-light` | `#F5EEDC` | Text on dark bg |
| `bg-white` | `#FFFFFF` | Page bg, cards |
| `bg-off-white` | `#F5EEDC` | Subtle fill, section breaks |

#### Marble jewel tones (decorative ONLY — never solid fills)

Calibrated against marble-bar close-up (2026-04-26 batch). Bar top is a critical Fly Trap motif — the embedded-marble epoxy bar is one of the diner's signatures.

| Token | Hex | Note |
|---|---|---|
| `marble-ruby` | `#C00A1A` | Confirmed cluster (sample median #B5252C) |
| `marble-ultramarine` | `#0A2A66` | Held from prior capture audit |
| `marble-emerald` | `#00664C` | Confirmed cluster (sample emerald-teal range) |
| `marble-gold` | `#D4A574` | Confirmed cluster (sample median #AE924F, brightened to butterscotch) |
| `marble-plum` | `#6B4C7A` | Held from prior capture audit |
| `marble-teal` | `#00A39C` | Confirmed cluster (sample teal #46727D, brightened) |
| `marble-jade` | `#2D9C7E` | Held from prior capture audit |
| `marble-white` | `#F5F5F5` | White marble |

Used for spot-illustration tints, hover states, decorative touches, and bar-top motif callouts.

### 4b. Typography

**Font stacks (locked):**
- **Display serif:** Fraunces (fallback Recoleta, Georgia, serif)
- **Body sans:** Inter (fallback Figtree, system-ui, sans-serif)
- **Script accent:** Caveat (fallback Reenie Beanie, cursive)

**Scale (desktop baseline; mobile -15-20% under 640px):**

| Token | Size | Line-height | Use |
|---|---|---|---|
| `h1` | 48px | 1.2 | Hero |
| `h2` | 36px | 1.3 | Section heading |
| `h3` | 28px | 1.4 | Subsection |
| `h4` | 24px | 1.4 | Card title |
| `body-lg` | 18px | 1.6 | Intro paragraph |
| `body-base` | 16px | 1.6 | Default body |
| `body-sm` | 14px | 1.5 | Supporting / metadata |
| `caption` | 12px | 1.4 | Labels |

### 4c. Spacing (8px base grid)

| Token | px | Use |
|---|---|---|
| `space-1` | 8 | Tight: button padding, inline gaps |
| `space-2` | 16 | Card padding, section margins |
| `space-3` | 24 | Stacked elements, section breaks |
| `space-4` | 32 | Page section spacing |
| `space-5` | 40 | Hero spacing |
| `space-6` | 48 | Major-section vertical rhythm |
| `space-8` | 64 | Full-viewport breathing room |

### 4d. Radius

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | Checkerboard, strict rectangles |
| `radius-sm` | 4px | Small buttons |
| `radius-md` | 8px | Cards, inputs |
| `radius-lg` | 12px | Large interactives |
| `radius-full` | 9999px | Pills, circles |

### 4e. Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle card depth |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Standard card |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.15)` | Modal/overlay |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.2)` | Hero depth |

### 4f. Motion (respect `prefers-reduced-motion`)

| Token | Value | Use |
|---|---|---|
| `motion-fast` | 150ms | Button press, focus |
| `motion-base` | 200ms | Hover, fade-in |
| `motion-slow` | 300ms | Scroll reveals |
| `timing-ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard reveals |
| `timing-ease-in-out` | `cubic-bezier(0.4, 0, 0.4, 1)` | Back-and-forth |

### 4g. Visual motifs
- **Checkerboard borders** around wordmark + key lockups
- **Marble-halftone gradient:** `linear-gradient(135deg, rgba(200,10,26,.15), rgba(212,165,116,.15))` (subtle hero overlay)
- **Fly silhouette** spot illustration (placeholder; commission post-handoff)

---

## 5. Wall-Zone Color Rule (6-wall expanded model)

The diner's interior has six distinct painted-wall zones. The site mirrors this: **one primary zone color per section**. Never layer zones in the same view.

| Zone | Wall | Hex | Emotional tone | Default site use |
|---|---|---|---|---|
| Canvas | cream-paper | `#F5EEDC` | Calm, neutral | Page bg, body sections, menu cards, FAQ |
| Butter | butter-yellow | `#C8B880` | Warm, inviting | Warm callouts, secondary accents |
| Chartreuse | chartreuse | `#C8B000` | High-energy | Bold accents, daily special, shop |
| Terracotta | terracotta | `#D88858` | Loud, warm | About, press, hero variants |
| Plum | plum | `#685050` | Loud, dark | About variants, gallery callouts |
| Navy-slate | navy-slate | `#383838` | Dark, anchored | Footer, dark contrast sections |
| Mauve mid | back-bar-mauve | `#6A6A6E` | Neutral mid-tone | Data-dense sections, gallery |
| Brand red | flytrap-red-deep | `#992F1E` | Bold, primary | Hero, primary CTAs, brand accents |

**Pairing rules** (keep cohesion across the page):
- Headlines in `flytrap-red-deep` work over `cream-paper`, `butter-yellow`, `chartreuse`.
- Body text: `checker-black` or `flytrap-red-deep` on light zones; `cream-paper` or `butter-yellow` on `plum` / `navy-slate` / `back-bar-mauve`.
- `terracotta` and `plum` reserved for "loud" content sections — not navigation, not footer.
- `navy-slate` is the default footer.
- Adjacent sections should not repeat the same zone color — alternate.

Tokens live in `src/app/globals.css` `@theme` block (Tailwind v4 CSS-first).

---

## 6. Single-Page Section Outline

Mobile-first. One `/` route. Sticky nav with anchor links. Each numbered block = scroll section.

| # | Section | ID | Zone | Content |
|---|---|---|---|---|
| 0 | Sticky nav | — | cream-paper | Wordmark + anchors (Menu / Visit / About / Shop) + Order CTA |
| 1 | Hero | `#top` | red-deep + checkerboard | Wordmark, *a finer diner*, hero painting (rotates 5), primary CTA, hours strip |
| 2 | Intro / About | `#about` | cream-paper | Origin story 3-beat: founded 2004 → 2021–24 pause → returned Oct 2024. DDD badge. Kara quote. |
| 3 | The Room (gallery) | `#gallery` | back-bar-mauve | Horizontally-swipeable 5-painting hero gallery + 6-tile interior grid (checkerboard floor, marble bar, pressed-tin ceiling, marble spheres, salt-shaker wall, exterior golden hour) |
| 4 | Menu highlights | `#menu` | cream-paper | 4–6 signature dishes (Cowboy Curtis, The Forager, Veggie Rumble, etc.) + link to full menu PDF or expanded list |
| 5 | Daily special | `#special` | chartreuse | One rotating dish (named after pop-culture figure — *The Lee Ho Fooks*, *The Hari Kondabolu* style). Photo + name + price |
| 6 | Order online | `#order` | flytrap-red-deep | Toast "Coming Soon" + email intent-capture form |
| 7 | Swat Shop | `#shop` | chartreuse | 3 product cards (Swat Sauces, Gift Cards, T-Shirts) all "Coming Soon" + single email-capture form (option B confirmed) |
| 8 | Press + DDD | `#press` | terracotta | DDD badge, 3–4 press quotes (Crain's, Detroit Free Press, Eater Detroit), link-out chips |
| 9 | Visit | `#visit` | butter-yellow | Address, phone tap-to-call, hours block, embedded map, parking note (lot exists), dog-friendly note, accessibility note, Get Directions button |
| 10 | FAQ | `#faq` | cream-paper | 6–8 accordions (hours, parking, reservations, kid-friendly, dietary, group size, gift cards, daily-special schedule) |
| 11 | Footer | — | navy-slate | Wordmark, real socials (IG `@theflytrapferndale`, FB `/flytrapferndale`), credits, legal |

### Hero rotation (locked)
1. *Fly Art Class* — flies painting flies; brand thesis
2. *Fly Fly-Fishing* — fly using fly to catch fly
3. *Flies on a Dinner Date* — candlelight, "a finer diner"
4. *Flies Kissing on a Hilltop* — tender, merch-ready
5. *The Eye Doctor* — chart spells "FLY"

### Excluded from home rotation (catalog-only)
*Fly on the Toilet*, *Bathroom Line*, *Flies at Urinals*. Funny in-room, off in first impression.

---

## 7. Photo handling

- Web-optimized photos in `assets/photos-web/`. Originals in private `ryankolean/flytrap-website-assets-archive` repo. Do not re-add originals.
- **Reflections in framed art:** present at ≤1200px wide; flaws imperceptible at that size. Re-shoot post-handoff.
- **Identifiable people:** crop out before publishing. Two back-bar shots have staff at POS + customer at counter. Hold or crop. Never blur (reads evasive).
- **Glass + glare:** light in-painting OK. No AI-extend or content alteration.
- **Capture gaps for return visit:** clean dining-room red wall sample, exterior, food, salt-and-pepper shaker wall, receipt close-up. (Marble bar close-up captured 2026-04-26 — palette calibrated.)

---

## 8. Stack

- **Next.js 15** App Router
- **Tailwind CSS v4** with tokens above
- **TypeScript strict**
- **pnpm**
- **Vercel** free tier hosting
- **vitest** for tests
- **No CMS, no commerce, no analytics, no auth** in Phase A

### Deferred to Phase B (post-handoff)
Plausible analytics, paid Sanity tier, Shopify Lite or Square Online, Toast TakeOut integration, Meta OAuth for live Instagram, professional food photography, commissioned spot illustrations, DNS cutover to `.com`.

---

## 9. Reference docs (in priority order)

1. **This file** — `docs/CLAUDE-DESIGN.md` (start here)
2. `docs/KICKOFF-PROMPT.md` — paste-ready kickoff for design implementation session
3. `docs/PHOTO-INVENTORY.md` — every photo in `assets/photos-web/` mapped to its section placement
4. `docs/01-design-document-v1.7.md` — strategic spine
5. `docs/08-capture-reconciliation.md` — resolves capture-doc conflicts
6. `docs/07-capture-audit-and-discoveries.md` — color sampling, three-zone model (superseded — see §5 above for current 6-wall model)
7. `docs/06-capture-debrief.md` — fly-painting catalog, photo rules
8. `docs/03-seo-aeo-strategy.md` — JSON-LD, llms.txt, FAQ
9. `docs/02-press-page-spec.md` — press inventory
10. `docs/04-instagram-integration-spec.md` — Phase A mock-data shape
11. `docs/voice-audit-report.md` — voice rules + violations rewritten
12. `docs/design-tokens.md` — full token narrative (note: legacy `bar-fog` / `corridor-mustard` references are superseded by §5 above)
13. `docs/tokens-css-vars.css` — CSS-var equivalents (legacy — current source is `src/app/globals.css` `@theme` block)
14. `docs/tailwind-theme-snippet.ts` — legacy Tailwind v3 config snippet (do NOT use; v4 is CSS-first, no `tailwind.config.ts`)
15. `docs/menu-extracted.json` — parsed menu data
16. `docs/OPEN-QUESTIONS.md` — non-blocker open questions
17. `docs/09-game-day-and-kickoff-prompt.md` — historical, original capture+build kickoff (pre-design-handoff)

If `06` and `07` disagree, trust `08-capture-reconciliation.md`.

---

## 10. Git + commit conventions

- Direct to `main` (solo work)
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`. Imperative, lowercase, no trailing period.
- Never `--no-verify`, never force-push, never commit secrets
- No Claude co-author trailer unless explicitly asked

---

## 11. Verification before "done"

- `pnpm build` green
- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm test` passing
- `pnpm audit:content` 5/5 PASS (hard-constraint scan)
- Mobile QA at 375 / 768 / 1280 — `document.documentElement.scrollWidth === clientWidth` at 375
- Console + server logs clean at error level
- Screenshots at each breakpoint

---

*Last updated: 2026-04-26. Single-source of truth for design implementation handoff.*
