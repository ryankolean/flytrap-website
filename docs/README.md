# Fly Trap Website — Context Bundle

This bundle contains everything Claude Code needs to scaffold the `flytrap-website` repository and start building the spec website for The Fly Trap diner in Ferndale, Michigan.

**Engagement model:** Build-then-offer. Summit Software Solutions builds the complete site speculatively, then offers it to Kara McMillian (current owner) as a finished product. No client commitments yet. No live integrations. Everything monetized or credentialed stays stubbed until Kara agrees.

---

## Bundle contents

```
flytrap-website-context-bundle/
├── README.md                       ← you are here
├── docs/                           ← strategy, specs, capture analyses
│   ├── 01-design-document-v1.7.md         (the spine)
│   ├── 02-press-page-spec.md
│   ├── 03-seo-aeo-strategy.md
│   ├── 04-instagram-integration-spec.md
│   ├── 05-shot-list-v2.md                 (reference; on-site visit complete)
│   ├── 06-capture-debrief.md              (analysis pass 1)
│   ├── 07-capture-audit-and-discoveries.md (analysis pass 2 — has color samples)
│   ├── 08-capture-reconciliation.md        (read this first to resolve disagreements)
│   └── 09-game-day-and-kickoff-prompt.md
└── assets/
    ├── photos-full-res/            (~100MB, 33 originals from Pixel @ 4080x3072)
    └── photos-web/                 (~13MB, max 2000px, JPEG q82, EXIF stripped)
```

## Read order for first-time orientation

1. **`docs/01-design-document-v1.7.md`** — the strategic spine. 17 sections plus appendices. Read in full.
2. **`docs/08-capture-reconciliation.md`** — short note on where the two capture analyses agree and disagree. Read this BEFORE the audit and debrief docs.
3. **`docs/07-capture-audit-and-discoveries.md`** — sampled hex color tokens, three-zone color model, brand discoveries.
4. **`docs/06-capture-debrief.md`** — fly-painting catalog with hero rotation discipline, About-page anchor recommendation, photo handling rules.
5. **`docs/04-instagram-integration-spec.md`** — Phase A (build with mock data) is the critical path during the spec build. Phase B (live OAuth pull) is post-handoff only.
6. **`docs/03-seo-aeo-strategy.md`** — JSON-LD schemas, llms.txt, FAQ content architecture.
7. **`docs/02-press-page-spec.md`** — press inventory and pull-quote bank.
8. **`docs/09-game-day-and-kickoff-prompt.md`** — operational notes; less relevant after the kickoff itself.

## Photo asset usage

- **Use `photos-web/`** for everything inside the website (Next.js `<Image>` sources, Sanity asset uploads, etc.). 13MB total, web-ready.
- **Keep `photos-full-res/`** in the repo as the archival source. Add to `.gitattributes` for Git LFS if size becomes a concern, OR move to a separate `flytrap-website-assets-archive` repo and delete the full-res folder from the working repo before the first push.
- **Do not commit photos containing identifiable people** without explicit consent. Two back-bar shots include a staff member at the POS and a customer at the counter — crop or hold those until consent post-handoff. See `docs/06-capture-debrief.md` "Photo handling rules" section.

## Hard constraints (non-negotiable during the spec build)

1. **No live integrations.** Instagram is mock data (Phase A). Toast online ordering is a "Coming Soon" stub with intent-capture form. Commerce is stubbed.
2. **No paid services committed.** Vercel free tier, Sanity free tier. No EmbedSocial / Curator / paid analytics until handoff.
3. **No commercial commitments on Kara's behalf.** No domain registration, no Meta app live, no Toast app credentials.
4. **No emojis on the site.** Markdown headings, copy, and microcopy stay text-only.
5. **Voice match.** Existing About-page copy ("magnificent life," "beloved and inquisitive customers," "Buzzin' since 2004") is the register. Preserve verbatim where it exists.
6. **Mobile-first.** Every layout decision starts on a phone viewport.
7. **Hero rotation discipline.** The home-page fly-art rotation uses these five pieces only: Fly Art Class, Fly Fly-Fishing, Flies on a Dinner Date, Flies Kissing on a Hilltop, The Eye Doctor. The three bathroom-context pieces (Fly on the Toilet, Bathroom Line, Flies at Urinals) are catalog-only.
8. **About page hero anchor.** The Fly Art Class painting opens the `/about` page. No competing headline copy.

## Confirmed brand facts

- **Address:** 22950 Woodward Ave, Ferndale, MI 48220
- **Phone:** (248) 399-5150
- **Hours:** Monday–Sunday, 8am–3pm
- **Owners:** Kara & Gavin McMillian (founders, returned to ownership October 2024)
- **Canonical domain on print materials:** `theflytrapferndale.com` (NOT `.net` — the existing live site is on `.net` from the prior ownership era; verify ownership of `.com` and prefer it)
- **POS:** Toast (form factor confirmed at register on capture visit)
- **Three taglines:** *a finer diner* (primary), *Under Old Management* (secondary), *Catch a Buzz* (tertiary, drinks context)
- **Origin handle:** *Buzzin' since 2004*
- **Featured on:** Food Network's *Diners, Drive-Ins and Dives* (Guy Fieri)

## Open questions to leave as TODOs in the build

- Artist who painted the 17 fly paintings — name not gathered, asked next visit. Affects whether commissioned spot illustrations on the site are by the same artist or AI-placeholder.
- Domain ownership — need to confirm `theflytrapferndale.com` is owned (not just preferred on print).
- Receipt close-up confirming exact "Under Old Management" wording — not captured.
- Exterior, dining room, food, salt-and-pepper shaker collection — return-visit tasks.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + custom design tokens (color tokens sampled from photos — see `docs/07-capture-audit-and-discoveries.md`)
- **CMS:** Sanity Studio (free tier)
- **Hosting:** Vercel (free tier)
- **Analytics:** Plausible (deferred to post-handoff)
- **Commerce:** Shopify Lite or Square (deferred — stubbed during build)
- **Online ordering:** Toast (deferred — stubbed during build with "Coming Soon" + intent capture)

## What this bundle is NOT

- Not a commissioned engagement. The McMillians have not been pitched yet.
- Not a final design — Phase 1 mockups are still TBD inside the build.
- Not a complete asset set — exterior, dining room, food, and a few details still need a return visit.
