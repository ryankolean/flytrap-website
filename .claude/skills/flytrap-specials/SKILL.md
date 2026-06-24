---
name: flytrap-specials
description: Use when updating The Fly Trap website's weekly specials in ~/flytrap-website — triggers include "update flytrap specials", "new flytrap specials", "pull this week's specials", or a fresh @theflytrapferndale instagram.com/p/ link to swap in. Specials section only; menu/retail/press stay hand-edited.
---

# Fly Trap weekly specials

Pull the two weekly specials from a Fly Trap Instagram post, swap them into the
site, verify, and open a PR. One run per week. This is the manual pull; the
fully-automated Graph-API pipeline is a separate, unbuilt project
(`docs/.../flytrap-specials-automation-design.md`).

## Overview — non-negotiables

- **Source of truth** is the weekly Instagram post — by default the **newest post**
  on the @theflytrapferndale profile. The user may instead hand you a specific URL.
- **Positional, not labeled.** `specials[0]` = first carousel slide = first dish
  in the caption. `specials[1]` = second. There are NO savory/sweet badges and NO
  `eyebrow` field — identity is array order only. Filenames keep the legacy
  `-savory`/`-sweet` suffixes (slot 0 / slot 1) regardless of the actual dish.
- **No price unless it's in the caption.** Omit the `price` field entirely — not
  `""`, not `null`. `Sections.jsx` guards on truthy `price`.
- **Never blank the section.** If any step fails, leave last week's specials live
  and stop — a half-update must never ship.
- **Branch → PR. Never commit to `main`** (it auto-deploys). Read `AGENTS.md` first.

## Prerequisites

- Claude in Chrome connected (`list_connected_browsers` non-empty). If empty, ask
  the user to open Chrome + enable the extension — do NOT fall back to screenshots.
- `cwd` = `~/flytrap-website`, working tree clean.

## Input

Optional: a specific post URL/shortcode (`/p/<CODE>/`). If the user gives one, skip
Stage 1 and use it.

Default (no URL): **auto-discover** the newest post from the profile in Stage 1.
Either way, confirm the chosen post is *this week's specials* — newer than
`FT_DATA.sourcePost` in `data.js` — before editing.

## Procedure

### Stage 0 — Preflight + branch
```bash
cd ~/flytrap-website
git status --short            # must be empty; if not, STOP and ask
git checkout main && git pull --ff-only
git checkout -b chore/specials-$(date +%F)
```

### Stage 1 — Find this week's post (skip if given a URL)
Specials are the restaurant's newest post. In Claude in Chrome:

1. `select_browser`, `tabs_context_mcp{createIfEmpty:true}`.
2. `navigate` a tab to `https://www.instagram.com/theflytrapferndale/?hl=en` (your
   logged-in session). Wait ~2–3s for the grid to render.
3. Pull recent post shortcodes in grid order (synchronous — no top-level await):
```js
(function(){
  const seen=new Set(), out=[];
  document.querySelectorAll('a[href*="/p/"]').forEach(a=>{
    const m=(a.getAttribute('href')||'').match(/\/p\/([^/]+)\//);
    if(!m || seen.has(m[1])) return; seen.add(m[1]);
    const pinned = !!a.closest('div')?.querySelector('svg[aria-label*="Pinned" i]');
    out.push({code:m[1], pinned});
  });
  return {count:out.length, posts: out.slice(0,9)};
})();
```
4. Candidate = the first **non-pinned** post (pinned posts can sit above the newest;
   the flag is best-effort). Take its `code` as `<CODE>`.
5. Validate it's specials: run Stage 2's caption pull on `<CODE>` and check the
   caption reads as specials (contains `#flytrapspecials`, opens with "Specials",
   or has two dish blocks). If not, try the next post; after ~3 misses, STOP and ask
   the user for the URL.
6. Confirm the chosen post with the user (shortcode + first caption line) before
   editing anything. If the profile is login-walled or the grid is empty, ask for
   the URL instead.

### Stage 2 — Fetch caption + carousel (Claude in Chrome)
Read the embed page's **data store**, never the `<img>` tags (logged-out DOM only
holds slide 1 + sibling-post thumbnails — that bug shipped once).

1. `select_browser`, `tabs_context_mcp{createIfEmpty:true}`.
2. `navigate` a tab to `https://www.instagram.com/p/<CODE>/embed/captioned`.
3. Give it ~2–3s to hydrate, then run (the eval sandbox has **no top-level await** —
   keep it synchronous):
```js
(function(){
  const ad = window.__additionalData;
  let m = ad?.extra?.data?.shortcode_media;
  if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
  if(!m) return {ok:false, hint:'not hydrated yet — wait and retry'};
  const kids = (m.edge_sidecar_to_children?.edges||[]).map(e=>e.node);
  return {
    ok:true,
    shortcode: m.shortcode,
    parentId: m.id,
    childCount: kids.length,
    children: kids.map(n=>({ id:n.id, is_video:n.is_video, w:n.dimensions?.width, h:n.dimensions?.height })),
    caption: m.edge_media_to_caption?.edges?.[0]?.node?.text || null
  };
})();
```
**Assert before continuing:** `childCount >= 2`; every child `is_video === false`;
each child `id` shares the leading digits of `parentId` (sibling-post leak guard).
If a child is a video or `childCount < 2`, STOP and ask the user.

### Stage 3 — Parse the caption into two specials
Judgment calls — do them from the caption text:
- **name / desc**: first line of each block is the name, the rest is the
  description. Strip trailing hashtags. Keep the restaurant's curly apostrophes.
- **veg**: `true` if no meat/fish (eggs/dairy are fine). Pork, brisket, chicken,
  sausage, bacon, crab, shrimp, salmon → `false`. Ambiguous → ask.
- **price**: only if a `$` amount is in the caption; otherwise omit.

### Stage 4 — Download both slides at full res
Chrome blocks back-to-back downloads from one tab → **one fresh tab per image**.
In each tab (navigated to the embed), pick the **max-area** URL — NOT
`display_resources[length-1]` (that's the 150px thumb; the array is unsorted):
```js
(function(){
  const i = 0;  // 0 for slide 1, 1 for slide 2
  const ad = window.__additionalData;
  let m = ad?.extra?.data?.shortcode_media;
  if(!m && ad){ for(const k in ad){ if(ad[k]?.data?.shortcode_media){ m = ad[k].data.shortcode_media; break; } } }
  const n = m.edge_sidecar_to_children.edges[i].node;
  let url = n.display_url;                                  // full image, ~810x1014
  if(n.display_resources?.length){
    const best = n.display_resources.slice()
      .sort((a,b)=>(b.config_width*b.config_height)-(a.config_width*a.config_height))[0];
    if(best && best.config_width >= (n.dimensions?.width||0)) url = best.src;
  }
  window.__dl = 'starting';
  fetch(url).then(r=>{ if(!r.ok) throw new Error('http '+r.status); return r.blob(); })
    .then(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b);
      a.download='ft-special-'+i+'.jpg'; document.body.appendChild(a); a.click();
      window.__dl='clicked size='+b.size; })
    .catch(e=>{ window.__dl='error:'+e.message; });
  return {kicked:i, usingDisplayUrl:url===n.display_url};
})();
```
Read `window.__dl` after a beat — `size` should be ~100KB+, not ~7KB. Files land
in `~/Downloads/ft-special-0.jpg` and `-1.jpg`.

### Stage 5 — Process + guards (deterministic)
```bash
.claude/skills/flytrap-specials/scripts/process-specials.sh \
  ~/Downloads/ft-special-0.jpg ~/Downloads/ft-special-1.jpg $(date +%F)
```
The script enforces the guards mechanically (≥800px so a thumbnail can't slip
through, the two slides differ, neither matches last week), crops to 1080² and
writes `assets/specials/week-<date>-savory.jpg` / `-sweet.jpg`. It prints the
`photo:` paths and the `sha256:` commit trailer. If it exits non-zero, fix the
cause — do not edit `data.js`.

### Stage 6 — Edit `data.js`
In the `FT_DATA` specials block update `sourcePost`, `weekOf`, the
`// Current week's post:` comment, and both entries:
```js
sourcePost: "https://www.instagram.com/p/<CODE>/",
weekOf: "Week of <Month Day>",
specials: [
  { id: "special-1", name: "<dish 1>", desc: "<...>", veg: <bool>,
    photo: "assets/specials/week-<date>-savory.jpg" },          // add price ONLY if in caption
  { id: "special-2", name: "<dish 2>", desc: "<...>", veg: <bool>,
    photo: "assets/specials/week-<date>-sweet.jpg" },
],
```
Leave `soup` / `pastry` alone — they're not part of the IG specials.

### Stage 7 — Verify (REQUIRED before PR)
`preview_start` the `flytrap` launch config (port 5178), load `#specials`, then at
**375 / 768 / 1280**:
- DOM-probe each `<image-slot>`: `shadowRoot.querySelector('img')` `src` ends with
  this week's filename, `naturalWidth >= 800`, `complete === true`.
- `scrollWidth === clientWidth` at 375 (no horizontal overflow).
- `preview_console_logs` level error EMPTY (Babel-in-browser warning is expected).
- **Eyeball the pairing**: slide-1 photo matches dish 1, slide-2 matches dish 2
  (reversed-carousel is the one failure the guards can't catch). If wrong, you
  swapped the slides — redo Stage 4 with indices flipped.

Probe:
```js
[...document.querySelector('#specials').querySelectorAll('image-slot')].map(s=>{
  const img=s.shadowRoot?.querySelector('img');
  return {file:img?.src.split('/').pop().split('?')[0], nw:img?.naturalWidth, complete:img?.complete};
});
```

### Stage 8 — Commit + push + PR
```bash
git add data.js assets/specials/week-$(date +%F)-savory.jpg assets/specials/week-$(date +%F)-sweet.jpg
git commit -F - <<'MSG'
feat(specials): pull <Week of …> Instagram specials

Source: https://www.instagram.com/p/<CODE>/
- Special 1: <dish 1>
- Special 2: <dish 2>

sha256: savory=<…> sweet=<…>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
MSG
git push -u origin HEAD
gh pr create --base main --title "feat(specials): Week of <Month Day>" --body-file <body>
```
`main` auto-deploys on merge. The `guardrails` CI checks photo existence, no
`special-badge` / `eyebrow`, and the canonical Toast URL — all satisfied if you
followed the steps.

## Conventions

| Thing | Value |
|---|---|
| Specials data | `data.js` → `FT_DATA.specials` (+ `sourcePost`, `weekOf`) |
| Photos | `assets/specials/week-<YYYY-MM-DD>-savory.jpg` / `-sweet.jpg`, 1080² |
| Order | `[0]` = slide 1 = caption dish 1; `[1]` = slide 2 |
| IG handle | `@theflytrapferndale` |
| Profile (find latest) | `https://www.instagram.com/theflytrapferndale/?hl=en` |
| Specials hashtag | `#flytrapspecials` (the future auto-pull's trigger) |
| Branch | `chore/specials-<date>` → PR to `main` |

## Gotchas

| Trap | Reality |
|---|---|
| `display_resources[length-1]` | That's the **150×150 thumb** — the array is unsorted. Use `display_url` / max-area. |
| Reading `<img>` tags | Logged-out DOM has only slide 1 + *other posts'* thumbnails. Read the data store. |
| Reversed carousel | Clean parse, passes every guard — only the Stage 7 eyeball catches a swapped photo↔dish. |
| Adding a price | Only if it's literally in the caption. Otherwise omit the field. |
| Re-adding badges | No `eyebrow` in `data.js`, no `.special-badge` in `Sections.jsx` — CI fails the PR. |
| Committing to `main` | Auto-deploys live. Always branch + PR. |
| Eval `await` | The Chrome eval sandbox rejects top-level `await` — keep snippets synchronous. |
| Pinned posts | A pinned post can sit above the newest in the grid — prefer the first non-pinned, then validate the caption. |
