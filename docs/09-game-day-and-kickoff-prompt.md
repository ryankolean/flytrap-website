# Sunday Game Day

*Capture, organize, and kickoff — all on Sunday, April 26.*

---

## The day

| When | What | Output |
|---|---|---|
| Sunday morning | Visit The Fly Trap, execute Weekend Shot List v2 | Raw phone captures, receipt, menu photos, intel notes |
| Sunday afternoon | Organize assets per folder spec below; transcribe or OCR the menu | A clean `flytrap-capture-2026-04-26/` folder ready for the kickoff |
| **Sunday 7–10pm** (calendar-blocked) | Paste the kickoff prompt into a fresh Claude Code session | `flytrap-website` repo scaffolded + Dispatch execution plan |
| Sunday night → next weekend | Dispatch executes in the background; you review PRs | First pass of the site |

Two calendar events already on your Sunday:

- `[Summit] Fly Trap on-site capture` — all-day, tomato color, full shot list in description
- `[Summit] Fly Trap build kickoff` — 7–10pm, blueberry color, kickoff prompt references in description

The window between 3pm (when the diner closes) and 7pm is your asset-organize and menu-transcription block. Don't skip it. Going straight from lunch to code kickoff without organizing the photos first will cost you more time than the 90 minutes of sorting saves.

---

## Sunday afternoon: asset organization

### Folder structure

Create this locally (or in iCloud Drive / Google Drive — wherever you prefer for Claude Code to access):

```
flytrap-capture-2026-04-26/
├── 01-artwork/
│   ├── fly-paintings/           (individual, dead-center shots)
│   ├── fly-paintings-context/   (wider shots showing placement)
│   ├── other-art/               (non-fly pieces)
│   └── signatures/              (artist marks if found)
├── 02-bar/
│   ├── marble-inlay-closeup.jpg
│   ├── bar-full-length.jpg
│   ├── bar-stool-pov.jpg
│   └── back-bar.jpg
├── 03-seating/
│   ├── dining-room-wide.jpg
│   ├── booth-details/
│   ├── window-table.jpg
│   └── table-setting.jpg
├── 04-details/
│   ├── checkerboard-top-down.jpg
│   ├── checkerboard-depth.jpg
│   ├── red-wall-clean.jpg       ← CRITICAL for color calibration
│   ├── salt-pepper-full.jpg
│   └── salt-pepper-closeups/
├── 05-exterior/
│   ├── storefront-wide.jpg
│   ├── signage-closeup.jpg
│   ├── entry-door.jpg
│   └── golden-hour/             (if you get any)
├── 06-food/
│   ├── gingerbread-waffles-overhead.jpg
│   ├── forager-overhead.jpg
│   ├── pho-overhead.jpg
│   ├── swat-sauce-tabletop.jpg
│   └── other-plates/
├── 07-menu/
│   ├── page-1.jpg
│   ├── page-2.jpg
│   ├── ...
│   ├── specials-board.jpg
│   └── menu-transcribed.md      ← fill this in Sunday afternoon OR OCR at kickoff
├── 08-receipt/
│   ├── receipt-full.jpg
│   ├── under-old-management-closeup.jpg
│   └── other-branded-material/
├── 09-room-overall/
│   └── (panoramas, transitions, atmosphere)
└── notes.md                      ← fill this in Sunday afternoon
```

### `notes.md` template (fill in Sunday afternoon)

```markdown
# Fly Trap Visit Notes — 2026-04-26

## Intel answers
- Artist who painted the fly art: ___
- POS system confirmed: ___ (look for "Powered by Toast" on receipt)
- Existing online ordering: ___ (DoorDash sticker? Toast? Nothing?)
- Who runs Instagram: ___
- Gigi still around: ___
- "Under Old Management" exact wording on receipt: ___
- "Under Old Management" placement (receipt only? also signage? merch?): ___

## Relational
- Did you see Kara: ___
- Did you plant the minimum flag: ___
- Reactions from staff: ___
- Any unexpected information: ___

## Things I didn't expect
- ___

## Things I need to go back for
- ___
```

### Menu transcription (Sunday afternoon, optional)

The printed menu is the canonical content source for the website Menu page. Two options:

**Option A — Manual transcription (~30 min, Sunday afternoon).** Pros: forces you to actually read the voice of the menu, which is exactly the voice the website needs to match. Cons: 30 minutes of typing.

**Option B — OCR at kickoff (~5 min, Sunday evening).** Drop the menu page photos into Claude Code at the start of the build session and let it handle extraction and structuring. Pros: saves time. Cons: you skip the chance to absorb the voice yourself.

Recommendation: if you're pressed for time, go B. If you have the afternoon to spare, A pays off in the build.

Structure when transcribed:

```markdown
# The Fly Trap — Menu (transcribed 2026-04-26)

## All Things Eggs
### Green Eggs and Ham — $XX.XX
Poblano Pesto and Jack Cheese Rumbled with Eggs Sidled by Seared City Ham

### The Forager — $XX.XX
(description exactly as printed)

...

## Oh Sugar Shack
### Gingerbread Waffles — $XX.XX
...

## Green Things
...

## Between Bread
...

## Other Stuff
...

## Drinks
...
```

Match their section names exactly. Preserve whimsical copy verbatim — that voice is the single most irreplaceable brand asset.

---

## Sunday 7pm: kickoff prompt

Calendar reminder fires at 7pm. First thing to do: open a fresh Claude Code session in your preferred environment and paste the block below. It chains `gh-repo-create` → `architect-plan-for-dispatch` → `design-doc-review` using all the strategy work we've done.

```
I'm kicking off the Fly Trap website build. Context and assets are ready.

## What exists
- Full design document: flytrap-website-design-document-v1.md (v1.5, 15+ sections)
- Four companion specs:
  - flytrap-weekend-shot-list-v2.md
  - flytrap-press-page-spec.md
  - flytrap-seo-aeo-strategy.md
  - flytrap-instagram-integration-spec.md
- Photo assets: ~/Projects/flytrap/flytrap-capture-2026-04-25/
- Menu transcribed (or menu photos for OCR): in capture folder
- Visit notes: notes.md in capture folder
- Capture audit & discoveries: flytrap-capture-audit-and-discoveries.md
- Capture debrief: flytrap-capture-debrief.md
- Capture reconciliation (read this first — flags where the two analyses agree and disagree): flytrap-capture-reconciliation.md

## What I want, in order

Step 1 — Run the gh-repo-create skill to scaffold:
- Repo name: flytrap-website
- Owner: ryankolean
- Private: yes (for now, until Kara sees it)
- Include .claude/dispatch scaffold
- Include CLAUDE.md oriented around the build-then-offer engagement

Step 2 — Run the architect-plan-for-dispatch skill against the design doc + companion specs.
The output should be a Dispatch execution plan that covers:
- Next.js 15 (App Router) + Tailwind scaffold
- Sanity CMS schema for menu items, press entries, FAQ, daily specials
- All eight home-page sections per §9 of the design doc
- Menu / Order Online (stub) / Shop (stub) / About / Press / FAQ / Visit routes
- Instagram integration UI wired to MOCK DATA (see instagram-integration-spec §Phase A)
- Toast ordering "Coming Soon" stub with intent-capture form
- Full JSON-LD schema per seo-aeo-strategy doc
- robots.txt, sitemap.xml, llms.txt at root
- AI-generated fly spot-illustrations as placeholders (clearly marked)

Step 3 — Before handing off to Dispatch, run the design-doc-review skill against this
full package one more time. Goal: catch anything we missed before we commit 2-3 weekends of build.

## Non-negotiables
- Engagement model is build-then-offer. No OAuth, no live integrations, no paid services
  during the spec build. Everything monetized or credentialed stays stubbed until Kara agrees.
- No emojis on the site itself.
- Copy voice: match the existing About page voice ("magnificent life," "beloved and inquisitive
  customers," "Buzzin' since 2004"). Preserve verbatim where it exists.
- Mobile-first. Every layout decision starts on a phone viewport.
```

Save this as `/flytrap-sunday-kickoff.md` in your home directory if you want it version-controlled alongside the assets.

---

## If something goes sideways

**If you didn't get all the P0 shots Sunday morning:** Go back during the week. Don't fake it with stock photography. The whole premise of the pitch is that the site is *specifically* The Fly Trap, not a generic diner template. The 7pm kickoff can slip — the Dispatch plan is valuable on Tuesday too.

**If Kara was on shift and the conversation got deeper than planned:** That's good. Update the Open Questions in the design doc with whatever you learned before the 7pm kickoff. If she asked anything specific ("can it do online ordering through Toast?"), note it — that becomes a Phase 2 priority.

**If the menu transcription runs long:** Switch to OCR at kickoff. Don't burn the afternoon on typing if it's eating into asset organization.

**If your Claude credits don't reset Sunday as expected:** The architect-plan-for-dispatch step is the heaviest; push the kickoff to Monday evening if needed. The gh-repo-create + CLAUDE.md scaffold is lightweight and can be done on existing credits to stay productive.

---

## One-sentence reminder for Sunday morning

The visit is content gathering and minimum flag planting — not a pitch. Leave with photos, leave with the menu, leave with the artist's name if you can, and leave Kara curious without promising anything.
