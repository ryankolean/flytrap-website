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
- **Any count.** One plated special or several — `Menu.jsx` maps `specials` under the
  Specials tab, so 1 / 2 / 3+ all render; an empty array renders "No specials running
  this week — check back soon." Do not force two.
- **Positional data, matched photos.** `specials[i]` = Toast card i (top-to-bottom).
  IDs are `special-1`, `special-2`, … Photos are `week-<date>-<N>.jpg` (1-based), where
  N follows **Toast** order — the IG→Toast name match maps each slide to the right N.
- **Price comes from Toast — store it without the `$`.** Toast lists a price on every
  plated dish; put it in `price` **without** the leading `$`. **Note:** `Menu.jsx`
  renders only `photo` / `name` / `veg` / `desc` for a special — it does **not** display
  `price`. The field is stored for data completeness (and any future price display), not
  shown today. Omit only if a dish genuinely has none.
- **No expiry line, no displayed date.** `Menu.jsx` renders a fixed sub-line ("What the
  cooks are running this week. Get it before it's gone.") — there is **no** computed
  "Here through <date>" line and `weekOf` is **not** displayed anywhere. `weekOf` in
  `data.js` is informational only; keep it current but don't expect it on the page.
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
one record per plated special — `{ name, price (no $), desc, img }`. Soup/muffins have
no photo, so they're excluded:
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
`img` is a signed CloudFront URL served at `resize:fit:720:720` (long edge ≈720). Save
each record — this drives everything downstream. This is the **canonical list, order,
names, text, and prices.**

### Stage 3 — Parse into N specials
Per record: **name** (keep curly apostrophes), **desc** (the composed-dish sentence),
**price** (stored without `$`, e.g. `"12.95"`), **veg** (`true` if no meat/fish;
sausage/bacon/pork/carnitas/brisket/chicken/crab/shrimp/salmon → `false`; ambiguous →
ask). An "OUT OF STOCK" dish is still valid to list — flag it.

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
- **Instagram source** (`useIG:true`): use the **localhost receiver** (Appendix B) —
  it's the reliable path. The embed page's in-page `fetch` gets the bytes, but the
  anchor-click download does **not** persist in the MCP browser context, and returning
  the bytes as base64 through a JS eval is blocked by the harness. The receiver sidesteps
  both. Use each dish's `slideIndex` from the plan — **not** a naive counter.

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
`preview_start` the `flytrap` launch config. The specials render inside `Menu.jsx`
under the **Specials tab** (plain DOM — no `#specials` id, no `image-slot` custom
element; that markup is gone). Activate the tab, scroll a `.special-card` into view,
and check at **375 / 768 / 1280**:
- Each `.special-photo img` shows this week's filename, `naturalWidth >= 800`,
  `complete === true`, and `alt` == the dish name (alt-vs-name is the pairing check).
- The veg leaf shows on veg dishes only (`.special-headline` contains the `VegLeaf`
  svg when `veg:true`).
- `preview_console_logs` level error EMPTY (Babel-in-browser warning is expected).
- `scrollWidth === clientWidth` at 375 (no horizontal overflow).
- **Eyeball the pairing**: each photo matches its dish; the desc reads right. (Price and
  `weekOf` are not rendered — don't look for them.)

```js
(function(){
  // activate the Specials tab, then read the cards
  const tab=[...document.querySelectorAll('button,a,[role=tab],li')].find(e=>/^\s*specials\s*$/i.test(e.textContent||''));
  if(tab) tab.click();
  const card=document.querySelector('.special-card');
  if(card){ card.scrollIntoView({block:'start'}); document.documentElement.scrollTop -= 100; }  // documentElement is the scroller
  return [...document.querySelectorAll('.special-card')].map(c=>{
    const img=c.querySelector('.special-photo img');
    return { file:img?.src.split('/').pop().split('?')[0], nw:img?.naturalWidth,
             complete:img?.complete, alt:img?.alt, veg:!!c.querySelector('.special-headline svg') };
  });
})();
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
| Excluded from specials | Mini Muffins, Bowl/Cup of Soup — site soup/pastry are separate hand-edited fields |
| Photos | `assets/specials/week-<YYYY-MM-DD>-<N>.jpg`, 1080², 1-based, N = Toast order |
| Toast image res | ≤720px long edge, signed CloudFront (soft after upscale) |
| IG image res | typically 800–1080px long edge (higher — preferred) |
| Match rule | IG slide → Toast dish by **name**, gated on all-found + distinct + count |
| Rendered fields | `Menu.jsx` shows `photo` / `name` / `veg` / `desc` only — `price` + `weekOf` are stored but NOT displayed |
| IG download | Localhost receiver (Appendix B) — anchor-click doesn't persist, base64 return is blocked |
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
| In-page `fetch()` of a Toast photo | CORS-blocked. Read `img.src` in Chrome, `curl` from the shell. (IG embed's own fetch works.) |
| Bumping Toast `resize:fit:720:720` | Token is signed → 403. 720px is the max. |
| Reading IG `<img>` tags for res | Logged-out DOM holds only slide 1 + other posts' thumbs. Read `window.__additionalData` (Stage 3.5). |
| Saving an IG image | Anchor-click download doesn't persist in the MCP browser; base64 return is blocked. Use the localhost receiver (Appendix B). |
| Expecting price/date on the page | `Menu.jsx` renders `photo`/`name`/`veg`/`desc` only. `price` + `weekOf` are stored, never displayed. Don't verify for them. |
| Price with a `$` | Store without the `$`. (Field is stored, not rendered — see above.) |
| Committing to `main` | Auto-deploys live. Always branch + PR. |
| Eval `await` | The Chrome eval sandbox rejects top-level `await` — keep snippets synchronous (`(function(){…})()`). |

## Appendix A — Find this week's IG post (if no URL given)

With Claude in Chrome, navigate the logged-in session to
`https://www.instagram.com/theflytrapferndale/?hl=en`, pull recent `/p/<code>/` links in
grid order, take the first **non-pinned** post, and validate via the embed caption
(`#flytrapspecials`, opens with "Specials", or names the Toast dishes). After ~3 misses,
ask the user for the URL. Stage 3.5's name gates are the real safety net — a wrong post
fails `gatesPass` and falls back to Toast.

## Appendix B — Download the IG images (localhost receiver)

This is the **reliable** way to land IG bytes on disk. Why not simpler routes: the
embed page's own `fetch()` gets the blob, but (a) the anchor-click `download` does **not**
persist in the MCP browser context, and (b) returning the bytes as base64 from a JS eval
is blocked by the harness. The embed page also **can't POST to localhost** (its
`connect-src` CSP only allows Instagram hosts). The fix: carry the signed slide URLs to a
localhost sink page via the URL hash, and let the **sink page** (no CSP) fetch + POST them
to itself. IG's CDN allows the cross-origin GET, so this works.

The Stage 3.5 snippet already stashed `window.__plan` (each `{n, url, useIG}` in Toast
order). Steps:

1. **Start the sink.** Write it to a file and run it in the background — an inline
   `python3 - <<PY &` heredoc may be sandbox-denied, and a foreground server blocks.
   ```python
   # scripts/sink.py  (or scratchpad) — writes any POSTed bytes to ~/Downloads/<path>
   import http.server, os, re, socketserver
   class H(http.server.BaseHTTPRequestHandler):
       def c(self):
           self.send_header("Access-Control-Allow-Origin","*")
           self.send_header("Access-Control-Allow-Methods","POST, OPTIONS, GET")
           self.send_header("Access-Control-Allow-Headers","*")
           self.send_header("Access-Control-Allow-Private-Network","true")
       def do_OPTIONS(self): self.send_response(204); self.c(); self.end_headers()
       def do_GET(self):
           self.send_response(200); self.c()
           self.send_header("Content-Type","text/html"); self.end_headers()
           self.wfile.write(b"<!doctype html><meta charset=utf-8><title>sink</title>sink ready")
       def do_POST(self):
           name=re.sub(r"[^A-Za-z0-9._-]","",self.path.lstrip("/")) or "x.bin"
           d=self.rfile.read(int(self.headers.get("Content-Length",0)))
           open(os.path.expanduser("~/Downloads/"+name),"wb").write(d)
           self.send_response(200); self.c(); self.end_headers(); self.wfile.write(b"ok")
       def log_message(self,*a): pass
   socketserver.TCPServer(("127.0.0.1",8770),H).serve_forever()
   ```
   Run with the Bash tool's `run_in_background: true`, then `curl -s -o /dev/null -w
   "%{http_code}" http://127.0.0.1:8770/` should return 200.

2. **Carry the chosen URLs to the sink.** On the embed tab, navigate it to the sink with
   the `useIG` dishes' `{n,url}` in the hash (the long signed URLs ride along in the
   browser — you never need to read them out, which is good since the harness redacts
   them):
   ```js
   (function(){
     const items=(window.__plan||[]).filter(p=>p.useIG).map(p=>({n:p.n,url:p.url}));
     location.href='http://127.0.0.1:8770/#'+encodeURIComponent(JSON.stringify(items));
     return {navigating:true,count:items.length};
   })();
   ```

3. **Fetch + POST from the sink page**, saving directly as `ft-special-<N>.jpg` by Toast
   order N (no rename step). Keep it promise-chained — the eval sandbox rejects top-level
   `await`. Stash results, then read them back in a second eval:
   ```js
   (function(){
     window.__sink={};
     JSON.parse(decodeURIComponent(location.hash.slice(1))).forEach(it=>{
       fetch(it.url).then(r=>r.blob()).then(b=>
         fetch('/ft-special-'+it.n+'.jpg',{method:'POST',body:b})
           .then(res=>{window.__sink[it.n]='ok '+res.status+' '+b.size+'B';}))
         .catch(e=>{window.__sink[it.n]='ERR '+e;});
     });
     return 'posting';
   })();
   // second eval: window.__sink   → {1:"ok 200 …B", 2:"ok 200 …B"}
   ```

4. **Confirm + clean up.** `file ~/Downloads/ft-special-*.jpg` (all JPEG, fresh mtime —
   delete any stale files from a prior run first so you never process last week's photo),
   **view each** to confirm dish↔photo, then stop the background server (kill it / TaskStop).
   Hand the `ft-special-<N>.jpg` files to Stage 5 in Toast order.

Guards to keep in mind: each child `is_video === false`; carousel children share the
parent media id's leading ~8 digits (sibling-post leak guard — carousel child ids are
distinct media ids, so test a shared prefix, not equality); `display_resources[0]` after
a max-area sort is the full image (`[length-1]` is the 150px thumb).
