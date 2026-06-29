---
name: flytrap-specials
description: Use when updating The Fly Trap website's weekly specials in ~/flytrap-website — triggers include "update flytrap specials", "new flytrap specials", "pull this week's specials", or a fresh @theflytrapferndale instagram.com/p/ link to swap in. Pulls 1, 2, or 3+ specials (single-image post or carousel) from Instagram into the Specials section. Menu/retail/press stay hand-edited.
---

# Fly Trap weekly specials

Pull this week's special(s) from a Fly Trap Instagram post, swap them into the
site between the `SPECIALS` markers, verify, and open a PR. The number of
specials is whatever the post has — **one, two, or more.**

There are now **two ways** specials reach the site, both writing the same
`data.js` block between the same markers:

1. **This skill** — the manual Instagram pull (you, on demand).
2. **The direct-submit form** — a deployed Google Apps Script web app the Fly
   Trap team fills in; its publisher splices the same marker region. (Path B of
   `docs/superpowers/specs/2026-06-23-flytrap-specials-automation-design.md`.)

## Overview — non-negotiables

- **Write BETWEEN the markers.** `data.js` has `/* SPECIALS:START */` … `/*
  SPECIALS:END */` around the specials block. Replace **only** the region
  between (and including) those markers, and **keep the markers in the output.**
  Stripping them silently breaks the direct-submit form's publisher
  (`spliceSpecials` throws "missing markers"). This is the #1 rule.
- **Any count.** A single-image post = one special. A carousel = one special per
  slide, in order. `Sections.jsx` maps the array, so 1 / 2 / 3+ all render; an
  empty array renders "No specials running this week." Do not force two.
- **Positional, not labeled.** `specials[i]` = caption dish i = carousel slide i.
  No savory/sweet, no badges, no `eyebrow` field — identity is array order. IDs
  are `special-1`, `special-2`, … Photos are `week-<date>-<N>.jpg` (1-based).
- **No price unless it's in the caption.** Omit the `price` field entirely — not
  `""`, not `null`. If a `$` amount is present, store it **without** the leading
  `$` (`Sections.jsx` renders `${s.price}`, so a stored `$` doubles it).
- **Don't hand-set the expiry date.** `Sections.jsx` computes the "Here through
  <date>, then gone" line as the end of the current week (Sunday) at render time
  — always current, no manual entry. `weekOf` in `data.js` is optional /
  informational only; it no longer drives the displayed date.
- **Never blank the section.** If any step fails, leave last week's specials live
  and stop — a half-update must never ship.
- **Branch → PR. Never commit to `main`** (it auto-deploys). Read `AGENTS.md`.

## Prerequisites

- `cwd` = `~/flytrap-website`, working tree clean.
- For a **carousel** (2+ images) you need Claude in Chrome connected
  (`list_connected_browsers` non-empty) to read slides 2+. For a **single-image
  post** (one special) no browser is needed — the caption + image come from
  public endpoints (Stages 2 & 4).

## Input

Optional: a specific post URL/shortcode (`/p/<CODE>/`). If the user gives one,
skip Stage 1. Either way confirm the post is *this week's specials* — newer than
`FT_DATA.sourcePost` — before editing.

## Procedure

### Stage 0 — Preflight + branch
```bash
cd ~/flytrap-website
git status --short            # must be empty; if not, STOP and ask
git checkout main && git pull --ff-only
git checkout -b chore/specials-$(date +%F)
```

### Stage 1 — Find this week's post (skip if given a URL)
Specials are the restaurant's newest specials post. Prefer asking the user for
the post URL (fastest, reliable). If auto-discovering and Claude in Chrome is
connected, navigate the logged-in session to
`https://www.instagram.com/theflytrapferndale/?hl=en`, pull recent `/p/<code>/`
links in grid order, and take the first **non-pinned** post; validate via
Stage 2 (caption reads as specials — `#flytrapspecials`, opens with "Specials",
or names dishes). After ~3 misses, ask the user for the URL.

### Stage 2 — Fetch the caption (no browser needed)
The public embed page exposes the caption. WebFetch:
```
https://www.instagram.com/p/<CODE>/embed/captioned
```
Ask for the caption verbatim, the dish count, whether it's a single image or a
carousel, and any price / vegetarian markers. Confirm it's specials and newer
than the current `sourcePost`.

### Stage 3 — Parse the caption into N specials
Judgment calls from the caption text:
- **count `N`** = number of named dishes (= number of carousel slides; 1 for a
  single-image post).
- **name / desc**: the dish name line, then its description. Strip trailing
  hashtags (`#flytrapspecials` etc.). Keep curly apostrophes; sentence-case the
  name if needed.
- **veg**: `true` if no meat/fish (eggs/dairy fine). Sausage, bacon, pork,
  brisket, chicken, crab, shrimp, salmon → `false`. Ambiguous → ask.
- **price**: only if a `$` amount is in the caption; store without the `$`.

### Stage 3.5 — (optional) cross-check against Toast
The Fly Trap keeps specials current on its Toast online-ordering menu. Use it to
sanity-check the dish name + description you parsed:
```
https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue
```
If Toast and Instagram disagree on a name/description, prefer Toast for the menu
copy (it's the kitchen's system of record) and flag the difference to the user.

### Stage 4 — Get the image(s), one per special, in order
- **Single special / single-image post:** the post's own media redirect returns
  the photo (no browser):
  ```bash
  curl -sL -A "Mozilla/5.0" "https://www.instagram.com/p/<CODE>/media/?size=l" -o ~/Downloads/ft-special-1.jpg
  file ~/Downloads/ft-special-1.jpg     # must be JPEG, ~1080px
  ```
  Then **view it** to confirm it's the dish the caption describes.
- **Carousel (2+):** read the embed page's data store in Claude in Chrome — never
  the `<img>` tags (logged-out DOM holds only slide 1 + *other posts'* thumbs;
  that bug shipped once). For each slide `i` (0-based), open a fresh tab on
  `https://www.instagram.com/p/<CODE>/embed/captioned`, wait ~3s to hydrate, and:
  ```js
  (function(){
    const ad = window.__additionalData;
    let m = ad?.extra?.data?.shortcode_media;
    if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
    const i = 0;  // slide index: 0,1,2,…
    const n = m.edge_sidecar_to_children.edges[i].node;
    let url = n.display_url;                                   // full image
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
  Assert: each child `is_video === false`; child `id`s share the leading digits of
  the parent `id` (sibling-post leak guard). `display_resources[length-1]` is the
  150px thumb — the array is unsorted; use max-area / `display_url`.

  **If the anchor-click download doesn't save files** (some Chrome profiles only
  allow the *first* download per page-load for a given site, so slides 2+ never
  land on disk), use the local receiver instead — it's deterministic and saves
  every slide:

  1. Start the receiver — a small localhost server that writes any posted bytes
     to `~/Downloads/<name>`. The CORS + Private-Network-Access headers let the
     https embed page talk to `http://127.0.0.1`; it binds to localhost only:
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
  2. On the embed page, collect the slide URLs and hand them to the receiver's
     page via the URL hash (the page navigates *itself*, so the long signed URLs
     stay in the browser; the hash survives the navigation):
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
  3. On the receiver page (`127.0.0.1:8770`), fetch each image and POST the bytes
     back — they save as `ftw-1.jpg`, `ftw-2.jpg`, …:
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
  Why this path: the embed page's own `fetch()` can't POST straight to localhost
  (its `connect-src` policy only allows Instagram hosts), and `window.name`
  resets across a cross-origin navigation — but a URL hash carries the slide URLs
  through the self-navigation cleanly. Then `kill $(lsof -ti tcp:8770)` and pass
  the saved `~/Downloads/ftw-<N>.jpg` files to Stage 5 in order.

### Stage 5 — Process + guards (deterministic, any count)
Pass the week date then one source image per special, **in order**:
```bash
.claude/skills/flytrap-specials/scripts/process-specials.sh $(date +%F) \
  ~/Downloads/ft-special-1.jpg [~/Downloads/ft-special-2.jpg ...]
```
The script enforces the guards (each ≥800px so a thumbnail can't slip through,
no two sources identical, none matches an image from a different week), crops to
1080² and writes `assets/specials/week-<date>-<N>.jpg`. It prints the `photo:`
paths and the `sha256` commit trailer. Non-zero exit → fix the cause, don't edit
`data.js`.

### Stage 6 — Edit `data.js` (between the markers)
Replace the whole `/* SPECIALS:START */ … /* SPECIALS:END */` region. Keep the
markers. One `{ … }` per special, `special-1`-indexed, photo paths from Stage 5:
```js
  /* SPECIALS:START */
  sourcePost: "https://www.instagram.com/p/<CODE>/",
  weekOf: "Week of <Month Day>",
  specials: [
    { id: "special-1", name: "<dish 1>", desc: "<…>", veg: <bool>, photo: "assets/specials/week-<date>-1.jpg" },
    // …one line per special; add `price: "NN.NN"` (no $) ONLY if in the caption
  ],
  /* SPECIALS:END */
```
For a single special, the array has one entry. Leave `soup` / `pastry` alone.

### Stage 7 — Verify (REQUIRED before PR)
`preview_start` the `flytrap` launch config, load `#specials`, then at **375 /
768 / 1280**:
- Each `<image-slot>` shows this week's filename, `naturalWidth >= 800`,
  `complete === true`.
- The lede reads "Here through <upcoming Sunday>, then gone" — a **future**
  date, computed automatically (not a stale `weekOf`).
- `preview_console_logs` level error EMPTY (Babel-in-browser warning is expected).
- `scrollWidth === clientWidth` at 375 (no horizontal overflow).
- **Eyeball the pairing**: each photo matches its dish (reversed-carousel is the
  one failure the guards can't catch). If wrong, re-fetch with slide indices fixed.

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
feat(specials): pull <Week of …> Instagram specials

Source: https://www.instagram.com/p/<CODE>/
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
| Specials data | `data.js` → between `/* SPECIALS:START */` … `/* SPECIALS:END */` |
| Block fields | `sourcePost`, `weekOf` (informational), `specials: [ … ]` |
| Per special | `{ id: "special-N", name, desc, veg:<bool>, photo, price?:"NN.NN" (no $) }` |
| Count | Any — 1, 2, 3+ (or 0 → "no specials" message) |
| Photos | `assets/specials/week-<YYYY-MM-DD>-<N>.jpg`, 1080², 1-based |
| Order | `specials[i]` = caption dish i = carousel slide i |
| Expiry date | Auto-computed (end of current week) in `Sections.jsx` — never hand-set |
| IG handle | `@theflytrapferndale` |
| Caption | `…/p/<CODE>/embed/captioned` (WebFetch, no browser) |
| Single image | `…/p/<CODE>/media/?size=l` (curl, no browser) |
| Toast menu | `order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue` |
| Specials hashtag | `#flytrapspecials` (the form's + the future auto-pull's trigger) |
| Branch | `chore/specials-<date>` → PR to `main` |

## Gotchas

| Trap | Reality |
|---|---|
| **Stripping the markers** | Breaks the direct-submit form's publisher. Always write *between* `SPECIALS:START`/`END` and keep them. |
| Forcing two specials | The post may have 1 (single image) or 3+. Use the caption's actual count. |
| Single-image post | Valid — one special. Don't assert a carousel; pull the image via `/media/?size=l`. |
| `-savory`/`-sweet` filenames | Legacy. New scheme is `week-<date>-<N>.jpg`, 1-based. |
| Hand-setting the "through" date | It's computed in `Sections.jsx`. `weekOf` is informational only now. |
| Price with a `$` | Store without the `$` — the site adds one. |
| `display_resources[length-1]` | The 150×150 thumb (unsorted array). Use `display_url` / max-area. |
| Reading `<img>` tags | Logged-out DOM has only slide 1 + other posts' thumbnails. Read the data store. |
| Reversed carousel | Passes every guard — only the Stage 7 eyeball catches a swapped photo↔dish. |
| Committing to `main` | Auto-deploys live. Always branch + PR. |
| Eval `await` | The Chrome eval sandbox rejects top-level `await` — keep snippets synchronous. |
