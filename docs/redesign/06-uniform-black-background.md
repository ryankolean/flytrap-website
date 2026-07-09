# Group 6 — Uniform black background (WIP)

**Owner feedback (Sean, 7/8):** *"Let's make the background color uniform black for all the different sections. Absolutely understand your logic of creating division but think it might be better uniform."*

## Goal
Every section shares one black background; drop the alternating light/dark zone scheme.

## Current state (audit)
Backgrounds today are mixed:
- Hero — white field (`background: var(--color-bg-white)`, inline in `App.jsx`)
- About — white (`.about`, plus `aboutZone: "bg-white"` inline override in `App.jsx`)
- Menu — black (`.menu-section-bg`)
- Dishes — black (`.dishes`)
- Press — black (`pressZone: "checker-black"`)
- Retail, Visit — inherit body canvas (white, `--color-cream-paper`)
- Body canvas — white (`--color-cream-paper`)

## Work
1. `site.css` — body canvas + `.about`, `.retail`, `.visit` → `--color-checker-black`.
2. `App.jsx` — `TWEAK_DEFAULTS.aboutZone` `"bg-white"` → `"checker-black"` so the JS zone override stops repainting About white.
3. **Contrast pass (the real work):** every section that was dark-on-white flips to light-on-black — About title/lede (currently `--color-flytrap-red-deep`), Retail card bodies, Visit cards + hours table, any `color: var(--color-checker-black)` text. Audit all of `site.css`.
4. Verify at 375 / 768 / 1280, light + dark, screenshot each section. `scrollWidth === clientWidth` at 375.

## Dependencies / ordering
- **Entangled with Group 8 (hero rebuild):** the hero background is decided there. Land Group 8 first, or scope this PR to non-hero sections and let 8 own the hero.
- Touches `site.css` broadly — land **after** Group 7 (which also edits menu CSS) to avoid conflicts.

## Status
Draft. Needs the contrast pass + full visual QA before merge.
