# Roadmap — The Fly Trap website

Forward-looking plan for `flytrap-website`: what's done, what's next, what's blocked.
Stack conventions live in [AGENTS.md](AGENTS.md).

Driven by Kara & Gavin McMillian's feedback (via Sean McClanaghan), 2026-06-25. Work
lands as atomic single-purpose PRs → `main` auto-deploys to GitHub Pages.

---

## Shipped

_Audited 2026-07-02 against `origin/main` (through #53) and Sean's 2026-06-25 change
list — every item below is live on `main`._

- **Hero** — removed the "American comfort food with a global cooks' table" tagline.
- **Menu** — removed the "What's cooking" intro; veg toggle → green-**leaf** indicator
  (site-wide: menu, specials, daily-buzz board).
- **About** — removed the "Under old management" blurb; interim copy pulled verbatim from
  theflytrapferndale.net (see [Blocked](#blocked--waiting-on-the-client)).
- **On the walls** — removed the paintings gallery; replaced with a **key-dishes scroll**
  with prev/next nav (`FT_DATA.dishes`, `assets/dishes/`).
- **Retail** — full copy refresh: SWAT! Sauces (3 named sauces), Wham! Jam, Gift Cards,
  Other Fly Trap Swag.
- **Visit** — municipal-lot parking copy + `dine@theflytrapferndale.com`.
- **Open/closed badge** — now computed from restaurant hours (America/Detroit, 8a–3p)
  instead of a hard-coded "Open now" (`window.ftOpenNow` / `useOpenNow` in `data.js`).
- **Official logo** — adopted across nav / hero / footer (`assets/brand/flytrap-logo*.png`,
  isolated descender-safe from Sean's logo).
- **Bold red/black colors pass** — site-wide. Red: hero, about, retail. Black: specials,
  menu (checkerboard card on black), press, dishes. Cream type, red accents. Originally shipped
  with the *muted* brand values; superseded by the retro palette (below).
- **Retro palette — RESOLVED (retro chosen).** Kara, Gavin & Sean picked the electric
  theflytrapferndale.net palette over the muted values. Swapped the five color tokens in
  `colors_and_type.css` (electric red `#FD0003`, pure black `#000000`, white), updated the
  `theme-color` meta in `index.html`, and recolored the fixed cream logo + fly images to pure
  white preserving alpha (`assets/brand/flytrap-logo-cream.png`, `assets/brand/fly-cream.png`).
  The temporary `retro.html` / `modern.html` / `compare.html` comparison pages are deleted.
- **Cut-out brand fly** — buzzing accent in the hero (`assets/brand/fly*.png`).
- **Menu leaf icon** — redesigned the `VegLeaf` SVG into a cleaner, small-size-legible
  leaf-with-stem; shared component, so menu + specials + daily-buzz board all updated (#40).
- **Dead-code / asset cleanup** — removed the dead `Gallery` component + `showGallery` toggle
  (#41); deleted the six unused `assets/flytrap-wordmark-*.png` (#42).
- **Specials → default menu tab** — folded the specials into `Menu.jsx` as a first-class
  `"specials"` tab that opens active (`useState(SPECIALS_TAB)`); the standalone specials
  section is gone (#48). This is the first half of the Toast "coupled UI work" below — done
  ahead of the Toast pull.
- **Retro favicon** — recolored the favicon to electric red to match the palette (#49).
- **Hero invert** — flipped the hero to a white field with electric-red branding (wordmark,
  kicker, fly, outline CTAs), red nav with a scroll-fade-in wordmark; solid-red "See the Menu"
  stays as the accent CTA. Added `assets/brand/flytrap-logo-red.png` + `fly-red.png` (#50).
- **Retail header font** — matched the Retail section header to the menu section headers (#51).
- **About simplify** — dropped the marble photo, stats, and divider (#52).
- **Dishes eyebrow** — removed the "From the griddle" eyebrow from the key-dishes section (#53).

---

## Toast integration — RESOLVED (specials-only automation, LIVE)

Investigated the full **menu + specials** pull from Toast. **Decision: automate only
the specials.** Toast's full menu is ~245 items — the whole bar, Kid's menu,
protein-variant duplicates, and `$0` POS artifacts (`***ADD ON***`, `NO BEV`, …) — so
auto-regenerating the site menu from it would replace a clean, curated menu with noise
for near-zero benefit (the standing menu rarely changes). The full-menu pipeline was
built, then dropped once the live data made the tradeoff obvious (PR #56, closed).

**Shipped & live** — specials auto-sync (#65 + first sync `211ea66`):

- A **scheduled GitHub Action** (a few times/day) authenticates with Toast Standard API
  Access (`menus:read`), reads the **"Weekly Specials"** menu group, keeps the items that
  carry a **photo** (that's how the featured dishes are told apart from soup/muffins in the
  same group), downloads each photo into `assets/specials/`, and rewrites only the
  `/* SPECIALS:START…END */` block of `data.js` via the tested
  `apps-script/lib/specials.js`. Commits on change → Pages redeploys. **No weekly
  hand-edit; Toast is the source of truth.**
- **Veg by meat-detection, not a tag.** A special is vegetarian unless its Toast
  description names a meat/seafood (English + Spanish word list, word-boundary matched).
  The `(v)` marker stays as an override for mock-meat ("tempeh bacon"). Unit-tested.
- **Fallback:** any auth/API/download error writes nothing, so the last-good specials stay
  live. The standing menu is never pulled — a Toast outage cannot touch it.
- Setup + the conventions Kara controls in Toast: [docs/SPECIALS_SYNC.md](docs/SPECIALS_SYNC.md).

**The standing menu stays hand-curated** — deliberately not pulled from Toast.

**Optional, not scheduled:**
- **Menu-as-home-screen** with the fly-trap logo as its header (the specials tab already
  ships as the default menu tab — #48).

---

## Blocked — waiting on the client

- Final **About blurb** (Kara writing) — swap into the interim copy.
- **Retail sub-header** text (Kara).

---

## Backlog / chores

- **Remove the dead rotating-paintings `Hero.jsx`.** It's loaded in `index.html` but never
  renders — `App.jsx` defines `window.Hero = HeroWrap`, which shadows it via script load order.
  It's the last consumer of `FT_DATA.paintings` + `assets/paintings/` (the Gallery that also
  used them is gone, #41). Delete `Hero.jsx` + its `<script>` tag, then drop the `paintings`
  array from `data.js` and the `assets/paintings/` images. Preserve the hero CTA mobile/desktop
  patch (lives in `App.jsx`'s `HeroWrap`); check `guardrails.yml` doesn't assert `Hero.jsx`.
- Brand fonts **Casmira** / **Lounge Bait** are **not** web-embeddable — personal-use /
  foundry-restricted licenses. Logo *images* are fine; revisit web fonts only if a
  commercial license is purchased.
- Optional: more cut-out-fly placements (a small swarm / section flourishes) if Kara likes
  the accent.
