# Architecture — how the site is laid out and wired

Everything below describes `main` as of 2026-08-05.

---

## 1. The 30-second version

```
Toast POS ──[GitHub Action, every 15 min]──▶ assets/menu.json  +  data.js (SPECIALS/EXTRAS blocks)
                                                     │  (committed to main)
                                                     ▼
                                        [GitHub Action] Pages deploy
                                                     ▼
              index.html ──▶ React UMD + Babel (CDN) ──▶ .jsx files transpiled in the browser
                                                     ▼
                                     one HTML page, five sections + one hash route
```

No build step exists anywhere. The files in the repo root **are** the deployed
site; the Pages workflow copies them into `_site` and uploads that.

---

## 2. File map

Every source file lives at the repo root. Subfolders are for assets and tooling only.
This flat layout is deliberate and enforced — see [AGENTS.md](../AGENTS.md).

### Runtime (these ship to the browser)

| File | What it is |
|---|---|
| `index.html` | The only HTML page. Head tags, CDN `<script>` tags, and the ordered list of local scripts. |
| `data.js` | All hand-authored content data on `window.FT_DATA`, plus the open/closed time helpers. Contains two **machine-written blocks** — see §4. |
| `tweaks-panel.jsx` | Claude Design's edit-mode panel. **Also declares the shared `const { useState, useEffect, useRef, useMemo, useCallback } = React;` that every later component relies on.** Renders nothing in production. |
| `Nav.jsx` | Sticky top nav + mobile drawer. `window.Nav`. |
| `Menu.jsx` | The menu section: specials tab, soup/muffin cards, all menu categories, sticky jump-nav with scrollspy. `window.Menu`. |
| `Sections.jsx` | `About`, `DishScroll`, `Retail` (+ `RetailCarousel`), `PressQuote`, `Press`, `Visit`, `Footer`, `DailyBuzzPage`, `BuzzBand`. |
| `App.jsx` | Root component + router + scroll effects, the `BackFly` animation, and the hero (`window.Hero = HeroWrap`). Mounts to `#root`. |
| `image-slot.js` | `<image-slot>` web component from the Claude Design starter. Not used by any current section; kept because a guardrail asserts its local patch. |
| `colors_and_type.css` | Design tokens: `@font-face` declarations, colors, type scale, spacing, radii, shadows, easing. |
| `site.css` | All layout and component styling, ~1,900 lines, organised top-to-bottom by section with `/* ==== */` banners. |
| `assets/` | Images and `menu.json`. |
| `fonts/` | Self-hosted Fraunces + Inter woff2. |
| `favicon.png`, `favicon-32.png` | Icons. |

### Tooling (excluded from the deploy)

| Path | What it is |
|---|---|
| `.github/scripts/toast-sync.mjs` | Pulls the standing menu from Toast → `assets/menu.json`. |
| `.github/scripts/specials-sync.mjs` | Pulls weekly specials + soup + muffin → the marked blocks in `data.js`, downloads special photos. |
| `.github/scripts/fixtures/*.json` | Sample Toast payloads for offline testing. |
| `.github/workflows/toast-sync.yml` | The scheduled sync job. |
| `.github/workflows/pages.yml` | Deploy to GitHub Pages. |
| `.github/workflows/guardrails.yml` | Mechanical enforcement of the stack rules. |
| `apps-script/` | Google Apps Script "publish specials from a web form" tool — the manual override path. `lib/specials.js` is **also imported by the sync script and the tests**, so it is not dead code. |
| `test/*.mjs` | `node:test` unit tests for the specials/soup block builders. |
| `.claude/` | Agent tooling: the design-sync skill and its state, launch config, archived plans/reports. |

---

## 3. How the page is assembled

`index.html` loads, in this exact order (the order is asserted by CI):

```
React UMD → ReactDOM UMD → @babel/standalone      (unpkg, with SRI hashes)
data.js → image-slot.js → tweaks-panel.jsx → Nav.jsx → Menu.jsx → Sections.jsx → App.jsx
```

Because there are no modules, **load order is the dependency graph**:

- `data.js` must be first — it defines `window.FT_DATA` and `window.ftOpenNow` /
  `window.ftTodayIdx` / `window.useOpenNow`.
- `tweaks-panel.jsx` must come before any component file — it declares the bare
  `useState` / `useEffect` / `useRef` aliases those files use unqualified.
- `App.jsx` must be last — it calls `ReactDOM.createRoot(...).render(<App />)` and
  defines `window.Hero`.

Components are plain function declarations assigned to `window.*` at the bottom of
their file. There are no `import` / `export` statements anywhere; CI fails the build
if one appears.

### Routing

There is one page and one pseudo-route:

- **`/`** → `App` renders `Hero, Menu, About, DishScroll, Retail, Press, Visit, Footer, BackFly`.
  Nav links are in-page smooth scrolls to `#menu`, `#about`, `#retail`, `#press`, `#visit`.
- **`#daily-buzz`** → `App` swaps the whole `<main>` for `DailyBuzzPage` (the rotating
  week of named dishes + soup + pastry).
  ⚠️ Nothing on the site currently links to it. `BuzzBand` — the band that used to
  link there — is defined and exported but never rendered. The page is only reachable
  by typing the hash. See [ROADMAP.md](../ROADMAP.md).

### Notable behaviours

| Behaviour | Where |
|---|---|
| Open/Closed badge, "today" row in the hours table | `data.js` → `ftOpenNow` / `ftTodayIdx` / `useOpenNow`. Hours are hard-coded Mon–Sun 8a–3p, `America/Detroit`. Fails to "Closed" if `Intl` is unavailable. |
| Hero logo shrinks and hands off to the small nav lockup on scroll | `App.jsx` scroll handler + `.hero-wordmark` / `.lockup.show` in `site.css`. |
| The red fly that follows section headers, with its dashed trail | `BackFly` in `App.jsx`. Skipped entirely under `prefers-reduced-motion`. |
| Fade-up on scroll | `.reveal` class + the `IntersectionObserver` in `App.jsx`. |
| Menu jump-nav follows the section under it | `Menu.jsx` scrollspy `IntersectionObserver` + the strip auto-scroll effect. |
| Rotating press pull-quote | `PressQuote` in `Sections.jsx`; pauses on hover/focus, no auto-advance under reduced motion. |

---

## 4. Where the content comes from

This is the single most important thing to understand before editing anything.

| Content | Lives in | Written by |
|---|---|---|
| **Standing menu** (19 categories, ~210 items) | `assets/menu.json` | **Toast sync — do not hand-edit** |
| **Weekly specials** + photos | `data.js`, between `/* SPECIALS:START */` and `/* SPECIALS:END */` | **Toast sync — do not hand-edit** |
| **Soup of the day + mini muffin** | `data.js`, between `/* EXTRAS:START */` and `/* EXTRAS:END */` | **Toast sync — do not hand-edit** |
| Menu **fallback** copy | `data.js` → `FT_DATA.menuCategories` / `menuItems` | Human. Only shown when `assets/menu.json` fails to load. |
| Which menu categories are **hidden** | `Menu.jsx` → `HIDDEN_CATEGORIES` | Human |
| Dish scroll photos | `data.js` → `FT_DATA.dishes` + `assets/dishes/` | Human |
| Retail cards, copy, prices, photos | **`Sections.jsx` → the `cards` array inside `Retail()`** (hard-coded, not in `data.js`) | Human |
| Press articles + pull-quotes | `data.js` → `FT_DATA.press` / `pressQuotes` | Human |
| Daily Buzz week | `data.js` → `FT_DATA.buzz`, `FT_DATA.pastry` | Human |
| About copy | `Sections.jsx` → `About()`, inline JSX | Human |
| Address, phone, email, hours, Toast order URL | Hard-coded in **several** places — see [CONTENT.md](CONTENT.md#contact-details-are-duplicated) | Human |

### Menu load path

```js
// Menu.jsx → useLiveMenu()
fetch("assets/menu.json")           // success → source: "live"
  .catch(() => FT_DATA.menuItems)   // failure → source: "backup", shows a small notice
```

Then `visibleMenu()` drops every category in `HIDDEN_CATEGORIES` (the bar, B-sides,
kid's menu and the whole drink list) from both the live and backup data. Toast
category ids and the legacy `data.js` ids are both listed there, so the filter works
either way.

---

## 5. Automation

### `toast-sync.yml` — content pipeline

Cron `2,17,32,47 * * * *` (≈ every 15 min, deliberately offset off the top of the
hour because GitHub drops congested sub-hourly runs), plus manual dispatch with a
`dry_run` toggle.

One job, in order:

1. `toast-sync.mjs` — auth, `GET /menus/v2/metadata` + `/menus/v2/menus`, write
   `assets/menu.json`, and stash the raw payload in a temp file.
2. `specials-sync.mjs` — reuse that payload (Toast rate-limits `/menus` to 1 req/sec,
   so a second call would 429), rewrite the `SPECIALS` and `EXTRAS` blocks of
   `data.js`, download any new special photo into `assets/specials/`.
3. Commit `assets/menu.json data.js assets/specials` **only if something changed**,
   `git pull --rebase` onto `main`, push as `flytrap-toast-bot`.
4. Explicitly dispatch the Pages workflow (a `GITHUB_TOKEN` commit doesn't trigger
   other workflows).

**Failure behaviour:** every script throws *before* writing on any auth/API/download
error, so the last good committed content stays live. A Toast outage cannot blank the
site. Without the `TOAST_*` secrets the whole workflow is a no-op.

Secrets: `TOAST_CLIENT_ID`, `TOAST_CLIENT_SECRET`, `TOAST_RESTAURANT_GUID`.
Optional: `TOAST_HOSTNAME`, `TOAST_VEG_MARKER`, `TOAST_SPECIALS_GROUP`,
`TOAST_EXCLUDE_GROUPS`.

Full detail: [TOAST_MENU_SYNC.md](TOAST_MENU_SYNC.md) and [SPECIALS_SYNC.md](SPECIALS_SYNC.md).

### `pages.yml` — deploy

On push to `main` (and manual dispatch). `rsync`s the repo root into `_site`,
excluding `.git`, `.github`, `.claude`, `docs`, `test`, `apps-script`, `AGENTS.md`,
`README.md`, `ROADMAP.md`, `LICENSE`, `.gitignore`, `.image-slots.state.json`, then
uploads and deploys. **Merging to `main` publishes immediately.**

### `guardrails.yml` — CI

Runs on every PR to `main` and every push to `main`. Pure grep/test, no install.
It fails the build on:

1. Any build-tooling file (`package.json`, `tsconfig.json`, `vite.config.*`, …),
   `node_modules/`, root `.ts`/`.tsx`, any `import`/`export` at line start, Tailwind CDN.
2. `index.html` missing a script tag or having them out of order.
3. A missing local patch: the `PATCH (flytrap-website)` marker and `touch-action`
   rules in `image-slot.js`; the `hero-cta-mobile` anchor in `App.jsx` and its
   visibility rule in `site.css`.
4. The canonical Toast ordering URL missing from `Nav.jsx` or `App.jsx`.
5. Re-introduced `special-badge` markup or an `eyebrow:` field in `data.js`.
6. A specials photo referenced in `data.js` but not committed.
7. `bolt.host` references or a committed `.env`.

> Branch protection requiring the `guardrails` check is **not** confirmed enabled.
> Turn it on so the check blocks merges instead of only reporting.

### `apps-script/` — the manual specials publisher

A Google Apps Script web app (`doGet` serves `Form.html`) that lets a non-developer
submit specials with photos. It builds the same `SPECIALS` block with
`lib/specials.js` and commits **straight to `main`** via the GitHub API. Guarded by a
passcode in Script Properties (`FORM_PASSCODE`) and a token (`GH_TOKEN`).

This is the emergency path only — Toast is the routine source. Note that anything it
writes will be overwritten by the next Toast sync run.

### Claude Design sync (legacy)

The site's visual design originated in a Claude Design project; the sync procedure
lives in `.claude/skills/design-sync/SKILL.md` with state in
`.claude/design-sync/state.json`. Only one sync (v1, 2026-06-06) was ever recorded and
the repo has diverged substantially since. **Treat this as historical.** If you don't
plan to keep using Claude Design, the `image-slot.js` / `tweaks-panel.jsx` scaffolding
and the guardrail checks that protect them can eventually be retired — but
`tweaks-panel.jsx` must not simply be deleted, because it declares the React hook
aliases the components use.

---

## 6. Styling

- `colors_and_type.css` holds the tokens. The brand palette is deliberately narrow:
  electric red `#FD0003` (`--color-flytrap-red-deep` / `-bright`), pure black
  (`--color-checker-black`), white. The terracotta/plum/butter/chartreuse tokens are
  leftovers from an earlier palette, still wired into the (hidden) tweaks panel.
- `site.css` is one long, section-ordered stylesheet. Find your section by its
  `/* ==== NAME ==== */` banner.
- Mobile-first. Breakpoints are plain `@media (min-width: 768px)` / `1024px`; the type
  scale steps down under 768px in `colors_and_type.css`.
- **Use the tokens.** Hard-coded hex in `site.css` is a review comment.
- `Caveat` (the script accent) is still loaded from Google Fonts via `@import` in
  `colors_and_type.css` — the only runtime dependency besides the React/Babel CDN.
  Fraunces and Inter are self-hosted.
