# Group 9 — Original logo + fly animation (WIP)

**Owner feedback (Sean, 7/8):**
- *"We would like the logo to keep its original form … Needs a finer diner and fly with lines under the fly trap. Please update in the header menu and anywhere else logo is present."*
- *"We do love how the fly moves around, could it fly into its place under the fly trap, next to a finer diner? Can it have trailing dots while it moves?"*

## Goal
Replace the current recolored/stripped red wordmark with the **original** logo (script "a finer diner" + fly-with-lines, black), everywhere the logo appears. The animated fly lands into its home position next to "a finer diner," leaving trailing dots.

## Assets imported in this PR (`assets/brand/`)
- `flytrap-logo-original.png` — full original wordmark (the 1003×401 art Sean re-sent; matches `LogoFiles.zip`)
- `flytrap-logo-original-72/150/300.webp` — web-optimized responsive set
- `flytrap-logo-original.ai` — vector source (extract a standalone fly glyph for the animation)
- `flytrap-logo-oval-ferndale.png` + `.ai` — checkerboard-oval + "ferndale, michigan" variant
- `flytrap-logo-orange.png` — orange variant

## Current state
- `Nav.jsx` lockup + `App.jsx` hero use `flytrap-logo-red.png` (red, "a finer diner" + fly removed) with a **separate** animated `fly-red.png`.
- Footer uses `flytrap-logo-cream.png`.
- Hero renders "a finer diner" as separate kicker text — will conflict/duplicate with the original art that already contains it. Resolve during rebuild.

## Work
1. Repoint hero, nav lockup, and footer to the original logo (light/knockout version for dark bg).
2. Reconcile the separate "a finer diner" kicker with the in-art wordmark (drop the kicker or use an art variant without it).
3. Fly animation: retarget the existing `BackFly`/`hero-fly` motion so the fly settles beside "a finer diner" under the wordmark, with a trailing-dots effect.
4. Verify at 375 / 768 / 1280; check reduced-motion.

## Dependencies / ordering
- **Entangled with Group 8b (hero rebuild)** — same hero DOM + fly. Land together or 9 → 8b.
- **Entangled with Group 6 (black bg)** — pick the logo color (black vs cream/knockout) against the final background.
- May want a knockout/cream render of the original for dark sections (derive from the `.ai`).

## Status
Draft. Assets imported and version-controlled; wiring + animation need design work alongside Groups 6 and 8b.
