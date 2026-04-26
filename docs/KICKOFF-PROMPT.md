# Kickoff prompt — design implementation pass

Paste-ready prompt to drop into a fresh Claude Code session inside this repo. The session that runs this prompt is referred to internally as "Claude design" — its job is to turn the placeholder page into the real single-page Fly Trap site per `docs/CLAUDE-DESIGN.md`.

Everything below the line is the prompt body. Paste from there.

---

You are picking up The Fly Trap website mid-build. The repo is a clean Next.js 15 + Tailwind CSS v4 + TypeScript scaffold sitting on a placeholder home page. Your job is to build out the single-page site per the design handoff. No Sanity, no commerce, no analytics, no live integrations. Speculative build, no client commitments.

## Read first, in this order

1. `CLAUDE.md` (root) — engagement model, hard constraints, photo handling, stack, git conventions. Do not skip.
2. `docs/CLAUDE-DESIGN.md` — primary design + content reference. Tokens, voice rules, section outline, photo rules, stack, verification checklist. This is the single source of truth.
3. `docs/PHOTO-INVENTORY.md` — every web-optimized photo in `assets/photos-web/`, where each one is meant to land per the section outline.
4. `docs/OPEN-QUESTIONS.md` — open items. Do not block on these. Leave `// TODO(open-question N)` comments inline.
5. `docs/voice-audit-report.md` — banned-word list and voice-matched sample copy.

Drill-downs you read only when a section needs them:
- `docs/01-design-document-v1.7.md` — strategic spine
- `docs/02-press-page-spec.md` — press inventory for §8
- `docs/03-seo-aeo-strategy.md` — JSON-LD, llms.txt, FAQ schema (note: llms.txt routes were stripped during scaffold prep — re-add only if a section needs them)
- `docs/04-instagram-integration-spec.md` — mock-data shape if you build a feed
- `docs/06-capture-debrief.md` — fly-painting catalog, photo handling rules
- `docs/08-capture-reconciliation.md` — resolves any disagreement between capture docs

If `docs/06` and `docs/07` disagree, trust `docs/08`. Capture date is 2026-04-25.

## Hard constraints (will fail review if broken)

- **One `/` route.** Sticky nav + anchor sections per `docs/CLAUDE-DESIGN.md` §6. No new App Router segments.
- **No emojis** in code, copy, headings, microcopy, or commits.
- **Mobile-first.** Every section must work at 375px before you scale up.
- **Voice match.** Preserve anchor phrases verbatim (`magnificent life`, `beloved and inquisitive customers`, `Buzzin' since 2004`, `a finer diner`). Banned-word list in `docs/voice-audit-report.md` is auto-fail.
- **Hero rotation discipline.** Five paintings only on the home rotation: *Fly Art Class*, *Fly Fly-Fishing*, *Flies on a Dinner Date*, *Flies Kissing on a Hilltop*, *The Eye Doctor*. Bathroom-context paintings stay catalog-only.
- **No identifiable people** in published photos without consent. Two back-bar shots have staff at POS and a customer at the counter — crop or hold; never blur.
- **Glass-reflection photos** must be presented at ≤1200px wide. Reflections are imperceptible at that size.
- **No live integrations.** Toast = "Coming Soon" + email-capture stub. Instagram = mock JSON only. Commerce = stubbed three-card "Coming Soon" + email capture.
- **noindex stays on** until handoff (gated by `NEXT_PUBLIC_ALLOW_INDEXING !== 'true'`). Do not remove.
- **No commercial commitments on Kara's behalf.** No domain registration, no Meta app, no Toast credentials, no DNS, no outreach.

## Stack and conventions

- Next.js 15 App Router, React 19, TypeScript strict.
- Tailwind CSS v4, **CSS-first** config. Tokens live in `src/app/globals.css` `@theme` block. There is no `tailwind.config.ts` — do not add one.
- pnpm only. Do not introduce npm or yarn lockfiles.
- Conventional commits, lowercase, imperative, no trailing period: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`. Direct commits to `main` (solo work). Never `--no-verify`. No Claude co-author trailer.
- Verification before any commit: `pnpm typecheck`, `pnpm lint`, `pnpm build`. All must pass.

## Wall-zone color rule (6-wall expanded model)

Defined in `docs/CLAUDE-DESIGN.md` §5. Tokens in `src/app/globals.css` `@theme`:
`cream-paper`, `butter-yellow`, `chartreuse`, `terracotta`, `plum`, `navy-slate`, `back-bar-mauve`, `flytrap-red-deep`, `flytrap-red-bright`, `checker-black`. One zone color per section. Adjacent sections do not repeat. Default footer = `navy-slate`.

Section-to-zone mapping is fixed in `docs/CLAUDE-DESIGN.md` §6 — follow it.

## Build sequence (recommended)

The placeholder `src/app/page.tsx` currently renders a wall-zone swatch grid as a smoke test. Replace it section-by-section in this order so each commit lands a working slice:

1. **Layout + sticky nav** — `src/components/layout/SiteNav.tsx`, anchor links to all sections, mobile hamburger, ARIA-correct.
2. **Section 1: Hero** — wordmark, *a finer diner*, hero painting (rotates 5), primary CTA, hours strip. Red-deep + checkerboard border.
3. **Section 2: Intro / About** — three-beat origin (founded 2004 → 2021–24 pause → returned Oct 2024), DDD badge, Kara quote on cream-paper.
4. **Section 3: The Room (gallery)** — horizontally-swipeable 5-painting gallery + 6-tile interior grid on back-bar-mauve.
5. **Section 4: Menu highlights** — 4–6 signature dishes from `docs/menu-extracted.json` on cream-paper.
6. **Section 5: Daily special** — single rotating dish on chartreuse.
7. **Section 6: Order online** — Toast "Coming Soon" + email-capture form on flytrap-red-deep.
8. **Section 7: Swat Shop** — three product cards (Sauces, Gift Cards, T-Shirts) all "Coming Soon" + email capture on chartreuse.
9. **Section 8: Press + DDD** — DDD badge, 3–4 press quotes, link-out chips on terracotta.
10. **Section 9: Visit** — address, tap-to-call phone, hours, embedded map (static iframe, no API), parking note, dog-friendly note, accessibility note, Get Directions button on butter-yellow.
11. **Section 10: FAQ** — 6–8 accordions on cream-paper.
12. **Section 11: Footer** — wordmark, real socials, credits, legal on navy-slate.

After each section: `pnpm typecheck && pnpm lint && pnpm build`, mobile preview at 375 with no horizontal overflow, commit.

## Verification (every PR / commit boundary)

- `pnpm typecheck` clean.
- `pnpm lint` clean (jsx-a11y rules already wired).
- `pnpm build` green.
- Preview at 375 / 768 / 1280: `document.documentElement.scrollWidth === clientWidth` at 375.
- `preview_console_logs` and `preview_logs` at `error` level both empty.
- Screenshot of new section at each breakpoint.
- For motion: `prefers-reduced-motion` honored (already wired in `globals.css`).
- For images: real `<Image>` from `next/image` with explicit `alt`. Decorative-only images get `alt=""`.

## Things that are already done — do not redo

- Tailwind v4 CSS-first migration (no `tailwind.config.ts`, do not re-add).
- Sanity strip (no `@sanity/*` deps, no `/studio` route, no `src/sanity/`).
- Multi-route strip (no `/about`, `/menu`, etc. — single-page only).
- noindex header + Vercel config.
- robots.txt + sitemap.xml (single home route).
- Skip-to-main link in `RootLayout`.
- Wall-zone tokens locked in `src/app/globals.css`.

## Photo asset locations

- Web-optimized photos: `assets/photos-web/` (catalog in `docs/PHOTO-INVENTORY.md`).
- Originals: private repo `ryankolean/flytrap-website-assets-archive`. Do not re-add to this repo.

## Open questions handling

`docs/OPEN-QUESTIONS.md` lists open items (e.g. `.com` domain ownership, wordmark vector, real menu prices). Do not block on any. Leave inline `// TODO(open-question N): <one-line summary>` and ship the section with placeholder copy that voice-matches the rest of the site.

## What to deliver

A working single-page site at `/`, all 12 sections built per the outline, all verification checks green, committed in conventional-commit increments to `main`. Do not push to remote unless explicitly asked. Do not contact, message, or pitch Kara. Do not register a domain or sign up for any paid service.

Start by reading `CLAUDE.md` and `docs/CLAUDE-DESIGN.md` end-to-end. Then build.

---

End of paste. Anything below this line is for Ryan, not the design session.

## Notes for Ryan

- This prompt is intentionally redundant with `CLAUDE.md` and `docs/CLAUDE-DESIGN.md`. Redundancy is the point — a fresh session loads the prompt body before any docs, so the constraints land twice.
- If you want the session to skip a particular section (e.g. shop), strike the line from the build sequence before pasting.
- If you want commits batched per major chunk instead of per section, say so in the prompt before pasting.
- The "design Claude" session can spawn its own subagents (Explore for codebase questions, code-architect for component design). Don't pre-script that — let the session decide.
