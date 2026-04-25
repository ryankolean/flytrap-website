# CLAUDE.md — flytrap-website

Speculative website build for The Fly Trap, a diner at 22950 Woodward Ave, Ferndale, MI. Owners: Kara & Gavin McMillian.

## Engagement model: build-then-offer

Summit Software Solutions is building this site speculatively. **No client commitments have been made.** No pitch sent. The finished product will be offered to Kara post-handoff with three commercial options (paid, portfolio/gift, graceful decline) per design doc §16.

While building: do not contact, message, or pitch Kara in any form.

## Source of truth

Read in this order before touching code:

1. `docs/README.md` — bundle entry point (originally `flytrap-website-context-bundle/README.md`)
2. `docs/01-design-document-v1.7.md` — strategic spine
3. `docs/08-capture-reconciliation.md` — resolves conflicts between the two capture analyses
4. `docs/07-capture-audit-and-discoveries.md` — color tokens, three-zone color model
5. `docs/06-capture-debrief.md` — fly-painting catalog, photo handling rules
6. `docs/04-instagram-integration-spec.md` — Phase A mock-data shape
7. `docs/03-seo-aeo-strategy.md` — JSON-LD, llms.txt, FAQ
8. `docs/02-press-page-spec.md` — press inventory

If `06` and `07` disagree, trust `08-capture-reconciliation.md`. Capture date is 2026-04-25 (one debrief doc has 04-26 — that is wrong).

## Hard constraints (non-negotiable)

1. **No live integrations.** Instagram = mock data only (Phase A per `docs/04`). Toast = "Coming Soon" stub with email intent-capture. Commerce = stubbed.
2. **No paid services committed.** Vercel free tier, Sanity free tier only. No EmbedSocial, Curator, Plausible, or analogous until handoff.
3. **No commercial commitments on Kara's behalf.** No domain registration, no Meta app live, no Toast credentials, no DNS changes.
4. **No emojis on the site or in code.** Headings, copy, microcopy, and commits stay text-only.
5. **Voice match.** Existing About-page register: "magnificent life," "beloved and inquisitive customers," "Buzzin' since 2004." Preserve verbatim where it exists.
6. **Mobile-first.** Every layout decision starts on a 375px viewport.
7. **Hero rotation discipline.** Five paintings only on the home-page rotation: Fly Art Class, Fly Fly-Fishing, Flies on a Dinner Date, Flies Kissing on a Hilltop, The Eye Doctor. Bathroom-context pieces (Fly on the Toilet, Bathroom Line, Flies at Urinals) are catalog-only on `/about`.
8. **About-page anchor.** Fly Art Class painting opens `/about`. No competing headline copy.

## Photo handling

- Web-optimized photos in `assets/photos-web/` ship in this repo.
- Full-resolution originals live in [ryankolean/flytrap-website-assets-archive](https://github.com/ryankolean/flytrap-website-assets-archive) (private). Do not re-add to this repo.
- **Never publish photos with identifiable people without consent.** Two back-bar shots include a staff member at the POS and a customer at the counter — crop or hold those until consent post-handoff. See `docs/06-capture-debrief.md` "Photo handling rules."

## Stack (locked)

- Next.js 15 (App Router)
- Tailwind CSS with design tokens sampled from `docs/07-capture-audit-and-discoveries.md`
- Sanity Studio (CMS, free tier)
- Vercel (hosting, free tier)
- TypeScript

Deferred to post-handoff: Plausible analytics, paid Sanity tier, Shopify Lite/Square, Toast integration, Meta OAuth, professional food photography, commissioned spot illustrations.

## Brand facts (confirmed)

- Address: 22950 Woodward Ave, Ferndale, MI 48220
- Phone: (248) 399-5150
- Hours: Mon–Sun, 8am–3pm
- Owners: Kara & Gavin McMillian (returned to ownership October 2024)
- Canonical print domain: `theflytrapferndale.com` (live `.net` is from prior ownership era — verify ownership of `.com` and prefer it; flag if unowned)
- POS: Toast
- Taglines: *a finer diner* (primary), *Under Old Management* (secondary), *Catch a Buzz* (tertiary)
- Origin handle: *Buzzin' since 2004*
- Featured on: Food Network's *Diners, Drive-Ins and Dives*

## Open questions

Tracked in `docs/OPEN-QUESTIONS.md`. Do not block the build on these — leave TODOs in code.

## Git conventions

- Direct commits to `main` (solo work).
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`. Imperative, lowercase, no trailing period.
- Never `--no-verify`, never force-push to `main`, never commit secrets.
- No Claude co-author trailer unless explicitly asked.

## Dispatch

Plans live in `.claude/dispatch/plans/`, agent reports in `.claude/dispatch/reports/`. Notifications via ntfy.sh per Ryan's standing convention.
