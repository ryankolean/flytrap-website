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
