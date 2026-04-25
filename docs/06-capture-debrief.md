# Fly Trap On-Site Capture — Debrief

**Visit:** Saturday, April 25, 2026, ~10:00 AM EDT
**Photographer:** Ryan
**Captures:** 33 photos at 4080×3072 (Pixel)
**Organized assets:** `/home/claude/flytrap-capture-2026-04-25/`

---

## TL;DR

The capture is **a windfall**. We didn't just confirm the design hypothesis from v1.5 of the design doc — we found:

- **17 individual fly paintings** (we'd hypothesized "many"; we now have 17 named, catalogued, photographed straight-on under glass)
- **Two new taglines** beyond "a finer diner" and "Under Old Management": **"Catch a Buzz"** (printed on menu) and **"Buzzin' since 2004"** (already known)
- **The official wordmark** in vector-quality clarity from the printed menu (the script "the fly trap" + handwritten "a finer diner" with tiny fly motif)
- **Hand-fabricated checkerboard restroom signage** — proves the checkerboard motif extends beyond floor to bespoke environmental graphics
- **Wall-mural fly silhouettes** behind the bar (giant flies, not just framed art)
- **Sculptural marble spheres** mounted as wall art (the marble theme extends from bar surface up the wall)
- **Pressed-tin ceiling** original to the 1907 building — never mentioned in any press, gorgeous textural asset
- **The full menu** (3 pieces: main, beer, cocktails) with prices, dish names, and a tagline ("Catch a Buzz")
- **A retail line that's bigger than we thought**: Swat Sauce + Jam ($8/jar) confirmed via specials chalkboard
- **Confirmed POS**: looks like Toast based on the touchscreen form factor (good)
- **Daily specials format** — chalkboards on the wall behind the bar, with dish names that follow the same naming culture as the menu (one named after Hari Kondabolu, one after the Warren Zevon song "Werewolves of London")

This dramatically strengthens the build. We have more than enough to ship a full first pass tomorrow, and several pieces are good enough to be hero assets without any reshoot.

---

## The Fly Paintings — Catalog

All 17 individual fly paintings are now in `01-artwork/fly-paintings/`. Each one is a **pencil-and-watercolor** mixed-media piece, framed under glass on what looks like dark gray or olive-toned mat. The artist's signature visual move is **anchoring a real-looking watercolored fly body to a stick-figure pencil-line scene** — the fly is rendered with care, the world around it is sketched fast and loose. It's a sophisticated technique that lets the fly be the dignified center of every joke.

| # | Title (working) | Subject | Brand value |
|---|---|---|---|
| 01 | Fly Perched on Blank Page | A single fly at top-right of an almost-empty page with a tiny landscape sketched along the bottom | Quiet, contemplative. Hero candidate for "About" page intro |
| 02 | Fly Asleep in the Recliner | A fly slumped in an armchair, drink in hand, ottoman, TV in background, "zzz" floating up | Universal "dad nap" trope — instantly relatable |
| 03 | Fly Art Class | An art class with a fly model on a pedestal at center, three fly artists at easels painting it | **The brand thesis in one image.** Recursive, self-aware. **Anchor piece for the About page.** |
| 04 | Fly on Horseback | A small bewildered horse with a fly mounted on it, drawn in cowboy posture | "Cowboy Curtis" connection — could appear on the menu page near that dish |
| 05 | Flies Playing Hopscotch | Two flies, one mid-jump, the other watching, hopscotch grid drawn out | Childhood, play. Site footer candidate |
| 06 | Fly Fly-Fishing | A fly in waders on a tackle box, casting a line at another fly | **The pun is perfect.** Hero candidate; potential merchandise piece |
| 07 | Fly Band & Buskers | A fly band on the right (tuba, trumpet) with two flies on the left dropping coins in a tip jar | Music, community. Section divider candidate |
| 08 | Flies on a Dinner Date | Two flies at a candlelit dinner with wine, curtains, tablecloth | **Marketing gold for "a finer diner"** — this is the romance of the place |
| 09 | Suburban Summer | One fly mowing the lawn, another lounging under an umbrella with a martini, pointing back at the worker | Observational humor |
| 10 | Lightsaber Duel | Two flies in a Star Wars saber clash, blue vs. red blades | Pop culture awareness — the artist is in conversation with the wider world |
| 11 | Kissing on a Hilltop | Two flies kissing, hearts floating up | **Tender Valentine card piece** — direct merch candidate |
| 12 | Desert Castaway | A fly collapsed at the end of a long crawled trail through dunes under a sun | Looney Tunes desert gag with empathy |
| 13 | The Eye Doctor (two versions) | A fly optometrist points at a chart that reads "FLY / PROL / IZHN / BVRS"; patient fly squints from a stool, guesses "K" | **The chart literally spells "FLY" — diegetic branding.** Hero candidate |
| 14 | Fly on the Toilet | A fly mid-business, reaching for TP | Bathroom-context, probably hung in or near restrooms |
| 15 | Bathroom Line | A row of flies waiting at the men's/women's restroom doors, one impatient | Bathroom-context companion to #14 |
| 16 | Flies at Urinals | Two flies at the urinals, body language doing all the work | Bathroom-context completes the triptych |
| 17 | Drunk Fly | One fly partying with a beer, the other looking forlorn near a paper-towel dispenser | Tonal range — the artist trusts the viewer with bittersweet |

**Important distinction for the website:** pieces 14, 15, 16 are bathroom-context. They belong in the catalog and gallery but **shouldn't anchor the home page**. The hero rotation should be: 03 (Art Class), 06 (Fly Fishing), 08 (Dinner Date), 11 (Kissing), 13 (Eye Doctor). Those five are the most universally appealing.

---

## Photography quality notes

All paintings were shot through **glass under glare conditions**. Reflections of Ryan's silhouette appear in many shots, especially on darker mats. For the build:

- **Crop tighter** — most pieces have ~15-20% wasted frame outside the painting itself
- **Use perspective correction** to square up the slight tilt in some shots (~5° on a few)
- **Glare patches** in the upper portion of several photos can be in-painted or cropped if not too central
- **For the website**, lower-resolution presentation (max ~1200px wide) hides most flaws; for any print or merchandise use, a re-shoot without glass would be needed

A reshoot is **not blocking the build**. These are good enough to ship.

---

## The Bar — what we learned

The "marble inlay bar top" is more spectacular than press described. **The entire surface is colored marbles suspended in red epoxy**, edge to edge, at high density. Marbles are mostly handmade-looking — swirls, eye patterns, solid colors, semi-translucent. Density is so high that the red epoxy serves as grout, not background.

The bar runs along an entire wall (long, ~12-15 feet). Back-bar features:

- Tiered liquor shelves (3 levels) with full liquor selection
- A **collage portrait painting** of what appears to be a vintage athlete (boxer or baseball player based on the cap), with red-and-gold paint splashes and "the fly trap" hand-lettered across the figure's chest. **Original art commissioned for the space.**
- **Two giant fly silhouettes painted directly on the wall**, hovering mid-air above the back-bar shelves. Mural-scale, loose, gestural.
- A POS terminal that strongly resembles a Toast unit (touchscreen, kitchen-display style)

The walls in the bar area are **gray, not red**. The fire-engine red is concentrated:
- In the bar-top epoxy (visible at the bottom of frame)
- On the menu wordmark
- In other areas of the restaurant we didn't photograph in detail

**Implication for the design system:** Red is the brand accent, not the brand wallpaper. Treat it as we do `flytrap-red` token in the design doc — for CTAs and key emphasis — not as a primary background.

---

## The Marble Spheres (new discovery)

A wall behind the bar has **~12 large decorative spheres** mounted directly to the wall. Each is unique — different patterns and colors. They look like oversized marbles or art-glass spheres, ~6-8 inches each. Among them are mounted painted/chalkboard signs with the daily specials.

This is a **marble theme that scales from bar surface (small marbles in epoxy) → wall sculpture (large spheres) → entire material vocabulary**. Whoever designed this space did it with intent.

For the website: this gives us the **marble-halftone motif** real visual reference. The colors and patterns to sample for the marble accents are right there in `04-details/marble-spheres/`.

---

## The Pressed-Tin Ceiling (new discovery)

Two photos confirm a **gorgeous original pressed-tin ceiling**. Embossed square panels with rosettes, patinated to a tarnished silver-gray. Modern track lighting bolted right through. This is **architectural history** — almost certainly original to the 1907 building.

For the website: this is a stunning **textural background pattern** at low opacity behind hero text or section dividers. Far more authentic than anything we'd source from a stock library.

---

## The Menu — full transcription source

**6 photos covering 3 separate physical menus:** main (front + back), beer, cocktails. All shot against the marble bar (so we get bar-top context shots for free).

### Wordmark (now confirmed)

Top of every menu:
- **"the fly trap"** in custom red script (slightly tilted, hand-drawn feel, decorative serif)
- **"a finer diner"** in handwritten cursive directly underneath
- **A small fly motif** to the right of "diner" (looks like a tiny cartoon fly with a horizontal-line trail behind it — like a doodle, fly-in-flight)
- **Checkerboard border** around the entire menu (1cm black-and-white squares)

The wordmark is treated as a **watermark** behind the beer/cocktail menus too (large, pale green, behind the text). This is a confident, established visual identity.

### Confirmed sections

**Main menu front:**
1. **All Things Eggs** — "Comes With Toast & Smashed Garlic Fried Potatoes when Logical"
2. **Oh, Sugar Shack!**
3. **Green Things** — "All Salads Come with Grilled Bread"

**Main menu back:**
4. **Between Bread** — "All Sandwiches Come with Fries, Small Salad or House Spuds & Something Pickled"
5. **Other Stuff** (entrees)
6. **Whistle Wetters** (non-alcoholic drinks)
7. **B-Sides** (à la carte sides — note the music-album reference)

**Beer menu:** Beer / On Draft / Bottles / Cans / N/A
**Cocktail menu:** Fly Mimosas / Cocktails / Wine

### Confirmed taglines

- **"a finer diner"** (primary, on every menu)
- **"THE FLY TRAP HAS A FULL BAR! BEER, WINE AND BOOZE...CATCH A BUZZ!!!"** (red callout on main menu back)
- **"Catch a Buzz"** (extracted from above — a recurring phrase that should be elevated to secondary tagline status)
- **"Buzzin' since 2004"** (already known from About page voice)
- **"Under Old Management"** — *not seen on any printed menu*. May be receipt-only. Verify on next visit.

### Footer / contact (confirmed)

> 22950 Woodward Ave. Ferndale, MI 48220 · 248-399-5150 · **www.theflytrapferndale.com**

**They use the .com, not the .net.** This is a meaningful correction — the existing live site at theflytrapferndale.net is not the canonical domain they're putting on print materials. Either they own both, or the .com is what they want and the .net was a Buskard-era artifact. **Question for Sunday's kickoff: do they own theflytrapferndale.com?** If yes, we build to that domain. (DNS check is a 10-second job in the build.)

### Pricing tier

- **Eggs / breakfast entrees:** $7.95–$18.95 (median ~$14.95)
- **Sandwiches:** $12.95–$18.95
- **Other Stuff (entrees):** $13.95–$16.95
- **Sides (B-Sides):** $2.95–$7.00
- **Cocktails:** $5–$11
- **Beers:** $3–$8
- **Mimosas:** $8 individual / $30 for the table

### Vegetarian/Vegan flag system

A small **green leaf icon** appears next to dishes that are vegetarian. Footer note: *"=VEGETARIAN, ALL dishes can also be made VEGAN with modifications (except the Mac)"*.

This is a **schema.org `MenuItem.suitableForDiet` opportunity** — easy AEO win for "vegan/vegetarian breakfast Ferndale" queries.

### Naming culture (sample, full list in folder)

The menu is **wall-to-wall named dishes**, no generic "two eggs and toast" entries:

- *Green Eggs and Ham* (Dr. Seuss)
- *The Boot* — "Mussolini's Fave" (an Italian rumble — *very* on the nose)
- *The Forager* (mythic / outdoors)
- *Cowboy Curtis* (Pee-wee's Playhouse)
- *Eggs ala Boring* (self-aware joke about plain eggs)
- *El Burrito Bonito* (rhyme)
- *B.L.A.T.+C.* (acronym pun)
- *Bocca al Lupo* (Italian "good luck" idiom)
- *Slacker Especial* (Spanglish)
- *Pea Patch Papoose* (alliteration)
- *Charmoula Chicken* (North African)
- *The Cheapsteak* (pun on "cheapskate")
- *Jeremy's Mess*
- *The Paddy Wagon* (Irish brisket joke)
- *The E-Z Chi-Z* (kimchi grilled cheese)
- *Tempting Tempeh* (alliteration)
- *Red Chili Salmon Burger*
- *Fire-Breathing Dragon* (Thai peanut chicken)
- *Mac Loves Cheese* (mac & cheese pun)
- *Lemongrass Faux Bowl* (pho pun → faux)
- *Howie's Noodles*

**Cocktail names:** *The Fly Bloody Mary* (with house-made Swat Sauce mix), *Spanish "Fly" Coffee*, *Gherkin Around*, *The Clam-ity Jane*, *Rhubarb's Rub*

**Daily specials chalkboard names:** *The Lee Ho Fooks* (Warren Zevon ref), *The Hari Kondabolu* (comedian)

**The naming culture extends to staff:** *"Some Kinda IPA — ASK SHANNON"* on the beer menu names a staff member directly. The bartender is part of the menu.

---

## Things I now know that aren't in v1.5 of the design doc

1. **The .com domain** is what's on print materials — not the .net.
2. **Three taglines/lockups exist**, not two: "a finer diner" + "Under Old Management" + "Catch a Buzz" (plus "Buzzin' since 2004" as origin handle).
3. **The fly motif extends to wall-scale murals** behind the bar — not just framed art.
4. **The marble theme is layered**: bar-top marbles → wall-mounted spheres → red epoxy as the unifying medium.
5. **A pressed-tin ceiling** is present and beautiful — this is a textural asset we can use directly.
6. **Hand-fabricated bespoke signage** exists (the checkerboard restroom plate). The brand is *built* into the building, not just decorated onto it.
7. **The retail line includes jam** ($8/jar), not just hot sauce and merch.
8. **Daily specials are themselves named** following the same culture (*Lee Ho Fooks, Hari Kondabolu*) — they aren't generic descriptions.
9. **The bar walls are gray, not red.** Red is concentrated in specific accent zones, not blanketing the space. *(Design doc color usage already had this right — `flytrap-red` is for accents — but the section "Fire-engine red walls" in §4 needs softening to "Fire-engine red accents and surfaces.")*
10. **Custom "the fly trap" branded portrait painting** exists above the bar — another artist has done commissioned work for them.
11. **POS is most likely Toast** — visible touchscreen unit in two of the bar shots is consistent with a Toast Flex or Toast Go terminal. **Verify on Sunday's build by asking explicitly.**

---

## Things still needed (next visit OR Sunday during build)

These are gaps in P0/P1 from the original shot list. None block the build, but we should plan a second visit.

- [ ] **Receipt with "Under Old Management" tagline close-up** (P0 from the shot list — not captured)
- [ ] **Exterior of the building** (yellow-green storefront, signage, door) — *missing entirely from this batch*
- [ ] **Plates of food** (hero dishes — gingerbread waffles, The Forager, pho, Swat Sauce on the table)
- [ ] **The dining-room interior** — separate from the bar area; this is where the red walls are
- [ ] **Booth and table-setting details** in the dining room
- [ ] **The salt-and-pepper shaker collection** (mentioned in press, not captured here)
- [ ] **Black-and-white checkerboard floor** — visible only at the very edge of one frame
- [ ] **A clean section of unbroken red wall** — for color calibration

The capture covered the **bar area, the artwork, the menus, and architectural details (ceiling, marble spheres, restroom signage)** very thoroughly. It did NOT cover the dining room, the food, or the exterior. That's a meaningful capture gap, but it doesn't block the spec build — we have publicly-available Instagram and press photos for those, and we can frame a second visit as "follow-up shoot for the website" once Kara is on board.

---

## Intel Answers

| Question | Answer |
|---|---|
| Artist who painted the fly art | *Not gathered yet. Highest priority for next visit.* |
| POS confirmed | **Likely Toast** (touchscreen form factor visible at register) |
| Existing online ordering | *Not gathered* |
| Who runs Instagram | *Not gathered* |
| Gigi still around | *Not gathered* |
| "Under Old Management" exact wording on receipt | *Not captured — no receipt photographed* |
| Did you see Kara | *Tell me — should be in your notes* |
| Did you plant the minimum flag | *Tell me — should be in your notes* |

---

## Recommendation for Sunday's build kickoff

**Proceed with the kickoff as planned.** This capture is more than enough to ship a credible first pass of the entire site. Specifically:

- **The 17 fly paintings** populate the entire artwork gallery and About page hero rotation
- **The bar shots** give us authentic "Visit / The Room" content
- **The menu photos** give us OCR-able content for the Menu page (drop into Claude Code at kickoff for transcription — Option B in the bridge doc)
- **The marble bar, the spheres, the tin ceiling, the checkerboard signage** give us a textural and motif vocabulary that's specific to this restaurant
- **The wordmark from the printed menu** can be vector-traced in Phase 1 design and used cleanly across the site

**Minor design doc updates needed before kickoff:**

1. Update §4 to soften "fire-engine red walls" → "fire-engine red accents (bar epoxy, wordmark, signage)"
2. Add "Catch a Buzz" as a confirmed third tagline alongside "a finer diner" and "Under Old Management"
3. Update §6 motif system to include the **giant marble spheres** and the **pressed-tin ceiling** as discovered design vocabulary
4. Update §15 Open Question on domain: theflytrapferndale.com is on print materials → check if owned, prefer over .net
5. Update §13 (Asset Inventory) to mark P0 fly art as **DONE** and shift exterior/dining-room/food/receipt to P0 for next visit

I'll make those updates in the next pass once we have the intel answers from your visit notes.

---

## One thing that surprised me, looking at all this together

The Fly Trap is a **more sophisticated design object** than I'd assumed from the press write-ups. Press kept calling it "quirky" and "Pee-Wee's Playhouse" — the language of *kitsch*. But these photos show something else:

- A coherent visual system with three intentional motifs (fly, marble, checkerboard) that scale from menu border to wall mural to bespoke signage
- Original commissioned art (the fly paintings, the back-bar portrait) by skilled artists
- A pressed-tin ceiling preserved with care
- A naming culture so consistent it extends to *daily specials and individual menu items mentioning specific staff members by name*

This is not kitsch. This is **a fully-realized brand world that the McMillians have been building for 22 years.** The website needs to honor it at that level — not as a quirky diner site, but as a digital extension of a real artistic project. That's the bar.
