---
name: flytrap-specials
description: Use when updating The Fly Trap website's weekly specials in ~/flytrap-website — triggers include "update flytrap specials", "new flytrap specials", "pull this week's specials", the Toast menu (order.toasttab.com/online/the-fly-trap-ferndale-...), or a fresh @theflytrapferndale instagram.com/p/ link. Toast is the source of record (name, description, price, fallback photo); Instagram supplies the higher-res photo when its slide's dish name matches a Toast special 1:1. Menu/retail/press stay hand-edited.
---

# Fly Trap weekly specials

Pull this week's plated special(s) into the site's Specials section, verify, and open
a PR. The number of specials is whatever the Toast "Weekly Specials" group has —
**one, two, or more.**

**Two sources, clear roles:**

- **Toast** (`order.toasttab.com/online/the-fly-trap-ferndale-…`) is the **source of
  record** — the SET of specials, their **name**, **description**, **price**, and a
  **fallback photo**. Always authoritative for text.
- **Instagram** (`@theflytrapferndale`) supplies the **photo** — its images are
  higher-res than Toast's. Use the IG photo for a dish **only when** the IG slide's
  dish matches a Toast special **by name (1:1)** and the IG image is **larger** than
  Toast's. Otherwise that dish falls back to Toast's own (lower-res) photo.

So: text always from Toast; each photo from IG if name-matched + higher-res, else from
Toast. A dish is never left without a photo.

There are two ways specials reach the site, both writing the same `data.js` block
between the same markers:

1. **This skill** — the pull you run on demand.
2. **The direct-submit form** — a deployed Google Apps Script web app the Fly Trap
   team fills in; its publisher splices the same marker region. (Path B of
   `docs/superpowers/specs/2026-06-23-flytrap-specials-automation-design.md`.)

## Overview — non-negotiables

- **Write BETWEEN the markers.** `data.js` has `/* SPECIALS:START */` … `/*
  SPECIALS:END */` around the specials block. Replace **only** the region between
  (and including) those markers, and **keep the markers in the output.** Stripping
  them silently breaks the direct-submit form's publisher (`spliceSpecials` throws
  "missing markers"). This is the #1 rule.
- **Plated specials only — omit soup and muffins.** The Toast "Weekly Specials" group
  also lists standing add-ons: **Mini Muffins**, **Bowl/Cup of Soup**. These are
  **not** site specials. The site's soup + pastry live in their own hand-edited
  `data.js` fields — leave them alone. Pull only the composed plated dishes (the items
  with both a photo and a descriptive sentence). The extraction snippet keys off the
  dish photo, so soup/muffins (no photo) fall out automatically.
- **Photo source: IG-first, Toast-fallback, matched by NAME.** For each Toast special,
  use the Instagram slide **only if** (a) all Toast names appear in the IG caption,
  (b) the match is 1:1 (distinct slide per dish, equal counts), and (c) the IG image's
  long edge is **larger** than Toast's (~720px). If **any** of those fail, that dish
  (or all dishes) use the Toast photo, and you **flag the mismatch to the user.**
  Never pair an IG slide to a dish by slide position alone — always by name. A stale or
  different IG post must never silently attach the wrong photo.
- **Any count.** One plated special or several — `Sections.jsx` maps the array, so 1 /
  2 / 3+ all render; an empty array renders "No specials running this week." Do not
  force two.
- **Positional data, matched photos.** `specials[i]` = Toast card i (top-to-bottom).
  IDs are `special-1`, `special-2`, … Photos are `week-<date>-<N>.jpg` (1-based), where
  N follows **Toast** order — the IG→Toast name match maps each slide to the right N.
- **Price comes from Toast — store it without the `$`.** Toast lists a price on every
  plated dish; put it in `price` **without** the leading `$` (`Sections.jsx` renders
  `${s.price}`, so a stored `$` doubles it). Omit only if a dish genuinely has none.
- **Don't hand-set the expiry date.** `Sections.jsx` computes the "Here through <date>,
  then gone" line as the end of the current week (Sunday) at render time. `weekOf` in
  `data.js` is informational only.
- **Never blank the section.** If any step fails, leave last week's specials live and
  stop — a half-update must never ship.
- **Branch → PR. Never commit to `main`** (it auto-deploys). Read `AGENTS.md`.

## Prerequisites

- `cwd` = `~/flytrap-website`, working tree clean.
- **Claude in Chrome connected** (`list_connected_browsers` non-empty) — **required**
  for both sources. Toast's menu is behind a Cloudflare "Just a moment…" wall (WebFetch
  and curl get HTTP 403); the IG carousel's per-slide resolutions live in the embed
  page's data store. Only a real browser reaches both.

## Input

Optional: the newest `@theflytrapferndale` specials post URL (`/p/<CODE>/`). If given,
use it for photos; else auto-find (Appendix A) or proceed Toast-only for photos. The
Toast URL is fixed. Confirm the pulled dishes are **newer than what's live** — compare
against the current `specials[]` names in `data.js`; if identical, stop.

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
title flips from "Just a moment…" to **"Order Online"** after ~5–10s. If a read returns
"Page still loading", `wait` 5s and retry — don't quit on the first timeout.
```
https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue
```

### Stage 2 — Extract the "Weekly Specials" group (Toast = source of record)
Run in the Toast tab (Chrome `javascript_tool`). Keys off each **dish photo**, returns
one record per plated special — `{ name, price (no $), desc, veg, img }`. Soup/muffins have
no photo, so they're excluded. `veg` is read from the leafy-green glyph (🥬 `U+1F96C`)
Kara adds in the Toast description; the glyph is stripped out of `desc`:
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
    const descRaw=lines.sort((a,b)=>b.length-a.length)[0]||'';
    const veg=/\u{1F96C}/u.test(descRaw);                              // 🥬 = vegetarian (Kara's Toast tag)
    const desc=descRaw.replace(/\u{1F96C}\uFE0F?/gu,'')          // strip the glyph for display
      .replace(/\s{2,}/g,' ').replace(/\s+([.,;!?])/g,'$1').trim();
    return {name, price:priceM?priceM[1]:null, desc, veg, img:im.src};
  });
})();
```
`img` is a signed CloudFront URL served at `resize:fit:720:720` (long edge ≈720). Save
each record — this drives everything downstream. This is the **canonical list, order,
names, text, and prices.**

### Stage 3 — Parse into N specials
Per record: **name** (keep curly apostrophes), **desc** (the composed-dish sentence),
**price** (stored without `$`, e.g. `"12.95"`), **veg** (straight from Stage 2: `true`
only when the Toast description carries the 🥬 `U+1F96C` glyph Kara adds — **not** guessed
from ingredients; Stage 2 already stripped the glyph out of `desc`). If a dish reads
vegetarian but has no 🥬, leave `veg:false` and flag the gap to the user rather than
overriding — Kara's tag is the source of truth. An "OUT OF STOCK" dish is still valid to
list — flag it.

### Stage 3.5 — Choose the photo source per dish (IG-first, name-matched)
If you have an IG specials post URL, open its embed in a **fresh Chrome tab** and let
it hydrate (~3s):
```
https://www.instagram.com/p/<CODE>/embed/captioned
```
Then run this. Paste the Stage 2 records into `toast` (name + `img` as `toastUrl`;
`toastLong` is 720, Toast's fit box). It reads the IG caption + carousel, matches by
name, and returns a per-dish `plan` **in Toast order**:
```js
(function(){
  const toast=[
    // {name:"…", toastUrl:"<Stage-2 img url>", toastLong:720}, …in Toast card order
  ];
  const ad=window.__additionalData;
  let m=ad?.extra?.data?.shortcode_media;
  if(!m&&ad){for(const k in ad){if(ad[k]?.data?.shortcode_media){m=ad[k].data.shortcode_media;break;}}}
  if(!m) return {err:'IG data store not hydrated — wait and retry'};
  const caption=(m.edge_media_to_caption?.edges?.[0]?.node?.text)||'';
  const slides=(m.edge_sidecar_to_children?.edges||[]).map(e=>{
    const n=e.node,best=(n.display_resources||[]).slice()
      .sort((a,b)=>b.config_width*b.config_height-a.config_width*a.config_height)[0];
    return {isVideo:n.is_video, long:Math.max(best.config_width,best.config_height), url:best.src};
  });
  const norm=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
  const capN=norm(caption);
  const idxs=toast.map(t=>capN.indexOf(norm(t.name)));   // where each Toast name sits in the caption
  const allFound=idxs.every(i=>i>=0);                    // GATE 1: every dish named in caption
  const distinct=new Set(idxs).size===idxs.length;       // GATE 2: no two dishes share a position
  const countMatch=slides.length===toast.length;         // GATE 3: 1 slide per dish
  const gatesPass=allFound&&distinct&&countMatch;
  const sorted=idxs.slice().sort((a,b)=>a-b);            // caption order == slide order
  const plan=toast.map((t,j)=>{
    const slideIndex=gatesPass?sorted.indexOf(idxs[j]):-1;  // this dish's slide
    const s=slideIndex>=0?slides[slideIndex]:null;
    const useIG=gatesPass && s && !s.isVideo && s.long>t.toastLong;  // higher-res gate
    return {n:j+1, name:t.name, slideIndex, igLong:s?.long||null, toastLong:t.toastLong,
            useIG, src: useIG?s.url:t.toastUrl};
  });
  return {gatesPass, allFound, distinct, countMatch,
          unmatched: toast.filter((t,j)=>idxs[j]<0).map(t=>t.name), plan};
})();
```
Read the result:
- **`gatesPass:false`** → the IG post is **not** this week's specials (a name is missing,
  a duplicate, or the slide count differs). **Do not use any IG photo.** Every dish
  uses its Toast photo; **tell the user** the IG post didn't match (print `unmatched`
  and the counts). This is the fool-proofing — a wrong-post mix-up is impossible.
- **`gatesPass:true`** → each dish's `useIG` is set per resolution. `useIG:true` uses the
  IG slide (`src`); `useIG:false` (IG not larger, or the slide is a video) keeps Toast's
  photo. Sanity-check `slideIndex`/`name` pairs look right.

No IG URL at all → skip this stage; every dish uses its Toast photo (`useIG:false`).

### Stage 4 — Fetch the photos per the plan, in Toast order
For each dish `n` (1-based, Toast order), fetch `plan[n-1].src` to
`~/Downloads/ft-special-n.jpg`:
- **Toast source** (`useIG:false`): plain `curl` — the CloudFront CDN is not walled.
  ```bash
  curl -sL -A "Mozilla/5.0" "<toast src>" -o ~/Downloads/ft-special-n.jpg
  ```
- **Instagram source** (`useIG:true`): in-page `fetch` works on the IG embed origin;
  save via the anchor-click snippet (Appendix B), or the localhost receiver if slides
  2+ won't save. Use each dish's `slideIndex` from the plan — **not** a naive counter.

Then **view each saved image** and confirm it's the dish its record describes. `file
~/Downloads/ft-special-*.jpg` must all be JPEG. (Toast photos are ≤720px long edge and
soft after upscale — expected when a dish fell back to Toast.)

### Stage 5 — Process + guards (deterministic, any count)
```bash
.claude/skills/flytrap-specials/scripts/process-specials.sh $(date +%F) \
  ~/Downloads/ft-special-1.jpg [~/Downloads/ft-special-2.jpg ...]
```
Guards: each long edge ≥700px (blocks the 150px IG-thumbnail leak; passes Toast's 720),
no two sources identical, none matches a different week's image. Center-crops to 1080²,
writes `assets/specials/week-<date>-<N>.jpg`, prints the `sha256` trailer. Non-zero exit
→ fix the cause, don't edit `data.js`.

### Stage 6 — Edit `data.js` (between the markers)
Replace the whole `/* SPECIALS:START */ … /* SPECIALS:END */` region. Keep the markers.
One `{ … }` per special, `special-1`-indexed, photo paths from Stage 5, price from Toast:
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
Leave `soup` / `pastry` alone.

### Stage 7 — Verify (REQUIRED before PR)
`preview_start` the `flytrap` launch config, load `#specials`, then at **375 / 768 /
1280**:
- Each `<image-slot>` shows this week's filename, `naturalWidth >= 800`, `complete ===
  true`.
- The lede reads "Here through <upcoming Sunday>, then gone" — a **future** date.
- `preview_console_logs` level error EMPTY (Babel-in-browser warning is expected).
- `scrollWidth === clientWidth` at 375 (no horizontal overflow).
- **Eyeball the pairing**: each photo matches its dish; price/desc read right.

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
feat(specials): pull <Week of …> specials

Source: order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue
Photos: Instagram <post URL> (matched) / Toast fallback
- special-1: <dish 1>
- special-2: <dish 2>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
MSG
git push -u origin HEAD
gh pr create --base main --title "feat(specials): Week of <Month Day>" --body-file <body>
```
`main` auto-deploys on merge.

## Conventions

| Thing | Value |
|---|---|
| Source of record (text) | Toast "Weekly Specials" group — name, desc, price, order, set |
| Photo source | Instagram if name-matched 1:1 AND higher-res; else Toast fallback |
| Toast menu | `order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue` |
| IG handle / hashtag | `@theflytrapferndale` / `#flytrapspecials` |
| Specials data | `data.js` → between `/* SPECIALS:START */` … `/* SPECIALS:END */` |
| Per special | `{ id: "special-N", name, desc, veg:<bool>, price:"NN.NN" (no $), photo }` |
| Vegetarian mark | `veg:true` iff the Toast description contains 🥬 `U+1F96C` (Kara's tag); the glyph is stripped from `desc`. Never guessed from ingredients. |
| Excluded from specials | Mini Muffins, Bowl/Cup of Soup — site soup/pastry are separate hand-edited fields |
| Photos | `assets/specials/week-<YYYY-MM-DD>-<N>.jpg`, 1080², 1-based, N = Toast order |
| Toast image res | ≤720px long edge, signed CloudFront (soft after upscale) |
| IG image res | typically 800–1080px long edge (higher — preferred) |
| Match rule | IG slide → Toast dish by **name**, gated on all-found + distinct + count |
| Expiry date | Auto-computed (end of current week) in `Sections.jsx` — never hand-set |
| Branch | `chore/specials-<date>` → PR to `main` |

## Gotchas

| Trap | Reality |
|---|---|
| **Stripping the markers** | Breaks the direct-submit form's publisher. Always write *between* `SPECIALS:START`/`END` and keep them. |
| WebFetch/curl the Toast menu | HTTP 403 — Cloudflare wall. Use Claude in Chrome. |
| Page "still loading" on first read | Cloudflare challenge; `wait` 5s and retry until title is "Order Online". |
| Pairing IG by slide position | Wrong. Match by **name** (Stage 3.5 gates). A reordered/stale post would swap photos. |
| IG post ≠ this week | `gatesPass:false` → use Toast photos for all, flag to user. Never guess. |
| Including soup / muffins | Not site specials. Pull only photo'd plated dishes; leave soup/pastry hand-edited. |
| Guessing veg from ingredients | Wrong. `veg` = the 🥬 `U+1F96C` glyph in the Toast desc, nothing else. No glyph → `veg:false`, even if it looks meatless — flag the gap, don't override. (Soup uses a legacy `(v)` text tag, but soup isn't a special.) |
| In-page `fetch()` of a Toast photo | CORS-blocked. Read `img.src` in Chrome, `curl` from the shell. (IG embed's own fetch works.) |
| Bumping Toast `resize:fit:720:720` | Token is signed → 403. 720px is the max. |
| Reading IG `<img>` tags for res | Logged-out DOM holds only slide 1 + other posts' thumbs. Read `window.__additionalData` (Stage 3.5). |
| Price with a `$` | Store without the `$` — the site adds one. |
| Committing to `main` | Auto-deploys live. Always branch + PR. |
| Eval `await` | The Chrome eval sandbox rejects top-level `await` — keep snippets synchronous (`(function(){…})()`). |

## Appendix A — Find this week's IG post (if no URL given)

With Claude in Chrome, navigate the logged-in session to
`https://www.instagram.com/theflytrapferndale/?hl=en`, pull recent `/p/<code>/` links in
grid order, take the first **non-pinned** post, and validate via the embed caption
(`#flytrapspecials`, opens with "Specials", or names the Toast dishes). After ~3 misses,
ask the user for the URL. Stage 3.5's name gates are the real safety net — a wrong post
fails `gatesPass` and falls back to Toast.

## Appendix B — Download an IG carousel slide

On `…/p/<CODE>/embed/captioned` (hydrated ~3s), for a given `slideIndex` (0-based, from
the Stage 3.5 plan):
```js
(function(){
  const ad = window.__additionalData;
  let m = ad?.extra?.data?.shortcode_media;
  if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
  const i = 0;  // slideIndex from the plan
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
max-area / `display_url`. **If the anchor-click only saves the first slide** (some Chrome
profiles allow one download per page-load per site), use the localhost receiver instead:

1. Start a localhost sink that writes any POSTed bytes to `~/Downloads/<name>`:
   ```bash
   python3 - <<'PY' &
   import http.server, os, re, socketserver
   class H(http.server.BaseHTTPRequestHandler):
       def c(self):
           self.send_header("Access-Control-Allow-Origin", "*")
           self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
           self.send_header("Access-Control-Allow-Headers", "*")
           self.send_header("Access-Control-Allow-Private-Network", "true")
       def do_OPTIONS(self): self.send_response(204); self.c(); self.end_headers()
       def do_GET(self):
           self.send_response(200); self.c()
           self.send_header("Content-Type", "text/html"); self.end_headers()
           self.wfile.write(b"<!doctype html><meta charset=utf-8><title>sink</title>sink ready")
       def do_POST(self):
           name = re.sub(r"[^A-Za-z0-9._-]", "", self.path.lstrip("/")) or "x.bin"
           d = self.rfile.read(int(self.headers.get("Content-Length", 0)))
           open(os.path.expanduser("~/Downloads/" + name), "wb").write(d)
           self.send_response(200); self.c(); self.end_headers(); self.wfile.write(b"ok")
       def log_message(self, *a): pass
   socketserver.TCPServer(("127.0.0.1", 8770), H).serve_forever()
   PY
   ```
2. On the embed page, collect the chosen slide URLs and carry them to the sink via the
   URL hash (survives the self-navigation; the long signed URLs stay in the browser):
   ```js
   (function(){
     const ad = window.__additionalData;
     let m = ad?.extra?.data?.shortcode_media;
     if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
     const urls = m.edge_sidecar_to_children.edges.map(e=>{
       const n=e.node; let url=n.display_url;
       if(n.display_resources?.length){
         const best=n.display_resources.slice().sort((a,b)=>(b.config_width*b.config_height)-(a.config_width*a.config_height))[0];
         if(best && best.config_width>=(n.dimensions?.width||0)) url=best.src;
       }
       return url;
     });
     location.href='http://127.0.0.1:8770/#'+encodeURIComponent(JSON.stringify(urls));
     return {navigating:true,count:urls.length};
   })();
   ```
3. On the sink page (`127.0.0.1:8770`), fetch each and POST it back — saves as
   `ftw-1.jpg`, `ftw-2.jpg`, …:
   ```js
   (async function(){
     const urls=JSON.parse(decodeURIComponent(location.hash.slice(1)));
     const out=[];
     for(let i=0;i<urls.length;i++){
       const b=await fetch(urls[i]).then(x=>x.blob());
       const res=await fetch('/ftw-'+(i+1)+'.jpg',{method:'POST',body:b});
       out.push({slide:i+1,bytes:b.size,sink:res.status});
     }
     return out;
   })();
   ```
   Then `kill $(lsof -ti tcp:8770)` and rename the saved `~/Downloads/ftw-<slideIndex+1>.jpg`
   files to `ft-special-<N>.jpg` per the plan's Toast order before Stage 5.
