# Automated specials sync (Toast → site)

The standing menu stays hand-curated. Only the **weekly specials** — the part
that actually turns over — are pulled from Toast automatically, so nobody has to
edit the codebase each week. Toast is the source of truth.

## How it works

`.github/scripts/specials-sync.mjs` (zero deps, Node 20+ `fetch`; reuses the
tested `apps-script/lib/specials.js` block builder):

1. Auth → `GET /menus/v2/menus`.
2. Find the **"Weekly Specials"** Toast group; keep only items that carry a
   **photo** (that's how the featured dishes are distinguished from standing
   items like soup/muffins that also live in that group).
3. Download each photo into `assets/specials/toast-<slug>.jpg` (self-hosted —
   `.special-photo` is `aspect-ratio: 1/1; object-fit: cover`, so any aspect
   crops cleanly).
4. Rewrite only the `/* SPECIALS:START … END */` block of `data.js`.

`.github/workflows/specials-sync.yml` runs it a few times a day + on manual
dispatch, commits `data.js` + the images on change, and triggers the Pages
deploy.

## Fallback (no blank specials, ever)

Any auth / API / image-download error throws **before** anything is written, so
the last-good specials committed in `data.js` stay live. An empty or photo-less
Weekly Specials group is also a no-op. The standing menu is never pulled, so a
Toast outage can't affect it at all — its committed state is the fallback.

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

- **Which items show:** anything in the "Weekly Specials" group **with a photo**.
  Soup/muffins (no photo) are ignored. To feature a special, give it a photo in
  Toast; to pull it, remove the photo or move it out of the group.
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

The `flytrap-specials` skill + the tweaks-panel form publisher still write the
same block, so they remain available as a manual override / emergency path — but
they are no longer the weekly routine. Toast is.
