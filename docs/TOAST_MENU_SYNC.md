# Full menu sync (Toast → site)

The **standing menu** is pulled from Toast automatically, the same way the weekly
specials are. Toast is the source of truth; nobody hand-edits the menu each time
it changes.

> Curation is intentionally **deferred**. Right now we pull *everything* Toast
> returns (minus the retail + specials groups, which are shown elsewhere) — no
> filtering of `$0` add-ons, modifiers, or the kid's menu. Once Kara & Sean see
> the full pull on the site they'll decide how they want it curated (a dedicated
> "Website Menu" group in Toast, or code-side filters). See "Curation, TBD" below.

## How it works

```
Toast  ──[GitHub Action, every 15 min]──▶  assets/menu.json (committed)
                                              │
                                   page load: fetch(assets/menu.json)
                                              │  success → live menu
                                              └─ fail  → FT_DATA.menuItems (saved backup in data.js)
```

- **`.github/scripts/toast-sync.mjs`** (zero deps, Node 20+ `fetch`):
  1. Auth → `GET /menus/v2/metadata` (for `lastUpdated`) + `GET /menus/v2/menus`.
  2. Walk every menu group (except the excluded ones) into `{ categories, items }`
     and write **`assets/menu.json`** — only when the content actually changed, so
     most runs commit nothing.
- **`.github/workflows/toast-sync.yml`** runs this **and** the specials / soup /
  muffin pull every 15 minutes (+ manual dispatch) in one job. It makes a single
  commit of `assets/menu.json` (plus `data.js` + specials images) when anything
  changed, rebases onto `main` before pushing, and triggers the Pages deploy.
- **The site** (`Menu.jsx` → `useLiveMenu`) fetches `assets/menu.json` at page
  load and renders it. The browser never talks to Toast directly.

The site shows exactly what is on the current Toast menu. **Stock/86 status is not
reflected** — out-of-stock items are neither hidden nor greyed. Only the published
menu structure matters; an item removed from the Toast menu stops appearing on the
next sync.

## The backup (menu is never blank)

Two independent layers:

1. **Sync fails** (auth/API/network error, or Toast returns an empty menu): the
   script throws **before writing**, so the last-good `assets/menu.json` already
   committed stays live. `buildBase` refuses to emit an empty menu.
2. **Page-load fetch of `assets/menu.json` fails** (missing file, bad deploy,
   offline): `useLiveMenu` falls back to the hand-curated menu inlined in
   `data.js` (`FT_DATA.menuCategories` / `FT_DATA.menuItems`) and shows a small
   "Showing our saved menu" note. This inlined copy is the durable saved version —
   it is never touched by the sync, so it can't be corrupted by a bad pull.

Keep `FT_DATA.menuItems` in `data.js` reasonably current (refresh it from a good
`assets/menu.json` now and then) so the emergency fallback isn't stale.

## What Toast needs

- A **Standard API Access** credential with the **`menus:read`** scope.
- Repo secrets (Settings → Secrets and variables → Actions):
  `TOAST_CLIENT_ID`, `TOAST_CLIENT_SECRET`, `TOAST_RESTAURANT_GUID`.
- Optional overrides: `TOAST_HOSTNAME` (default `https://ws-api.toasttab.com`),
  `TOAST_VEG_MARKER` (default `(v)`), `TOAST_EXCLUDE_GROUPS`.

Until the secrets are set the workflow is a **no-op** — safe to merge first.

## Conventions Kara controls in Toast

- **Vegetarian:** append the veg marker (default `(v)`) to the item's Toast
  description. It's stripped from the shown text and turns on the green leaf.
- **Excluded groups:** `TOAST_EXCLUDE_GROUPS` (default
  `Weekly Specials,SWAT! Sauce,WHAM! Jam,Fly Trap Swag`) — the specials + retail
  groups, shown in their own sections.

## Curation, TBD (for Kara & Sean)

The raw Toast menu is large and includes POS-only entries (`$0` add-ons,
modifiers, kid's menu, protein-variant duplicates). We ship the full pull as-is
for now. Options to clean it up, once they decide:

- **In Toast (recommended):** maintain a dedicated "Website Menu" group and set
  `TOAST_EXCLUDE_GROUPS` to everything else — what Kara puts there is what shows.
- **In code:** add filters to `toast-sync.mjs` (drop `price == 0`, drop
  modifier/add-on groups, dedupe variants).

## Test / verify

Offline (no network), against the sample fixtures:

```bash
TOAST_MENUS_FIXTURE=.github/scripts/fixtures/menus.sample.json \
node .github/scripts/toast-sync.mjs
# rewrites assets/menu.json from the sample payload; `git checkout assets/menu.json` to revert
```

Against live Toast without writing (needs the secrets exported locally):

```bash
TOAST_DRY_RUN=1 node .github/scripts/toast-sync.mjs   # logs category/item/oos counts, writes nothing
TOAST_DUMP=/tmp/menu-dump.md node .github/scripts/toast-sync.mjs   # full listing incl. excluded groups, for review
```
