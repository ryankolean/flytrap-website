# Voice-match audit and rewrite — Task 20

Audit date: 2026-04-26.
Auditor: Claude (Opus 4.7), dispatch worker for The Fly Trap site.
Target voice: existing About-page register documented in `docs/01-design-document-v1.7.md` §4 ("Voice"), §6 ("Voice rules"), and Appendix B.

Anchor phrases (preserve verbatim where they exist):
- *"magnificent life"* / *"magnificent eggs"*
- *"beloved and inquisitive customers"*
- *"Buzzin' since 2004"*
- *"a finer diner"*, *"Under Old Management"*, *"Catch a Buzz"*

## Summary

| Metric | Count |
|---|---|
| Total visible strings audited (deduplicated) | 152 |
| OK (voice-matched or neutral logistics) | 145 |
| BANNED (auto-fail term) | 4 |
| SLOP (generic marketing) | 2 |
| OFF-VOICE (readable but tonal mismatch) | 1 |

All 7 violations rewritten in this pass. Post-rewrite re-scan against the banned-word list returns 0 matches across `src/` and `docs/discoverability/`. `pnpm build` is green.

## Violations and rewrites

### 1. BANNED — `elevated` (visit page meta description)
- **File:** `src/app/visit/page.tsx:19`
- **Before:** *"Neighborhood diner on Woodward Ave in Ferndale, Michigan. Serving **elevated** American comfort food with global accents since 2004. Featured on Food Network's Diners, Drive-Ins and Dives."*
- **Why:** `elevated` is the tell of LLM food-marketing copy. The brand doesn't claim elevation; it names dishes specifically and lets the room argue for itself.
- **After:** *"Neighborhood diner on Woodward Ave in Ferndale, Michigan. American comfort food with global cooks' tables since 2004 — pho, Thai peanut, Italian, breakfast all day. Featured on Food Network's Diners, Drive-Ins and Dives."*
- **Reasoning:** specific dishes replace the abstract claim, matching the design-doc guidance "proudly regional, proudly global" without the "accents" filler.

### 2. BANNED — `elevated` (llms.txt header)
- **File:** `docs/discoverability/llms.txt:3`
- **Before:** same sentence as #1, served from the `/llms.txt` route.
- **After:** same rewrite as #1.

### 3. BANNED — `elevated` (llms-full.txt header)
- **File:** `docs/discoverability/llms-full.txt:3`
- **Before/after:** same as #1.

### 4. BANNED — `elevated` (llms-full.txt 'a finer diner' gloss)
- **File:** `docs/discoverability/llms-full.txt:88`
- **Before:** *"It is the primary tagline, capturing the restaurant's positioning: **elevated** comfort food in a diner setting, decorated with personality and pride rather than indifference or minimalism."*
- **After:** *"It is the primary tagline, capturing the restaurant's positioning: comfort food cooked with care in a diner setting, decorated with personality and pride rather than indifference or minimalism."*

### 5. BANNED — `elevated` (llms-full.txt manifesto paragraph)
- **File:** `docs/discoverability/llms-full.txt:156`
- **Before:** *"...to the menu (utilitarian comfort food **elevated** through thoughtful naming and execution)."*
- **After:** *"...to the menu (utilitarian comfort food made specific and funny through thoughtful naming and execution)."*
- **Reasoning:** "specific and funny" reflects the actual brand thesis (Cowboy Curtis, The Forager, Veggie Rumble).

### 6. SLOP — "third-party validation" (press page subhead)
- **File:** `src/app/press/page.tsx:101–102`
- **Before:** *"Twenty-plus years of **third-party validation** — national TV, Detroit's biggest papers, and the neighborhood press that has always had our back."*
- **Why:** "third-party validation" is consultant-speak. The list that follows is already concrete; the abstraction adds nothing.
- **After:** *"Twenty-plus years of people writing about us — national TV, Detroit's biggest papers, and the neighborhood press that has always had our back."*

### 7. OFF-VOICE — "Press archive is being assembled" (press empty state)
- **File:** `src/app/press/page.tsx:163`
- **Before:** *"Press archive is being assembled. Check back soon."*
- **Why:** passive voice + corporate noun. The voice rule from §6 is "Use their language" and contractions yes.
- **After:** *"We're still pulling the clippings together. Check back soon."*

### 8. SLOP — "the entry point and brand experience" (llms.txt + llms-full.txt)
- **Files:**
  - `docs/discoverability/llms.txt:7`
  - `docs/discoverability/llms-full.txt:7`
- **Before:** *"- Home: https://theflytrapferndale.com/ — the entry point and brand experience"*
- **Why:** "entry point" + "brand experience" is the LLM-self-description tic. A diner has a front door.
- **After:** *"- Home: https://theflytrapferndale.com/ — the front door"*

> Counted as one violation since the same line appears in both files; rewritten in both.

## Sample passes (already voice-matched — preserved)

Five strings that already nail the register:

1. **`src/components/home/Hero.tsx:132–134`** — *"Twenty years of Buzzin', a room loud in the best way, and a pan of magnificent eggs waiting on Woodward."*
2. **`src/components/home/BuzzinSince2004.tsx:65–69`** — *"For twenty years, beloved and inquisitive customers asked after the name, the flies on the walls, the marbles set into the bar."*
3. **`src/components/home/TheRoom.tsx:88–93`** — *"Checkerboard floors, fire-engine red where it counts, and the kind of careful weirdness that takes two decades to build. Come for the magnificent eggs. Stay because you can't stop looking at the bar."*
4. **`src/app/error.tsx:20–25`** — *"A glitch in the wing." / "Something went sideways. Try again, or head back to the diner."*
5. **`src/app/not-found.tsx:7–11`** — *"We could not find that page." / "It might be on the other side of the screen door. Try the menu, or visit the diner."*

## Highest-stakes copy — final state (post-rewrite)

These five blocks are read end-to-end by reviewers. Each one is now voice-matched.

### A. Hero copy — `src/components/home/Hero.tsx`

```
a finer diner
Under Old Management
Catch a Buzz

Twenty years of Buzzin', a room loud in the best way, and a pan
of magnificent eggs waiting on Woodward.

[Order Online]   [See Menu]
```

Open-status badge below: `Open now` / `Closed — opens 8:00 AM`.

### B. Buzzin' Since 2004 narrative — `src/components/home/BuzzinSince2004.tsx`

> Buzzin' Since 2004
>
> The doors of The Fly Trap were thrown open on a December morning in 2004, and Kara & Gavin McMillian welcomed their first customers and started a magnificent life as a corner of Woodward Avenue that has been buzzing ever since.
>
> For twenty years, beloved and inquisitive customers asked after the name, the flies on the walls, the marbles set into the bar. In 2021, after a long pandemic stretch, the founders stepped back. A trusted friend and fellow restaurateur held the room for them, kept the menu honest, and waited.
>
> In October 2024, the McMillians came home. The receipts now read *Under Old Management*, the eggs are still magnificent, and the flies are still painting flies. Twenty-plus years on, *a finer diner* means what it has always meant: come in, sit down, catch a buzz.
>
> *Caption:* Fly Art Class — flies painting flies, on the back wall.

### C. About hero caption + return-story copy — `src/app/about/page.tsx`

The About hero shows the Fly Art Class painting full-bleed with no competing headline (per CLAUDE.md constraint #8). Caption and body:

> *Caption (small uppercase):* Fly Art Class
>
> The Fly Trap opened on December 28, 2004, on Woodward Avenue in Ferndale. Kara and Gavin McMillian built it into a neighborhood institution over seventeen years — the kind of place where the menu names the bartender and the daily special is named after a Warren Zevon song.
>
> When the McMillians returned in October 2024, they brought back the original menu, all twelve staff from the interim era, and one extra line on every receipt: *Under Old Management.*
>
> They have been buzzing since 2004. The ceiling has been pressed tin since 1907. The eggs have always been magnificent.

### D. Footer credits line — `src/components/layout/Footer.tsx`

```
The Fly Trap
Buzzin' since 2004.
© 2026 The Fly Trap. All rights reserved.
```

Visit block: `22950 Woodward Ave / Ferndale, MI 48220 / (248) 399-5150 / Mon–Sun, 8am to 3pm`.
Find your way: `Menu, About, Press, FAQ, Visit, Order, Shop`.

### E. Error and 404 copy

**`src/app/error.tsx`:**

> A glitch in the wing.
> Something went sideways. Try again, or head back to the diner.
> [Try again]   [Back to home]

**`src/app/not-found.tsx`:**

> We could not find that page.
> It might be on the other side of the screen door. Try the menu, or visit the diner.
> [Home]   [Menu]   [Visit]

## Method notes

1. **Extraction** — `grep -rEho '"[^"]{8,}"|'"'"'[^'"'"']{8,}'"'"'' src/...` produced 909 raw matches; technical strings (CSS class names, GROQ queries, schema.org `@type` URIs, file paths, hex colors) were filtered manually. Per-file reads of every `*.tsx` in `src/components/` and `src/app/` plus the JSON-LD generators and Sanity schemas confirmed the working list captured every visible-copy block.
2. **Banned-word sweep** — single regex pass:
   `grep -rniE "\bdelve\b|\bleverage\b|\bseamless\b|\brobust\b|\bcutting-edge\b|\bgame-changer\b|\bstreamline\b|\bempower\b|\bunlock\b|at the end of the day|in today's fast-paced|\belevated\b|\bnestled\b|\bboasts\b|\bindulge\b|passionate about|dive deep|experience the magic|award-winning" src/ docs/discoverability/`
   Returned 5 hits initially (all `elevated`); 0 after rewrites.
3. **Press pull-quotes preserved verbatim** — Guy Fieri, Kara McMillian, Detroit News quotes in `src/app/press/page.tsx` are sourced quotations and must not be rewritten regardless of tone.
4. **Sanity schema descriptions** — these only appear inside Sanity Studio (not the public site). They were audited for completeness; none contained banned words, and they read as practical editor instructions rather than visitor copy. Left as-is.
5. **JSON-LD generator copy** — only descriptive props (`name`, `description`, headlines) were audited; types, URLs, and identifiers skipped per task scope. The `LocationFeatureSpecification` names ("Outdoor seating", "Dog-friendly", "Wheelchair accessible entrance", "Free parking lot") are factual and pass.

## Verification

- `grep -rniE '<banned-words>' src/ docs/discoverability/` → 0 matches.
- `pnpm build` → success (one expected Sanity-fetch warning because `production` dataset is not configured in this worktree; not a copy issue).
