# Capture Pass Reconciliation

*Two analyses of the same 33 photos exist: `flytrap-capture-audit-and-discoveries.md` (made earlier) and `flytrap-capture-debrief.md` (made just now). This note reconciles them so the build kickoff doesn't get conflicting information.*

---

## Where the two docs agree

These observations are mutually confirmed and should be treated as locked findings going into Sunday's build:

- **17 distinct fly paintings** (debrief catalogs 17, audit catalogs ~17). Same set.
- **Pressed-tin ceiling** — original to the building, not in any prior press
- **Marble theme is layered** — bar top + wall-mounted spheres
- **Custom "the fly trap" branded portrait painting** above the back-bar
- **Three taglines confirmed:** *a finer diner* (primary), *Under Old Management* (secondary), *Catch a Buzz* (tertiary)
- **Toast POS confirmed** at the register — Open Q #2 in the design doc resolves to "yes, Toast"
- **Daily specials are named** after pop-culture figures (*The Lee Ho Fooks*, *The Hari Kondabolu*) — same naming culture as the menu
- **Domain on print is `.com`**, not `.net` — should verify ownership and prefer .com
- **Capture gaps** — exterior, dining room, food, salt-and-pepper shakers, receipt close-up, clean red wall — none blocking, all addressable on a return visit
- **Wordmark is captured cleanly** from the printed menus — vector-traceable for the design system

## Where the two docs disagree (and which to trust)

| Topic | Debrief (mine) | Audit (parallel) | Reconciliation |
|---|---|---|---|
| **Back-bar portrait identity** | "Vintage athlete (boxer or baseball player)" | "Joe Strummer (The Clash) with 'the fly trap' graffiti tags" | **Audit is more likely correct.** The figure's cap is a newsboy/punk aesthetic, not a baseball cap, and the collage style fits Strummer iconography. Defer to audit. Verify by asking on next visit. |
| **Visit date** | "Saturday April 25, 2026" (EXIF-confirmed from photos) | "Sunday April 26, 2026" | **Debrief is correct.** Photo EXIF timestamps are 2026-04-25. The audit's date is wrong. |
| **Color of bar walls** | Described qualitatively as "gray" | Sampled to hex: `#797A7E` (gray-lavender) | **Audit is more useful.** The hex sample is a build-ready token. |
| **Color of bar epoxy** | Described qualitatively as "fire-engine red" | Sampled: `#992F1E` ("deep brick-red, NOT fire-engine") | **Audit is more useful and more accurate.** `#992F1E` is the deep-brick value to use. The press-described "fire-engine red" is presumably the dining-room walls (un-captured). |
| **Color zoning** | Implied — "red is an accent across surfaces" | Explicit — three-zone model (gray bar / yellow corridor / red dining room) | **Audit is the better framing.** The room is *zoned*, not monochromatic. The website can mirror this with section-level color zones. |
| **Hero rotation** | Recommends five specific paintings (Art Class, Fly Fishing, Dinner Date, Kissing, Eye Doctor) and explicitly excludes the three bathroom-context pieces from home page | Lists all 17 without preferential ordering | **Debrief is the better framing.** The bathroom-context pieces shouldn't anchor the home page even though they belong in the catalog. |
| **About page anchor** | Specifically argues "Fly Art Class" piece IS the brand thesis in one image and should anchor the About page | Lists it as #3 in inventory, no special elevation | **Debrief is the stronger creative call.** The art-class piece is the recursive joke that says everything about the brand in one image. |
| **People-in-photos consent** | Not flagged | Flagged — staff at POS and customer at counter visible in back-bar shots; recommends cropping or consent | **Audit caught a real issue.** Adopt: crop people out of any photo we ship in Phase 1 of the spec build, or get explicit consent post-handoff. |

## Net implications for the design doc (v1.7)

The current v1.6 of the design doc was updated by the audit pass. It already has:
- The three-zone color model (good)
- Sampled color hex tokens (good)
- "Catch a Buzz" as a third tagline (good)
- Toast POS confirmed (good)
- "Joe Strummer" attribution for the back-bar portrait (probably correct, verify next visit)

What v1.6 should additionally pull from the debrief:

1. **Hero rotation discipline** — explicitly list the five home-page hero pieces and exclude the bathroom-context three. This becomes a content-design rule, not just a curation note.
2. **About page anchor** — call out that the *Fly Art Class* piece is the brand thesis in one image and should anchor the About page hero.
3. **People-cropping rule** — codify in the asset-handling section: any photo with identifiable staff or customers gets cropped or held until consent post-handoff.
4. **Capture date** — confirm Saturday April 25, not Sunday April 26.

I'll fold those into a v1.7 update if you'd like, or leave v1.6 as-is and pick this up at Sunday kickoff. Either is fine.

---

## What this means for the kickoff prompt

The kickoff prompt in `flytrap-sunday-game-day.md` already references the design doc and companion specs. If we add the *Capture Audit and Discoveries* doc to the references list (alongside the *Debrief*), the build session has both perspectives and can resolve the small disagreements above as design decisions made in the moment.

Suggested addition to the kickoff prompt's `## What exists` section:

```
- Capture Audit & Discoveries: flytrap-capture-audit-and-discoveries.md
- Capture Debrief: flytrap-capture-debrief.md
- Capture Reconciliation: flytrap-capture-reconciliation.md  ← THIS DOCUMENT
```

That way Sunday's build session walks in with all three, knows where they agree, and knows where to make a call.
