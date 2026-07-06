---
name: flytrap-specials
description: Use when updating The Fly Trap website's weekly specials in ~/flytrap-website — triggers include "update flytrap specials", "new flytrap specials", "pull this week's specials", the Toast menu (order.toasttab.com/online/the-fly-trap-ferndale-...), or a fresh @theflytrapferndale instagram.com/p/ link. Pulls the plated specials (name, description, price, photo) from the Toast "Weekly Specials" menu group into the Specials section. Menu/retail/press stay hand-edited.
---

# Fly Trap weekly specials

Pull this week's plated special(s) from The Fly Trap's **Toast online-ordering
menu** — the kitchen's own system of record — swap them into the site between the
`SPECIALS` markers, verify, and open a PR. The number of specials is whatever the
"Weekly Specials" group has — **one, two, or more.**

Toast is the source for **everything**: dish **name**, **description**, **price**,
and **photo**. (Instagram is kept only as an image fallback — see the appendix — for
when a Toast dish has no photo or the photo is unusable.)

There are two ways specials reach the site, both writing the same `data.js` block
between the same markers:

1. **This skill** — the Toast pull (you, on demand).
2. **The direct-submit form** — a deployed Google Apps Script web app the Fly Trap
   team fills in; its publisher splices the same marker region. (Path B of
   `docs/superpowers/specs/2026-06-23-flytrap-specials-automation-design.md`.)

## Overview — non-negotiables

- **Write BETWEEN the markers.** `data.js` has `/* SPECIALS:START */` … `/*
  SPECIALS:END */` around the specials block. Replace **only** the region between
  (and including) those markers, and **keep the markers in the output.** Stripping
  them silently breaks the direct-submit form's publisher (`spliceSpecials` throws
  "missing markers"). This is the #1 rule.
- **Plated specials only — omit soup and muffins.** The Toast "Weekly Specials"
  group also lists standing add-ons: **Mini Muffins**, **Bowl/Cup of Soup**. These
  are **not** site specials. The site's soup + pastry live in their own hand-edited
  `data.js` fields — leave them alone. Pull only the composed plated dishes (the
  items that have both a photo and a descriptive sentence). The extraction snippet
  keys off the dish photo, so soup/muffins (no photo) fall out automatically.
- **Any count.** One plated special or several — `Sections.jsx` maps the array, so
  1 / 2 / 3+ all render; an empty array renders "No specials running this week." Do
  not force two.
- **Positional, not labeled.** `specials[i]` = Toast card i (top-to-bottom). No
  savory/sweet, no badges, no `eyebrow` field — identity is array order. IDs are
  `special-1`, `special-2`, … Photos are `week-<date>-<N>.jpg` (1-based).
- **Price comes from Toast — store it without the `$`.** Toast lists a price on
  every plated dish; put it in the `price` field **without** the leading `$`
  (`Sections.jsx` renders `${s.price}`, so a stored `$` doubles it). If a dish
  genuinely has no price, omit the field entirely — not `""`, not `null`.
- **Don't hand-set the expiry date.** `Sections.jsx` computes the "Here through
  <date>, then gone" line as the end of the current week (Sunday) at render time —
  always current, no manual entry. `weekOf` in `data.js` is optional / informational
  only; it no longer drives the displayed date.
- **Never blank the section.** If any step fails, leave last week's specials live and
  stop — a half-update must never ship.
- **Branch → PR. Never commit to `main`** (it auto-deploys). Read `AGENTS.md`.

## Prerequisites

- `cwd` = `~/flytrap-website`, working tree clean.
- **Claude in Chrome connected** (`list_connected_browsers` non-empty) — **required.**
  Toast's menu sits behind a Cloudflare "Just a moment…" bot challenge, so WebFetch
  and curl **cannot** read the menu HTML (both get HTTP 403). Only a real logged-out
  browser session passes the challenge. (The image CDN itself is plain — curl reaches
  it once you have the signed URLs from the page.)

## Input

Optional: nothing needed — the Toast URL is fixed
(`order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue`). Confirm
the pulled dishes are **newer than what's live** before editing: compare against the
current `specials[]` names in `data.js`. If Toast shows the same dishes already live,
stop — nothing to update.

## Procedure

### Stage 0 — Preflight + branch
```bash
cd ~/flytrap-website
git status --short            # must be empty; if not, STOP and ask
git checkout main && git pull --ff-only
git checkout -b chore/specials-$(date +%F)
```

### Stage 1 — Open the Toast menu in Chrome (Cloudflare wall)
Navigate a tab to the Toast URL, then **wait for the challenge to clear**: the tab
title flips from "Just a moment…" to **"Order Online"** after ~5–10s. If
`get_page_text` / `screenshot` returns "Page still loading", `wait` 5s and retry —
don't give up on the first timeout.
```
https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue
```
Confirm the page is live by reading the tab context (title == "Order Online").

### Stage 2 — Extract the "Weekly Specials" group
Run this in the Toast tab (Chrome `javascript_tool`). It finds the "Weekly Specials"
section, keys off each **dish photo**, and returns one record per plated special —
`{ name, price (no $), desc, img }`. Soup/muffins have no photo, so they're excluded:
```js
(function(){
  const h=[...document.querySelectorAll('h1,h2,h3,h4,[role=heading]')]
    .find(e=>e.textContent.trim()==='Weekly Specials');
  if(!h) throw 'no Weekly Specials group';
  let sec=h; for(let i=0;i<6;i++){ if(sec.parentElement){ sec=sec.parentElement; if(sec.tagName==='SECTION') break; } }
  return [...sec.querySelectorAll('img')].filter(im=>/cloudfront/.test(im.src)).map(im=>{
    let card=im; for(let i=0;i<6;i++){ card=card.parentElement||card;
      if(card.querySelector('h1,h2,h3,h4,[role=heading]') && /\$\d/.test(card.innerText)) break; }
    const name=(card.querySelector('h1,h2,h3,h4,[role=heading]')||{}).textContent?.trim();
    const priceM=card.innerText.match(/\$\s?(\d+(?:\.\d{2})?)/);
    const lines=card.innerText.split('\n').map(s=>s.trim()).filter(Boolean)
      .filter(l=>l!==name && !/^\$/.test(l) && !/out of stock/i.test(l));
    const desc=lines.sort((a,b)=>b.length-a.length)[0]||'';
    return {name, price:priceM?priceM[1]:null, desc, img:im.src};
  });
})();
```
The `img` URLs are signed CloudFront links (`d1w7312wesee68.cloudfront.net/…`),
served at `resize:fit:720:720` — save them verbatim for Stage 4.

### Stage 3 — Parse into N specials
Per returned record:
- **name**: the dish name. Keep curly apostrophes; sentence-case if the menu shouts.
- **desc**: the returned `desc` line (the composed-dish sentence). Trim any trailing
  status text.
- **price**: the returned `price`, stored **without** `$` (e.g. `"12.95"`). Omit only
  if genuinely absent.
- **veg**: `true` if no meat/fish (eggs/dairy fine). Sausage, bacon, pork, carnitas,
  brisket, chicken, crab, shrimp, salmon → `false`. Ambiguous → ask.
- **Sanity-check** an item that's "OUT OF STOCK" on Toast: still a valid special to
  list (the site isn't an order system), but flag it to the user.

### Stage 4 — Fetch the Toast photos, one per special, in order
The signed CloudFront URL is **not** Cloudflare-walled — plain `curl` gets it
(HTTP 200). In-page `fetch()` is CORS-blocked, so pull the bytes from the shell, not
the browser. For each record `N` (in returned order), using its `img` URL:
```bash
curl -sL -A "Mozilla/5.0" "<img-url-N>" -o ~/Downloads/ft-special-N.jpg
file ~/Downloads/ft-special-N.jpg      # must be JPEG
```
Then **view each** to confirm it's the dish its record describes.

Toast serves these at **≤720px long edge** (a portrait dish can be ~405px wide). They
are **soft** after the 1080² upscale in Stage 5 — that's accepted. The resize token is
signed, so you can't bump `720:720` to a larger box (it 403s). If a dish's photo is
missing or unusable, fall back to the Instagram image for that dish (appendix).

### Stage 5 — Process + guards (deterministic, any count)
Pass the week date then one source image per special, **in order**:
```bash
.claude/skills/flytrap-specials/scripts/process-specials.sh $(date +%F) \
  ~/Downloads/ft-special-1.jpg [~/Downloads/ft-special-2.jpg ...]
```
The script enforces the guards (each long edge ≥700px so a thumbnail can't slip
through, no two sources identical, none matches an image from a different week),
center-crops to 1080² and writes `assets/specials/week-<date>-<N>.jpg`. It prints the
`photo:` paths and the `sha256` commit trailer. Non-zero exit → fix the cause, don't
edit `data.js`.

### Stage 6 — Edit `data.js` (between the markers)
Replace the whole `/* SPECIALS:START */ … /* SPECIALS:END */` region. Keep the
markers. One `{ … }` per special, `special-1`-indexed, photo paths from Stage 5,
price from Toast:
```js
  /* SPECIALS:START */
  sourcePost: "https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue",
  weekOf: "Week of <Month Day>",
  specials: [
    { id: "special-1", name: "<dish 1>", desc: "<…>", veg: <bool>, price: "<NN.NN>", photo: "assets/specials/week-<date>-1.jpg" },
    // …one line per special; omit `price` only if the dish truly has none
  ],
  /* SPECIALS:END */
```
For a single special, the array has one entry. Leave `soup` / `pastry` alone.

### Stage 7 — Verify (REQUIRED before PR)
`preview_start` the `flytrap` launch config, load `#specials`, then at **375 / 768 /
1280**:
- Each `<image-slot>` shows this week's filename, `naturalWidth >= 800` (the script
  upscales to 1080²), `complete === true`.
- The lede reads "Here through <upcoming Sunday>, then gone" — a **future** date,
  computed automatically (not a stale `weekOf`).
- `preview_console_logs` level error EMPTY (Babel-in-browser warning is expected).
- `scrollWidth === clientWidth` at 375 (no horizontal overflow).
- **Eyeball the pairing**: each photo matches its dish and the price/desc read right.

```js
[...document.querySelector('#specials').querySelectorAll('image-slot')].map(s=>{
  const img=s.shadowRoot?.querySelector('img');
  return {file:img?.src.split('/').pop().split('?')[0], nw:img?.naturalWidth, complete:img?.complete};
});
```

### Stage 8 — Commit + push + PR
```bash
git add data.js assets/specials/week-$(date +%F)-*.jpg
git commit -F - <<'MSG'
feat(specials): pull <Week of …> Toast specials

Source: order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue
- special-1: <dish 1>
- special-2: <dish 2>   # list however many

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
MSG
git push -u origin HEAD
gh pr create --base main --title "feat(specials): Week of <Month Day>" --body-file <body>
```
`main` auto-deploys on merge.

## Conventions

| Thing | Value |
|---|---|
| Source of record | Toast "Weekly Specials" group (name, desc, price, photo) |
| Toast menu | `order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue` |
| Specials data | `data.js` → between `/* SPECIALS:START */` … `/* SPECIALS:END */` |
| Block fields | `sourcePost`, `weekOf` (informational), `specials: [ … ]` |
| Per special | `{ id: "special-N", name, desc, veg:<bool>, price:"NN.NN" (no $), photo }` |
| Excluded from specials | Mini Muffins, Bowl/Cup of Soup — site soup/pastry are separate hand-edited fields |
| Count | Any — 1, 2, 3+ (or 0 → "no specials" message) |
| Photos | `assets/specials/week-<YYYY-MM-DD>-<N>.jpg`, 1080², 1-based |
| Order | `specials[i]` = Toast card i (top-to-bottom) |
| Expiry date | Auto-computed (end of current week) in `Sections.jsx` — never hand-set |
| Toast image res | ≤720px long edge, signed CloudFront, soft after upscale (accepted) |
| Fallback image source | Instagram `@theflytrapferndale` (appendix) |
| Branch | `chore/specials-<date>` → PR to `main` |

## Gotchas

| Trap | Reality |
|---|---|
| **Stripping the markers** | Breaks the direct-submit form's publisher. Always write *between* `SPECIALS:START`/`END` and keep them. |
| WebFetch/curl the Toast menu | HTTP 403 — Cloudflare "Just a moment" wall. Must use Claude in Chrome. |
| Page "still loading" on first read | Cloudflare challenge; `wait` 5s and retry until the title is "Order Online". |
| Including soup / muffins | Not site specials. Pull only photo'd plated dishes; leave soup/pastry hand-edited. |
| In-page `fetch()` of the photo | CORS-blocked ("Failed to fetch"). Read the `img.src` in Chrome, then `curl` from the shell. |
| Bumping `resize:fit:720:720` | Token is signed → 403. 720px is the max; accept the soft upscale. |
| Price with a `$` | Store without the `$` — the site adds one. |
| Hand-setting the "through" date | It's computed in `Sections.jsx`. `weekOf` is informational only now. |
| Committing to `main` | Auto-deploys live. Always branch + PR. |
| Eval `await` | The Chrome eval sandbox rejects top-level `await` — keep snippets synchronous (wrap in a plain `(function(){…})()`). |

## Appendix — Instagram image fallback

Use **only** when a Toast dish has no photo or the photo is unusable. Toast still owns
the name/description/price; Instagram supplies just the image. The IG handle is
`@theflytrapferndale`; specials post caption/hashtag is `#flytrapspecials`.

- **Caption / which post** (WebFetch, no browser):
  `https://www.instagram.com/p/<CODE>/embed/captioned` — confirm the post matches the
  Toast dishes.
- **Single-image post** (one dish, no browser):
  ```bash
  curl -sL -A "Mozilla/5.0" "https://www.instagram.com/p/<CODE>/media/?size=l" -o ~/Downloads/ft-special-1.jpg
  file ~/Downloads/ft-special-1.jpg     # JPEG, ~1080px
  ```
- **Carousel (2+)** — needs Claude in Chrome. Read the embed page's data store, never
  the `<img>` tags (logged-out DOM holds only slide 1 + *other posts'* thumbs). For
  each slide `i` (0-based), open a fresh tab on
  `https://www.instagram.com/p/<CODE>/embed/captioned`, wait ~3s to hydrate, and:
  ```js
  (function(){
    const ad = window.__additionalData;
    let m = ad?.extra?.data?.shortcode_media;
    if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
    const i = 0;  // slide index: 0,1,2,…
    const n = m.edge_sidecar_to_children.edges[i].node;
    let url = n.display_url;
    if(n.display_resources?.length){
      const best = n.display_resources.slice()
        .sort((a,b)=>(b.config_width*b.config_height)-(a.config_width*a.config_height))[0];
      if(best && best.config_width >= (n.dimensions?.width||0)) url = best.src;
    }
    fetch(url).then(r=>r.blob()).then(b=>{ const a=document.createElement('a');
      a.href=URL.createObjectURL(b); a.download='ft-special-'+(i+1)+'.jpg';
      document.body.appendChild(a); a.click(); window.__dl='size='+b.size; });
    return {kicked:i};
  })();
  ```
  Assert each child `is_video === false` and shares the parent `id`'s leading digits
  (sibling-post leak guard); `display_resources[length-1]` is the 150px thumb — use
  max-area / `display_url`. If the anchor-click download only saves the first slide,
  use the localhost receiver pattern (git history of this skill has the full snippet).
  IG images are clean 1080² — they pass the Stage 5 guard easily.
