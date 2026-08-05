# Roadmap — The Fly Trap website

What's done, what's in flight, what's blocked, what's worth doing next.
Reconciled against `origin/main` and the merged-PR history on **2026-08-05**.

Stack rules: [AGENTS.md](AGENTS.md) · Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

Work lands as single-purpose PRs → merge to `main` → auto-deploy to GitHub Pages.
Client direction comes from Kara & Gavin McMillian via Sean McClanaghan.

---

## The one thing that matters most

**The site is not live on its own domain.** `theflytrapferndale.com` still serves the
old legacy site. Merging PR #114 and doing the DNS cutover is the gate on everything
else being worth doing. See [docs/SEO.md](docs/SEO.md).

---

## In flight

- **PR [#114](https://github.com/ryankolean/flytrap-website/pull/114) — SEO / AEO
  foundations.** JSON-LD, Open Graph, `noscript` content, `h1`, canonical,
  `robots.txt` / `sitemap.xml` / `llms.txt`, `CNAME`, `404.html`, production React
  build. Opened 2026-07-19; needs a re-verify against current `main` before merge.
  Blocks the domain cutover.

## Blocked — waiting on the client

- **Retail sub-header** copy (Kara).

---

## Shipped

Condensed. Full history is in the merged-PR list (`gh pr list --state merged`).

**Content pipeline — Toast is the source of truth**
- Weekly specials auto-sync from the Toast "Weekly Specials" group, photos downloaded
  and committed (#65). Vegetarian detected from the 🥬 glyph, with `(v)` as an
  override (#80). Specials publish with or without a photo (#73), and show a price
  only when Toast has one (#95).
- Full standing menu pulled into `assets/menu.json` with a committed fallback in
  `data.js` (#94). Bar, B-sides and kid's menu hidden from the site (#97).
- Soup of the day and mini-muffin pulled as "extras" cards (#91, #104, #105),
  including Cup/Bowl pricing resolved through Toast's referenced size modifiers
  (#103, #118, #119) and a hide-when-unavailable state (#115).
- Menu + specials syncs merged into one 15-minute workflow producing one commit
  (#106), with the `/menus` rate-limit fixed (#111) and the cron offset off the top of
  the hour (#117).
- `guardrails.yml` added: mechanical CI enforcement of the no-build stack, script
  order, local patches, and the canonical Toast URL.

**Design and content**
- Retro palette adopted — electric red `#FD0003`, black, white (#47), with matching
  favicon (#49) and inverted hero (#50).
- Original-form logo across nav, hero and footer; scroll-linked hero shrink and
  hand-off to the nav lockup (#83).
- The brand fly: hero accent (#36), scroll-linked flight (#54), per-header accompaniment
  (#60), naturalistic flight path (#112), and its dashed trail (#108, #110).
- Specials folded into the menu as the default tab; standalone section removed (#48).
- Menu scrolls through all sections with a sticky jump-nav and scrollspy (#76) that
  slides to follow the active section (#85).
- About rewritten to the diner's own origin story (#70) with an editorial treatment
  (#88, #89, #93).
- Press section rebuilt with verified live outlet links and rotating pull-quotes
  (#86, #90, #100).
- Key-dishes scroll replaced the removed paintings gallery; retail copy refresh with
  real SWAT!/Wham! Jam product photos (#102) and a carousel for multi-option cards
  (#61).
- Visit section: municipal-lot parking copy, contact email, icons on contact links
  (#92). Open/Closed badge and "today" highlight computed from `America/Detroit` (#62).
- QA pass: dead code, route bug, accessibility — 24 verified findings (#84).
- Dead code removed: the rotating-paintings `Hero.jsx` (#44), the `Gallery` component
  (#41), unused wordmark assets (#42).

---

## Backlog

### Cleanup (safe, mechanical)

- **Prune orphaned specials photos.** `assets/specials/` holds 21 images; 1 is
  referenced. The sync downloads but never prunes. Deleting the unreferenced ones is
  safe — the guardrail only checks that referenced photos exist, not the reverse.
  Consider adding a prune step to `specials-sync.mjs` so it doesn't grow again.
- **Delete unused brand and detail assets** — six unreferenced files in
  `assets/brand/`, six in `assets/details/`.
- **Re-export the retail photos as JPEG.** `swat-hot-sauce.png` (2.7 MB) and
  `wham-jam.png` (1.2 MB) are photographs saved as PNG; ~3.5 MB of page weight for no
  visual gain.
- **Remove the dead `BuzzBand` component and the unused `goBuzz` handler** — or wire
  them back up (see below).

### Decisions someone needs to make

- **The `#daily-buzz` page is unreachable.** `DailyBuzzPage` renders a full week of
  named dishes, but nothing links to it since `BuzzBand` stopped being rendered, and
  its content (`FT_DATA.buzz`) is hand-written placeholder-ish copy that nobody
  maintains. Either link it and assign an owner, or delete the page, the `buzz` data
  and the `#daily-buzz` route. Right now it is maintenance debt with no traffic.
- **Menu curation.** The site currently shows everything Toast returns minus
  `HIDDEN_CATEGORIES`. The cleaner long-term answer is a dedicated **"Website Menu"**
  group in Toast with `TOAST_EXCLUDE_GROUPS` set to everything else — then Kara
  controls the site menu directly. See
  [docs/TOAST_MENU_SYNC.md](docs/TOAST_MENU_SYNC.md#curation-tbd-for-kara--sean).
- **Retire the Claude Design tooling?** Only one sync (v1, 2026-06-06) ever ran and
  the repo has diverged a long way since. If it isn't coming back, `image-slot.js`,
  the design-sync skill, and the two guardrail checks that protect the `image-slot`
  patch can go. `tweaks-panel.jsx` must **not** simply be deleted — it declares the
  React hook aliases every component file uses; move those to `data.js` first.
- **Enable branch protection on `main`** requiring the `guardrails` check, so it
  blocks merges rather than only reporting. `main` auto-deploys; nothing currently
  stops a bad direct push.

### Improvements

- **Refresh the menu fallback in `data.js`** from a recent `assets/menu.json`. It's
  the emergency copy and it drifts. Worth doing a couple of times a year.
- **Self-host `Caveat`, or drop it.** It is the last third-party font, pulled from
  Google Fonts by an `@import` in `colors_and_type.css` — a render-blocking request
  for a couple of decorative lines of text.
- **Per-day hours.** `ftOpenNow()` hard-codes a single 8a–3p window for all seven
  days. If hours ever vary by day, it needs a table.
- Optional: more cut-out-fly placements (a small swarm, section flourishes) if Kara
  likes the accent.

### Not doing

- **Brand fonts Casmira / Lounge Bait as web fonts** — the licences are personal-use /
  foundry-restricted and not web-embeddable. Logo *images* are fine. Revisit only if a
  commercial licence is purchased.
- **Auto-generating the site menu from raw Toast without curation** — investigated and
  rejected (PR #56, closed): Toast's ~245 items include the whole bar, the kid's menu,
  protein-variant duplicates and `$0` POS artifacts. The current approach (pull
  everything, hide categories in code) is the compromise; see "Menu curation" above
  for the better end state.
