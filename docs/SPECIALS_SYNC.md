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
4. Read the **soup** (the **"Soup O' The Day"** item — flavor from its
   description, **Cup = the item's base price**, **Bowl = base + the "Bowl" size
   upcharge**, plus an **out-of-stock** flag). Toast delivers the "Soup Sizes"
   modifier group by *reference* (`item.modifierGroupReferences` → the payload's
   top-level `modifierGroupReferences` / `modifierOptionReferences` tables), where
   each size option's price is an upcharge on the base (Cup +$0, Bowl +$1 → Bowl
   $6 on a $5 base); inline modifier objects and legacy "Cup of Soup" / "Bowl of
   Soup" items are still handled as fallbacks. The **mini-muffin** (price +
   description as the flavor) is read from anywhere in the menu.
5. Rewrite the `/* SPECIALS:START … END */` block **and** the
   `/* EXTRAS:START … END */` block (soup + muffin) of `data.js`.

On an **out-of-stock soup day** — the Toast item flagged out of stock, with its
description set to a message like "No soup on the weekend!" — the sync writes
`available:false` and **clears the prices**, so the site passes that description
through on its own with no price hanging off it. In stock, it shows the flavor +
Cup/Bowl.

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
- **Soup:** the **"Soup O' The Day"** item — its description is the flavor, its
  base price is the Cup price, and the **"Bowl" option of the "Soup Sizes" modifier
  group** adds its upcharge to the base for the Bowl price (e.g. base $5 + $1 =
  $6). To take the soup down for the day, mark the item **out of stock** in
  Toast and set its description to the message you want shown (e.g. "No soup on the
  weekend!"); the site shows that message with no price. Legacy "Cup of Soup" /
  "Bowl of Soup" items are still read as a fallback. Overridable via
  `TOAST_SOUP_ITEM` (+ `TOAST_SOUP_CUP_ITEM`, `TOAST_SOUP_BOWL_ITEM`).
- **Muffin:** the "Muffin" item (matched loosely) for the muffin price + flavor;
  overridable via `TOAST_MUFFIN_ITEM`.
- **Vegetarian leaf:** append the 🥬 glyph to the item's Toast description (soup,
  specials, and menu items keep it inline, so it renders as the green leaf). The
  `(v)` text marker on specials is also stripped and flags the item vegetarian.

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
