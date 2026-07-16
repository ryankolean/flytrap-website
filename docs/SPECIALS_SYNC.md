# Automated specials sync (Toast → site)

The **weekly specials** plus the **soup of the day** and the **mini-muffin** —
the parts that turn over — are pulled from Toast automatically, so nobody
hand-edits the codebase. Toast is the source of truth. (The full standing menu
is pulled by a sibling script into `assets/menu.json`; see
[TOAST_MENU_SYNC.md](TOAST_MENU_SYNC.md). Both run in one workflow.)

## How it works

`.github/scripts/specials-sync.mjs` (zero deps, Node 20+ `fetch`; reuses the
tested `apps-script/lib/specials.js` block builder):

1. Auth → `GET /menus/v2/menus`.
2. Find the **"Weekly Specials"** Toast group; keep only items that carry a
   **photo** (that's how the featured dishes are distinguished from the other
   items in the group).
3. Download each photo into `assets/specials/toast-<slug>.jpg` (self-hosted —
   `.special-photo` is `aspect-ratio: 1/1; object-fit: cover`, so any aspect
   crops cleanly).
4. Read the **soup** ("Cup of Soup" + "Bowl of Soup" — each item's price plus
   their shared description as the flavor) and the **mini-muffin** (price +
   description as the flavor) from anywhere in the menu.
5. Rewrite the `/* SPECIALS:START … END */` block **and** the
   `/* EXTRAS:START … END */` block (soup + muffin) of `data.js`.

`.github/workflows/toast-sync.yml` runs this **and** the menu pull every 15
minutes (+ manual dispatch) in a single job: it makes one commit of `data.js` +
`assets/menu.json` + the images when anything changed (skips otherwise), rebases
onto `main` before pushing, and triggers the Pages deploy.

## Fallback (no blank specials, ever)

Any auth / API / image-download error throws **before** anything is written, so
the last-good specials committed in `data.js` stay live. An empty or photo-less
Weekly Specials group is also a no-op, as is a missing soup or muffin item (that
card is left exactly as it was). A Toast outage can't blank the site — every
block keeps its own last-good committed state as the fallback.

## What Toast needs (already satisfied)

- A **Standard API Access** credential with the **`menus:read`** scope. (The
  credential issued for this project already has it — verified against live
  Toast.) `stock:read` is not needed for specials.
- Secrets in the repo (Settings → Secrets and variables → Actions):
  `TOAST_CLIENT_ID`, `TOAST_CLIENT_SECRET`, `TOAST_RESTAURANT_GUID`.
- Optional overrides: `TOAST_HOSTNAME` (default `https://ws-api.toasttab.com`),
  `TOAST_VEG_MARKER` (default `(v)`), `TOAST_SPECIALS_GROUP` (default
  `Weekly Specials`).

## Conventions Kara controls in Toast

- **Which specials show:** anything in the "Weekly Specials" group **with a
  photo**. To feature a special, give it a photo in Toast; to pull it, remove the
  photo or move it out of the group.
- **Soup + muffin:** matched by item name anywhere in the menu — "Cup of Soup" /
  "Bowl of Soup" for the two soup prices + shared flavor, and the "Muffin" item
  for the muffin price + flavor. Item names are overridable at the script level
  via `TOAST_SOUP_CUP_ITEM`, `TOAST_SOUP_BOWL_ITEM`, `TOAST_MUFFIN_ITEM`.
- **Vegetarian leaf:** append the veg marker (default `(v)`) to the item's Toast
  description. It's stripped from the shown text and turns on the green leaf.

## Test it offline (no network)

```bash
TOAST_MENUS_FIXTURE=.github/scripts/fixtures/specials.sample.json \
  node .github/scripts/specials-sync.mjs
```
Rewrites the specials block from the sample payload (images skipped). `git
checkout data.js` to revert.

## Verify against live Toast (no write)

```bash
TOAST_DRY_RUN=1 TOAST_CLIENT_ID=… TOAST_CLIENT_SECRET=… TOAST_RESTAURANT_GUID=… \
  node .github/scripts/specials-sync.mjs
```
Prints the specials it would publish; writes nothing, downloads nothing.

## Relationship to the manual flow

The tweaks-panel form publisher still writes the same block, so it remains
available as a manual override / emergency path — but it is no longer the weekly
routine. Toast is. (The old Instagram-based `flytrap-specials` skill was retired
when Toast became the sole source.)
