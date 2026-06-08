# AGENTS.md — The Fly Trap website

Stack constraints for any agent (Claude Design, Claude Code, Codex, etc.) generating code in this repo.

## Stack — HARD CONSTRAINTS

- **No build step.** No `package.json`, no `node_modules`, no bundler.
- **React via UMD `<script>` tags** in `index.html`. React 18.3.1.
- **JSX transpiled in-browser** via `@babel/standalone`. All `.jsx` files load with `<script type="text/babel" src="...">`.
- **Plain CSS only.** No Tailwind, no CSS-in-JS, no PostCSS, no Sass. Edit `colors_and_type.css` and `site.css` directly.
- **No ESM imports / exports.** Components are global functions/consts attached to `window` or referenced directly across files (load order is set in `index.html`).
- **No TypeScript.** `.jsx` only.

## File layout (do not rename, do not move)

```
index.html              # entry point, all <script> tags here
App.jsx                 # root component, mounts to #root
Nav.jsx                 # top nav
Hero.jsx                # hero section (incl. live open/closed badge)
Menu.jsx                # menu w/ tabs + veg filter
Sections.jsx            # about, retail, press, visit
data.js                 # menu + content data (plain object on window.DATA)
colors_and_type.css     # design tokens (colors, fonts, sizes)
site.css                # layout + component styles
assets/                 # images, paintings, wordmarks
fonts/                  # self-hosted Fraunces + Inter (woff2)
```

Add new sections as new `.jsx` files at root + new `<script type="text/babel">` tag in `index.html`. Do not introduce subfolders for components.

## Asset paths

- Reference assets as `assets/<file>` and fonts as `fonts/<file>` — relative paths from repo root. GitHub Pages serves the root.
- Do not rewrite to `/public/`, `/src/assets/`, or absolute URLs.

## Deploy

- `main` auto-deploys to GitHub Pages via `.github/workflows/pages.yml`. Artifact = repo root.
- Design syncs land on `design-sync` branch first. Review + PR to `main` before going live.

## Code style

- 2-space indent, no semicolons optional but match surrounding file.
- Component naming: PascalCase function components.
- Inline styles only for dynamic values; everything else in CSS.
- Use design tokens from `colors_and_type.css` (CSS custom properties), do not hardcode hex.

## What NOT to add

- Tailwind, shadcn/ui, Radix, Framer Motion, lucide-react, any npm package.
- `import`/`export` statements.
- Next.js, Vite, Webpack, Rollup, Parcel config.
- `.tsx`, `.ts`, `tsconfig.json`.
- Service workers, PWA manifest beyond what `index.html` already declares.

## Claude Design sync workflow

1. Claude Design pushes to `design-sync` branch.
2. Pull locally: `git checkout design-sync && git pull`.
3. Verify locally: `python3 -m http.server 8000` → open `http://localhost:8000`.
4. Check breakpoints: 375 / 768 / 1280. Console + network must be clean.
5. PR `design-sync` → `main`. Merge = live deploy.

The full sync procedure (fetch archive, diff, re-apply local patches, versioned
branches, Instagram specials pull) lives in `.claude/skills/design-sync/SKILL.md`.
A sync run MUST follow that skill, not an ad-hoc copy.

## Branch & PR discipline

- **Never commit site changes straight to `main`.** One logical change per
  branch → PR → merge. `main` auto-deploys, so an unreviewed push goes live.
- Design syncs go on versioned branches `design-sync-v<N>` (N from
  `.claude/design-sync/state.json`). Fixes use a descriptive `fix/...` or
  `chore/...` branch.
- Keep PRs single-purpose. Don't fold an unrelated fix into a design sync.

## Verification gate (REQUIRED before every PR)

Run the site (`python3 -m http.server 8000`, or the `flytrap` launch config on
port 5178) and confirm at **375 / 768 / 1280**:

- Console: zero errors. (The Babel-in-browser warning is expected.)
- No horizontal overflow at 375 — `document.documentElement.scrollWidth === clientWidth`.
- The changed section renders and matches intent (screenshot it).
- Hash route `#daily-buzz` still loads.

"Couldn't verify" is a valid PR note — silently shipping an unverified change is not.

## Local-only patches (survive every Claude Design sync)

A Claude Design archive overwrites repo files and will clobber site-only fixes.
Anything **outside the archive's file list**, or marked with a
`PATCH (flytrap-website)` comment, is a local patch that must be re-applied
after each sync. Before committing a sync, grep and confirm each is still present:

```bash
grep -rn "PATCH (flytrap-website)" --include="*.js" --include="*.jsx" --include="*.css"
```

Current local patches (also enforced by `.github/workflows/guardrails.yml`):

- **image-slot.js** — `touch-action` is editor-gated: `:host([data-editable])`
  keeps `touch-action:none` (drag/resize in Claude Design canvas), production
  defaults to `auto` so mobile page scroll passes through the photo.
- **Hero CTA** — mobile shows "Order Takeout" → Toast; desktop shows the
  default secondary CTA. Toggled by `.btn.hero-cta-mobile` / `.btn.hero-cta-desktop`
  in `site.css`. **The production hero is `window.Hero = HeroWrap` in `App.jsx`**
  (it shadows `Hero.jsx` via script load order) — patch BOTH files.

## Specials section rules

- Source of truth is the restaurant's weekly Instagram post (`FT_DATA.sourcePost`).
  Pull images from the carousel children, not the embed DOM — see the
  design-sync skill's "Weekly Instagram specials sync" sub-workflow.
- **No price unless it's in the Instagram caption.** `Sections.jsx` only renders
  the price block when `s.price` is set; omit the field entirely when absent.
- **No SAVORY / SWEET badges.** Savory vs sweet is positional only — `specials[0]`
  is savory, `specials[1]` is sweet. Do not add an `eyebrow` field or a
  `.special-badge` element.

## Canonical external URLs

- **Toast online ordering:** `https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue`
  Used by `Nav.jsx`, `App.jsx` (hero), and `Hero.jsx`. If it changes, update all
  three together.

## CI enforcement

`.github/workflows/guardrails.yml` mechanically checks the no-build invariants,
script load order, local-patch survival, removed-element guards, specials-photo
existence, and the canonical Toast URL on every PR to `main`. If it fails after a
sync, re-apply local patches per the design-sync skill Stage 5b before merging.
Enable branch protection on `main` requiring the `guardrails` check so it blocks
merges rather than only warning.
