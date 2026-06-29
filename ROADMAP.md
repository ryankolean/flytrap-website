# Roadmap — The Fly Trap website

Forward-looking plan for `flytrap-website`: what's done, what's next, what's blocked.
Stack conventions live in [AGENTS.md](AGENTS.md).

Driven by Kara & Gavin McMillian's feedback (via Sean McClanaghan), 2026-06-25. Work
lands as atomic single-purpose PRs → `main` auto-deploys to GitHub Pages.

---

## Shipped

_Audited 2026-06-29 against Sean's 2026-06-25 change list — every item below is live on `main`._

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
  menu (checkerboard card on black), press, dishes. Cream type, red accents. Currently the
  *muted* brand values; whether to switch to the brighter `.net` palette is a pending decision —
  see [Blocked](#blocked--waiting-on-the-client).
  menu (checkerboard card on black), press, dishes. Cream type, red accents.
- **Cut-out brand fly** — buzzing accent in the hero (`assets/brand/fly*.png`).

---

## Next up — Toast menu pull (the big one)

Pull the **menu + specials dynamically from Toast** so the website updates whenever the
restaurant updates Toast. Replaces the hand-maintained `data.js` menu and the
Instagram-based specials flow.

**Approach** (researched — only viable path):

- **Toast Standard API Access** — the restaurant self-issues its own client id/secret for
  its own data (no commercial-partner onboarding). The public `order.toasttab.com` page is
  Akamai-blocked, so scraping is out.
- **Auth/data** — client credentials → bearer token; each request sends
  `Toast-Restaurant-External-ID: <GUID>`. `GET /menus/v2/menus` returns menu groups → items
  (name, description, price, image URLs); poll `/metadata` to detect changes.
- **Architecture** — a **scheduled GitHub Action** authenticates to Toast, pulls the menu,
  regenerates `data.js`, and commits on change → Pages auto-deploys. (No backend; the site
  stays static.)
- **Covers the asks** — dynamic items + descriptions + specials; specials as the default
  menu tab; veg "green leaf" via a marker Kara adds in the Toast item description; pictures
  for select items via Toast image URLs.

**Blocked on Kara/Gavin:**
1. Enable Standard API Access in Toast → client id + secret (stored as GitHub Actions secrets).
2. The restaurant **GUID**.
3. Confirm how **specials** are represented in Toast (a dedicated menu group?) and the
   **veg-marker** convention in item descriptions.

Once Toast is the source of truth, do the coupled UI work:
- **Menu becomes the home screen**, with the fly-trap logo as its header.
- **Specials** as the default menu tab (variable count).

---

## Blocked — waiting on the client

- **Color scheme — final palette decision** (Kara, Gavin & Sean). The colors pass shipped with the
  *muted* brand values (brick red `#992F1E`, charcoal `#1A1A1A`, cream). Sean's brief cited
  theflytrapferndale.net, whose **actual** palette (pulled live) is brighter: electric red
  `#FD0003`, pure black `#000000`, white. Two labeled homepage variants are up for them to compare:
  `/retro.html` (the electric `.net` palette), `/modern.html` (current), and `/compare.html`
  (side by side). **Awaiting their pick.**
  - If **retro** wins: swap the four color tokens in `colors_and_type.css` (one PR), **and**
    generate a pure-**white** wordmark variant — the logo is a fixed cream *image*, not
    token-driven, so it won't follow the token swap.
  - Either way, delete the temporary `retro.html` / `modern.html` / `compare.html` review pages
    once chosen.
- Final **About blurb** (Kara writing) — swap into the interim copy.
- **Retail sub-header** text (Kara).

---

## Backlog / chores

- **Update the menu leaf icon.** Redesign the vegetarian `VegLeaf` SVG (`Menu.jsx`, also used
  in specials + the daily-buzz board) — the current mark is a rough placeholder path. Make it a
  cleaner, more legible leaf that reads at small sizes; keep the `aria-label="Vegetarian"` and
  the green token. Single shared component, so one change updates all three placements.
- Delete the now-unused `assets/flytrap-wordmark-*.png` (superseded by `assets/brand/flytrap-logo*.png`).
- Remove the dead `Gallery` component + `showGallery` toggle (`Sections.jsx` / `App.jsx`) — the old
  "On the walls" paintings scroll. Hidden (`showGallery: false`) so it's **not on the live site**,
  but the code lingers; the dish-scroll superseded it.
- Delete the now-unused `assets/flytrap-wordmark-*.png` (superseded by `assets/brand/flytrap-logo*.png`).
- Brand fonts **Casmira** / **Lounge Bait** are **not** web-embeddable — personal-use /
  foundry-restricted licenses. Logo *images* are fine; revisit web fonts only if a
  commercial license is purchased.
- Optional: more cut-out-fly placements (a small swarm / section flourishes) if Kara likes
  the accent.
