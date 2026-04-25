# The Fly Trap: A Finer Website
## Design Document v1.0

*A mobile-first scrolling redesign for theflytrapferndale.net*

**Project owner:** Summit Software Solutions LLC
**Client (TBD — see Open Questions):** The Fly Trap, 22950 Woodward Ave, Ferndale, MI
**Status:** Phase 0 — Strategy & Design Direction
**Version:** 1.7
**Last updated:** April 25, 2026

> **What changed in v1.7:** Reconciled two parallel capture analyses (audit + debrief) — see `flytrap-capture-reconciliation.md`. Three folds from the debrief into v1.6: (1) hero-rotation discipline — five specific pieces named for home-page rotation, three bathroom-context pieces explicitly held back to the catalog/gallery; (2) the *Fly Art Class* piece named as the brand-thesis anchor for the About page hero; (3) a people-in-photos handling rule added — staff and customers cropped or held until consent post-handoff. Capture date corrected to Saturday April 25 (EXIF-verified).
>
> **What changed in v1.6:** On-site capture completed. Real color palette sampled from photos (replacing v1.0 placeholders). Color zoning model added — the room is not monochromatic, it's three-zoned (red bar/dining, gray bar walls, yellow corridor). Third tagline discovered: *Catch a Buzz* on the menu drinks line. Pressed-tin ceiling and ceramic orb wall installations added as architectural assets. Toast POS confirmed (Open Q #2 resolved). Joe Strummer brand portrait, restroom sign, and 17+ individual fly paintings catalogued — see Capture Audit doc. Menu fully captured both sides + drinks card.
>
> **What changed in v1.5:** Engagement model locked — Summit builds the complete site speculatively and offers the finished product to Kara when done. Online ordering now stubbed as a "Coming Soon — Powered by Toast" section in the IA. Instagram integration repositioned as a live-at-handoff feature.
>
> **What changed in v1.4:** Relationship context added — Ryan has rapport with Kara McMillian. Added Section 16 on engagement model.
>
> **What changed in v1.3:** Corrected ownership — McMillians took back ownership October 2024. Added "Under Old Management" tagline.
>
> **What changed in v1.2:** Added Press and FAQ as first-class IA pages. Added 7th principle on discoverability. Companion specs produced.
>
> **What changed in v1.1:** Elevated fly artwork to brand thesis. Expanded motif system. Added Instagram as primary content channel.

---

## 1. Vision

The Fly Trap is a Ferndale institution because it is **alive**. Checkerboard floors. Fire-engine red walls. Real marbles set into the bar top. Pee-Wee's Playhouse energy. A collection of wacky salt-and-pepper shakers. Fly art on the walls. Vietnamese pho served next to gingerbread waffles. The physical space is a love letter to joyful maximalism, and for twenty-plus years it has been the thing that regulars — and Guy Fieri — show up for.

The current website is the opposite. Lorem ipsum still sits in the "Today's Specials" section. The menu tabs run `javascript:;` and do nothing. The "Order Online" button points to `#`. The social icons go to generic facebook.com and twitter.com — not their actual accounts. The hours on the homepage say "Sat–Sun only" when the diner actually operates Monday through Sunday. It is a serviceable brochure for a place that deserves a shrine.

This redesign gives The Fly Trap a digital storefront worthy of *a finer diner* — a scrolling, mobile-first experience that feels like walking through the front door: loud in the best way, detail-packed, warm, and deeply confident in its own weird.

### Companion documents

This design document is the strategic spine. Four companion specs break out the tactical detail:

- **Weekend Shot List v2** — on-location photo capture checklist (artwork, bar, seating, menu)
- **Press Page Spec** — inventory of press coverage, pull quotes, page layout, schema markup
- **SEO / AEO Strategy** — technical SEO, answer-engine optimization, structured data, llms.txt, FAQ content architecture
- **Instagram Integration Spec** — automated pull from @theflytrapferndale with hashtag-based specials filtering

---

## 2. Who The Fly Trap Is

| | |
|---|---|
| **Opened** | December 28, 2004 |
| **Address** | 22950 Woodward Ave, Ferndale, MI 48220 |
| **Phone** | (248) 399-5150 |
| **Email** | dine@theflytrapferndale.com |
| **Hours** | Monday–Sunday, 8am–3pm |
| **Current ownership** | Kara & Gavin McMillian — original founders, returned to ownership October 2024 after operations were transferred back from Matt Buskard (Bobcat Bonnie's, who owned 2022–2024) |
| **Primary tagline** | *a finer diner* |
| **Secondary tagline** (on receipts) | *Under Old Management* |
| **Tertiary tagline** (on the bar/drinks menu) | *Catch a Buzz* |
| **Origin-story handle** | *Buzzin' since 2004* |
| **Credentials** | Featured on Food Network's *Diners, Drive-Ins and Dives* |
| **Retail** | Swat Sauces (three housemade hot sauces), gift cards, branded t-shirts |

### The ownership arc (matters for About page + pitch)

The Fly Trap's recent history is a genuine return-of-the-founders story, and it has become part of the brand:

- **2004** — Kara and Gavin McMillian open The Fly Trap. Build it into a Ferndale institution over 17 years.
- **September 2021** — The McMillians temporarily close, citing burnout and staffing issues after the pandemic.
- **February 2022** — Sell to Matt Buskard, a long-time regular and owner of Bobcat Bonnie's. He commits publicly to preserving The Fly Trap unchanged.
- **March 2022–October 2024** — Fly Trap operates under Buskard. Reviews confirm the preservation held.
- **October 13, 2024** — Buskard transfers operations back to the McMillians amid broader controversy at his other restaurants.
- **October 16, 2024** — McMillians reopen. They bring back original menu items (including the blueberry streusel mini muffins), retain all 12 staff from the Buskard era.
- **Present (April 2026)** — McMillians running it for ~18 months. Receipts carry the "Under Old Management" tagline. The current website still reflects the Buskard-era template and needs to catch up.

This is not a footnote. It's a website asset. "Under Old Management" is doing the exact same brand move The Fly Trap has always done — take a tired trope ("Under New Management"), flip it, and make people smile. It belongs in the hero lockup or immediately under it.

**Positioning in one sentence:** Elevated American diner where globally-inflected comfort food meets twenty years of bright, deliberate weirdness.

**Signature dishes worth building the site around:**
Gingerbread Waffles · The Forager (egg, mushroom, gouda rumble) · Red Flannel Hash · Green Eggs and Ham · Lemongrass Pho Bowl · Red Chili Salmon Burger · Thai Peanut Chicken · Veggie Rumble · Cowboy Curtis (steak & eggs)

---

## 3. Audit of the Current Site

The site is built on a generic WordPress diner template with content half-migrated. Documented issues, ranked:

### Critical — directly hurting the business
- **Lorem ipsum** visible in the "Today's Specials" block on the home page
- **"Order Online" CTA** points to `#` and does nothing
- **Menu category tabs** (All Things Eggs, Oh Sugar Shack, Green Things, Between Bread, Other Stuff) use `javascript:;` and don't load content
- **Hours on homepage** show "Sat–Sun only" — the diner is actually open Mon–Sun. This is actively misdirecting customers.
- **Social icons** link to facebook.com / twitter.com / linkedin.com — generic homepages, not The Fly Trap's real accounts (@theflytrapferndale on Instagram, etc.)
- **No online ordering integration** at all — the retail revenue is capped at walk-ins

### High — erodes trust and discoverability
- "Read More" buttons on About, Swat Sauces, Gift Cards, and T-Shirts all point to `#`
- No Open Graph / Twitter Card / social share metadata — shared links look blank
- No `LocalBusiness` or `Menu` structured data for Google — missing rich results
- Contact form shows "Please enable JavaScript" even when JavaScript is enabled
- Mobile experience is a passive stack of desktop sections, not designed for touch

### Medium
- Menu items show inconsistent pricing (some dishes have prices; some don't)
- Heavy use of raster `.webp` decorative headers that could be CSS
- No clear path to press coverage or the DDD feature

### What the current site does right (worth preserving)
- The wordmark (banner-logo.webp) and overall brand voice — "magnificent life," "beloved and inquisitive customers" — is on-tone and should live on
- Menu category names are great: *All Things Eggs · Oh Sugar Shack · Green Things · Between Bread · Other Stuff*
- Retail line (Swat Sauces, Gift Cards, T-Shirts) is already well-framed

---

## 4. The Whimsy: Brand DNA

Before we touch a color or font, here is what we are matching.

### Voice

- **Warm, confident, slightly theatrical.** The existing About page uses phrases like *"our magnificent life"* and *"beloved and inquisitive customers"* — that's the register.
- **Playful naming is a system, not a one-off.** Dish names are little jokes: *Cowboy Curtis* (Pee-Wee reference), *Green Eggs and Ham*, *The Forager*, *Red Flannel*, *Veggie Rumble*. The retail line follows suit — *Swat Sauces*. Every name is a small invitation to smile.
- **Proudly regional, proudly global.** Ferndale, Woodward, Detroit on one hand; pho, Thai peanut, Italian, Asian-inspired tofu rice on the other. The copy should not hide either side.
- **Opinionated but never precious.** The tone is confident, not curated.
- **Funny without trying too hard.** The fly is in on the joke.

### What the brand is **not**

- **Not retro-ironic "50s diner."** They don't lean on jukeboxes, pin-ups, or Americana kitsch.
- **Not minimalist / industrial / Instagram-cafe.** No white walls, no exposed-Edison-bulb aesthetic.
- **Not twee.** The edge is real — fire-engine red walls, not pastel. Sharp, not soft.

### The thesis on the walls

The single most important design input in this project is the collection of fly paintings hanging throughout the restaurant — flies depicted in very human situations. This is not decoration. It is the brand's thesis, expressed as art, twenty years before anyone else told them to develop a brand thesis.

**Here is what the fly art says, if you read it as a manifesto:**

The thing you were told to dislike — a fly — we're going to dignify, anthropomorphize, and make funny. We're going to put it on the wall. We're going to make you like it.

This is exactly what The Fly Trap does everywhere else:

- They took the word *diner* (connoting greasy spoon, cheap, forgettable) and made it *a finer diner*
- They took a breakfast scramble (utilitarian) and named it *The Forager* (mythic)
- They took hot sauce (generic) and named it *Swat Sauce* (a joke, a nod, a brand)
- They took the storefront (strip mall ordinary) and painted it yellow-green (unmissable)
- They took the return of the founders (which could have been earnest or apologetic) and made it *"Under Old Management"* — flipping a tired "Under New Management" trope into something warm, self-aware, and funny

Humanizing a fly is the smallest, most complete expression of the entire business: **take something the world has decided is beneath notice, give it dignity and a personality, and watch people fall in love with it.**

The website must live in this thesis. The fly isn't a mascot we tack on — it's the character already on the walls, and it has been the brand for twenty years.

### The physical space as design source

Five specific, physical things in the room the site must echo:

1. **The fly paintings** (see above) — the brand thesis made visible
2. **Checkerboard floor** — graphic, high-contrast, rhythmic
3. **Fire-engine red walls** — unapologetic color saturation
4. **Marble-inlay bar top** — literal colorful marbles embedded in the surface; the whimsical detail nobody expects
5. **Salt-and-pepper shaker collection** — the room rewards close looking; the site should too

---

## 5. Design Principles

Six principles that every design and content decision must pass.

1. **Loud on purpose.** No timid whitespace. The room isn't timid.
2. **Mobile is the front door.** Decisions are made on phones at stoplights, on the couch, and at the end of a diner booth. Design for the thumb first; desktop is the adaptation.
3. **The food is the star; the space is the co-star.** Every scroll segment should feature one or the other. Never filler.
4. **No dead ends.** Every CTA works. Every link resolves. Every tab loads. This is the #1 issue with the current site and the #1 fix.
5. **Legible first, decorative second.** Whimsy sits on top of clarity, never instead of it. If a menu item isn't readable at arm's length on a cheap Android, the design has failed.
6. **Ferndale voice, not corporate voice.** Copy sounds like the staff talking, not a CMS.
7. **Findable first, findable again.** The best-designed page is invisible if Google, Perplexity, and ChatGPT can't understand it. Every content decision is also a discoverability decision — see the SEO/AEO Strategy doc for specifics.

---

## 6. Visual System

### Color palette (sampled from on-site photos, April 26)

| Token | Hex | Source | Role |
|---|---|---|---|
| `flytrap-red-deep` | `#992F1E` | Marble bar epoxy matrix | Primary brand, body accents |
| `flytrap-red-bright` | TBD | Dining room walls (return-visit sample) | Hero CTAs |
| `bar-fog` | `#797A7E` | Gray-lavender bar walls | Section backgrounds, contrast surface |
| `corridor-mustard` | `#B9A651` | Yellow restroom corridor walls | Playful accents, secondary CTAs |
| `cream-paper` | `#F5EEDC` (placeholder) | Menu paper | Page backgrounds |
| `checker-black` | `#1A1A1A` | Menu border + restroom sign | Text, structural framing |
| `marble-spectrum` | jewel range | Marbles in bar top | Decorative motif palette only — never solid fills |

The marbles in the bar give us the entire decorative jewel-tone vocabulary: ruby, ultramarine, emerald, gold, plum, teal, butterscotch, jade. These are accent-only — used for spot-illustration tints, hover states, and small decorative touches. Never solid fills.

### Color zoning (the room is not monochromatic — neither is the site)

A discovery from on-site capture: The Fly Trap's interior is **deliberately color-zoned**, not painted in one signature color. Three zones:

- **Bar zone:** gray-lavender walls, fire-engine red front bar with marble inlay top, Joe Strummer punk painting hung as a focal point
- **Corridor / restroom zone:** yellow-mustard walls, checkerboard signage, pressed-tin ceiling
- **Dining room zone:** fire-engine red walls (per Detroit News review; we'll color-sample on return visit)

The website mirrors this. Different sections of the long scroll, and different routes, take on different zone colors:

- **Hero / brand-forward sections** lean into the red palette (high impact)
- **Menu / content-heavy pages** sit on cream and gray-fog (let the food and copy lead)
- **Visit / About pages** can lean into the mustard zone (warm, inviting, archival)

Each page or scroll section has a "primary zone" — never multiple at once. This prevents the site from looking like a parade of brand colors and lets each zone carry its own emotional tone, exactly like the physical room does.

### Typography pairings (three candidates to prototype)

**Option A — Warm editorial**
- Display: **Fraunces** (expressive serif, wide weight range)
- Body: **Figtree** (warm humanist sans)
- Accent: **Reenie Beanie** (hand-drawn, for stickers/badges)

**Option B — Confident slab**
- Display: **Recoleta** (slab-ish serif with personality)
- Body: **Inter** (neutral, very legible)
- Accent: **Caveat** (handwriting)

**Option C — Signpainter**
- Display: **Bagnard** or **Pilcrow** (eccentric display serif)
- Body: **Söhne** (premium neutral sans)
- Accent: custom lettering for "Buzzin' Since 2004" lockup

We prototype all three against the same hero mock in Phase 1 and pick.

### Motif system (three recurring visual elements)

1. **The Fly Character System** — not a single logo glyph, but a recurring cast. Drawing directly from the fly-in-human-situations art on the restaurant walls, the website uses a small crew of stylized fly characters shown doing human things, deployed contextually across the scroll:
   - A fly reading the menu (in the Menu section)
   - A fly tipping a hat at the hero
   - A fly pouring coffee (near Today's Buzzing)
   - A fly at a tiny checkout counter (in Swat Shop)
   - A fly waving goodbye (in the footer)
   - A fly answering a tiny telephone (near the Call CTA)

   These illustrations should be commissioned from the same artist who painted the in-restaurant pieces, or drawn in a style that honors them. They appear small, earned, and never competing with the food. Think New Yorker spot illustration, not Saturday morning cartoon. One fly per section, never stacked.

2. **Checkerboard** — used as section dividers, menu-card backdrops, and page-transition wipes. Scaled appropriately — chunky on mobile, finer on desktop.

3. **Marble halftones** — jewel-tone gradient blurs referencing the bar-top marbles, used behind hero images and on primary CTAs. A subtle echo of the room's signature detail.

### Photography direction

- **Overhead plate shots** on cream or dark wood, natural daylight, no heavy styling
- **Environmental detail shots** — close-ups of the marble bar, the salt-shaker wall, the fly art, the checkerboard
- **People shots** — regulars and staff mid-laugh, un-posed, natural light only
- **Exterior** — the yellow storefront at golden hour, the sign, the sidewalk on Woodward
- **No moody shadow work.** This is a daytime business. The site is bright.

---

## 7. Content Strategy

### Voice rules

- **Contractions yes.** "We've," "you'll," "it's."
- **Use their language.** *Rumble, Swat, Buzzin', Finer Diner, Oh Sugar Shack.* Don't sand it down.
- **Dish copy = one sentence of what's in it, then one sentence of why it's good.** The current site does this well in places (e.g. "Poblano Pesto and Jack Cheese Rumbled with Eggs Sidled by Seared City Ham"). Keep that cadence.
- **Hours and address — plain text, no cleverness.** Not everything has to be whimsical. Logistics are sacred.

### Content sourcing: Instagram is the center of gravity

The Fly Trap's most active online presence by a wide margin is their Instagram account (**@theflytrapferndale**, 3,500+ followers, 741 posts). The account is where the voice actually lives day-to-day: daily specials, new dishes, staff moments, regulars' dog visits. The website should not compete with Instagram — it should **ingest from it**.

Concrete integrations:

- **Today's Buzzing section** pulls the most recent Instagram post tagged `#flytrapspecial` as the live daily special, so staff updates one place (Instagram, which they already use) and both channels stay in sync
- **The Room gallery** uses a curated Instagram-as-CMS feed for user-generated content (tagged `@theflytrapferndale`) with a small "Tag us" prompt
- **Footer social block** links prominently and correctly to the real accounts (the current site points to generic facebook.com / twitter.com — broken)
- **Meta / Open Graph** share cards pull the same design language so links shared out of Instagram back to the website look intentional

### Content types and sources

| Content | Source | Update cadence |
|---|---|---|
| Daily specials | Instagram (`#flytrapspecial` tag) → auto-pulled to site | Daily |
| Full menu | CMS (Sanity), synced with in-house POS if possible | Weekly |
| About / origin story | Existing website copy (good) + expansion | Rare |
| Press & features | Manual entry | Quarterly |
| Retail catalog | CMS / commerce system | As-needed |
| Hours & holiday closures | CMS | As-needed |
| User-generated photos | Instagram tag/mention feed | Real-time |

---

## 8. Information Architecture

```
Home (one long scroll, the personality page)
├── Menu (full menu, filterable, deep-linked per category)
├── Order Online (Coming Soon placeholder — Toast integration stubbed until launch)
├── Shop (Swat Sauces, gift cards, t-shirts — real checkout)
├── About (origin story, the art, the team, the return)
├── Press (press coverage, reviews, DDD feature)
├── FAQ (natural-language Q&A — primary AEO target)
└── Visit (hours, location, parking, accessibility, dog policy)

Persistent utilities (in nav + footer):
• Order Online  (links to the Coming Soon stub at launch; live Toast integration post-handoff)
• Call Us       (tap-to-call, (248) 399-5150)
• Directions    (one tap to Google / Apple Maps)
```

---

## 9. The Scroll — Mobile-First Home Page

A single long scrolling narrative, built for thumb-swipe consumption. Sections are sized for phone viewports first; desktop is a refinement.

### Section 1 — Hero (100vh)
Full-bleed daylight photo of the storefront or a signature plate. Wordmark lockup:

> **The Fly Trap**
> *a finer diner*
> **Under Old Management** (smaller, handwritten-style accent, confirming the founders are back)

One-sentence manifesto underneath. Two CTAs: **Order Online** (primary red) and **See Menu** (secondary outline). Small "Open until 3pm" live badge.

The "Under Old Management" treatment matters — it's a Ferndale regular's inside joke. Newcomers read it as quirky; regulars read it as a reassurance. Both audiences are served.

### Section 2 — Today's Buzzing
Live daily specials block (edited by staff via CMS). Real-time hours status: *Open · closes 3pm* / *Closed · opens tomorrow at 8am*. This section directly replaces the lorem-ipsum void on the current site.

### Section 3 — The Menu Tease
Five horizontally-scrolling "chapters" — **All Things Eggs · Oh Sugar Shack · Green Things · Between Bread · Other Stuff.** Each chapter shows 3 featured dishes with name, one-line description, plate photo, and price. Tapping a chapter deep-links to that category on the full Menu page.

### Section 3.5 — Order Online (Coming Soon stub)
A clearly-labeled placeholder block for online ordering through Toast (the diner's POS, pending confirmation on the weekend visit). The stub does three things:

1. **Shows what's coming** — a small card on the home page and a dedicated `/order` route, both reading *"Online ordering — coming soon"* with a Toast-style "Powered by Toast" attribution (greyscale, minimal)
2. **Captures intent** — an email field: *"Get notified when online ordering goes live."* Submissions route to a simple Sanity CMS list that Kara can export later
3. **Routes correctly on launch** — at handoff, this block swaps to the live Toast embed / link without any design change; the intent list gets emailed as a batch

This section exists deliberately as a pitch asset. It shows Kara what the finished product looks like *with* online ordering plumbed in, so the business case is concrete, not hypothetical. The "Coming Soon" framing also means the site can launch before the Toast integration is live without anything on the page reading as broken.

### Section 4 — The Room (with a dedicated fly-art subsection)
The visual argument for why you should come in person. Two stacked parts:

**4a. The Fly Gallery.** A horizontally-swipeable, full-bleed gallery of the fly paintings — each one with a short caption or title. This is the brand thesis rendered. It sits *above* the general interior shots deliberately, as the signature moment of the page. Each painting is photographed individually, clean, uncropped.

**Hero rotation rule (from capture):** Of the 17 catalogued fly paintings, five anchor the home-page rotation:

1. *Fly Art Class* — flies painting flies; the brand thesis in one image
2. *Fly Fly-Fishing* — a fly using a fly to catch a fly; the perfect pun
3. *Flies on a Dinner Date* — candlelight, wine, "a finer diner" embodied
4. *Flies Kissing on a Hilltop* — tender, universal, merch-ready
5. *The Eye Doctor* — chart literally spells "FLY"; diegetic branding

The three bathroom-context pieces (*Fly on the Toilet*, *Bathroom Line*, *Flies at Urinals*) belong in the full catalog and About-page secondary grid but **never** in the home-page hero rotation. They're funny in context inside the restaurant; out of context on a phone-screen first impression they read differently. Hold them back.

**4b. Everything Else.** A 6-tile grid of the rest: checkerboard floor, marble bar (close-up on the embedded marbles), the marble-sphere wall installation, pressed-tin ceiling, salt-shaker wall, the yellow exterior at golden hour, a packed dining room mid-service. Caption copy tells the story of specific pieces ("See those marbles? They're real. Set into the bar in 2004 and still there.")

### Section 5 — Buzzin' Since 2004 (The Return Story)
This is now a genuine narrative section, not a brochure blurb. Three beats:

1. **Founded 2004** — origin hook: the McMillians, the name, the early years, the DDD feature
2. **The pause, 2021–2024** — brief, warm acknowledgment that the founders stepped away and someone held the space for them. No drama, no long explanation. Just the facts of a real small-business story.
3. **Under Old Management, October 2024** — the return. The tagline. The commitment to the legacy. Kara's quote from Crain's: "We want to make sure the legacy of The Fly Trap lives on."

DDD feature badge sits alongside. Short link to the full About page for readers who want more. Short. Warm. Human.

**About page hero anchor (from capture):** When this section links to the full `/about` page, that page opens with the *Fly Art Class* painting as its hero image — flies at easels painting a fly model on a pedestal. That single image is the brand thesis rendered: take something the world has decided is beneath notice, give it dignity, and then make art of it making art of itself. The recursive self-awareness in that piece is the whole identity. No headline copy can compete; let the painting open the page.

### Section 6 — Swat Shop
Three retail cards: **Swat Sauces · Gift Cards · T-Shirts.** Real product photography, working add-to-cart (or link to Shopify/Square store). Currently this is the biggest under-leveraged revenue line.

### Section 7 — Visit
Interactive map pinned at 22950 Woodward. Hours block. Parking note (there's a lot; mention it). Dog-friendly note (Yelp calls this out — own it). Accessibility note. Big tap-to-call button and a Get Directions button.

### Section 8 — Footer
**Real** social accounts (Instagram @theflytrapferndale, Facebook /flytrapferndale), newsletter signup, full nav, legal, credits.

---

## 10. Interaction & Motion

Motion should feel like the room feels — lively but not frantic. Every motion respects `prefers-reduced-motion`.

- **Page load:** a single fly silhouette zips across the viewport and lands on the logo
- **Scroll reveals:** sections fade in with a subtle checkerboard-wipe transition (~200ms)
- **Menu cards:** on hover/tap, a marble-gradient bloom blooms behind the card
- **CTAs:** buttons get a brief "swat" scale-pulse on tap
- **Loading states:** use the fly motif as the spinner
- **Easter egg (optional):** tap the logo five times → a tiny buzz sound + the checkerboard briefly animates

---

## 11. Technical Recommendation

Locked as **provisional** until we confirm scope with the client. Based on current industry best practice and Summit's preferred stack:

| Layer | Choice | Reasoning |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Static rendering + image optimization + OG metadata, all free |
| Styling | **Tailwind CSS** + custom design tokens | Matches Summit's house stack; enforces the color system at the class level |
| Hosting | **Vercel** | Free tier is fine for this traffic; zero-config deploy |
| CMS | **Sanity Studio** | Manager-editable daily specials, menu items, press — no dev needed for content changes |
| Commerce | **Shopify Lite** or **Square Online** | Existing merchant options; pick whichever the owner already uses |
| Online ordering | **Toast TakeOut** / **ChowNow** / **Square Online** | Decision depends on the diner's POS; confirm in kickoff |
| Analytics | **Plausible** | Privacy-friendly, simple dashboard, cheap |
| Reservations | **Resy** or **OpenTable** | Only if ownership wants them; otherwise skip |
| Domain | **theflytrapferndale.com** (owned, dormant) or keep `.net` | Pending owner decision |

---

## 12. Asset Inventory — What We Need to Shoot or Source

| Asset | Status | Priority |
|---|---|---|
| **Fly paintings — every piece, individually, uncropped, straight-on** | **DONE — 17 pieces captured 2026-04-25** | P0 |
| Marble bar top close-ups | DONE — 2 strong shots, color-sampled | P0 |
| Back-bar wide + Joe Strummer portrait + chalkboards | DONE — 4 shots | P0 |
| Pressed-tin ceiling | DONE — 2 shots, heritage texture asset | P0 |
| Marble-sphere wall installation | DONE — 2 shots | P0 |
| Hand-fabricated checkerboard restroom signage | DONE — 1 shot | P0 |
| Full printed menu (front, back, beer card, cocktail card) | DONE — 6 shots, fully OCR-able | P0 |
| Wordmark lockup | DONE — captured from menu, vector-traceable | P0 |
| Exterior hero — storefront, yellow-green facade, daylight | **Return visit needed** | P0 |
| Dining room interior — booths, window tables, red walls | **Return visit needed** | P0 |
| Plate photography — signature dishes, overhead daylight | **Return visit needed** | P0 |
| Salt-and-pepper shaker collection | **Return visit needed** | P0 |
| Receipt with "Under Old Management" tagline close-up | **Return visit needed** | P0 |
| Clean section of dining-room red wall (color calibration) | **Return visit needed** | P1 |
| Commissioned fly-character spot illustrations | Illustrator TBD — ideally the original fly-art artist (name not yet gathered) | P1 |
| Daily specials copy — first 30 days | Pulled from Instagram once integration is live | P1 |
| Retail product photography — Swat Sauces, jam, t-shirts, gift cards | Return visit, retail-display shots | P1 |
| Press clips & DDD episode still | Source from Food Network / owner | P2 |
| Staff headshots (optional) | Photo shoot, with consent | P3 |

### Photo handling rules (from capture)

- **Reflections in framed art:** Most fly paintings were shot through glass and have visible reflections (Ryan's silhouette, glare patches). For Phase 1 of the spec build, present these at ≤1200px wide where most flaws are imperceptible. For any post-handoff use (print, merchandise, press), arrange a re-shoot without glass with proper lighting.
- **Identifiable people in photos:** Several back-bar shots include a staff member at the POS and a customer at the counter. Default rule for Phase 1: **crop people out** before publishing any image. If a shot's value depends on the person being in frame, hold the shot until post-handoff when explicit consent can be gathered. Never blur faces — it reads as evasive.
- **Glass and glare correction:** Light in-painting and perspective correction are acceptable in design tooling for Phase 1. Don't AI-extend or alter content beyond removing reflection patches.

**Realistic return-visit scope:** ~30 minutes during a regular meal visit. No professional photographer needed for the spec build. Post-handoff, a half-day food/space shoot with a local Detroit photographer ($1,200–2,000 budget placeholder, or barter for redesign credit + social tag) covers retail catalog and signature plates.

---

## 13. Success Criteria

How we'll know this worked.

**Performance & technical**
- Mobile PageSpeed Insights ≥ 95 (performance and accessibility)
- Lighthouse SEO score ≥ 95
- Core Web Vitals all green on mobile

**Behavior**
- "Order Online" CTR ≥ 8% of home-page sessions
- Home-page bounce rate < 40%
- Menu page engagement ≥ 60s median

**Qualitative**
- Regulars say some version of "this finally feels like the Fly Trap"
- Manager can update daily specials without calling us

**Business**
- Measurable lift in online orders in the 90 days post-launch (baseline TBD)
- Swat Sauce + merch revenue measurable online for the first time

---

## 14. Phases & Timeline (build-then-offer model)

This is a speculative build, not a commissioned engagement. Summit builds the complete site, presents the finished product to Kara, and negotiates commercial terms after she's seen it. Phasing reflects that reality.

**Actual pace:** Ryan ships fast with Claude Code + Dispatch. The 7-week estimate that follows is a traditional-pace ceiling; realistic cadence given the skills ecosystem (gh-repo-create → architect-plan-for-dispatch → Dispatch) is 2–3 focused weekends plus evening polish. Treat the per-phase durations below as *effort*, not calendar time.

| Phase | Effort | Deliverables | Dependencies |
|---|---|---|---|
| **0 — Strategy** (done) | — | This design doc + four companion specs | — |
| **Saturday capture** | ~2 hours on-site | Weekend Shot List v2 completed: all artwork, bar, seating, menu, receipts, exterior | Visit to Fly Trap |
| **Saturday organize** | ~1 hour | Assets sorted per folder spec, menu transcribed, intel notes written up | Capture done |
| **Sunday kickoff** | ~30 min | `gh-repo-create` → `architect-plan-for-dispatch` with this doc + assets as input → Dispatch plan | Claude credits reset + assets ready |
| **1 — Design direction** | ~1 day | Mood board, color calibrated from actual photos, type pairing selected | Assets ready |
| **2 — Build** | ~3–5 days | Next.js + Tailwind scaffold, Sanity CMS schema, all pages implemented, IG stub, Toast stub | Design direction locked |
| **3 — Content pass** (parallel to Phase 2) | ~2 days | Menu entered, copy drafted, press page populated, AI-generated fly spot-illustrations | Photos in hand |
| **4 — Polish & staging** | ~1 day | Private staging URL, Lighthouse ≥ 95, WCAG 2.2 AA, all schemas validated | Build complete |
| **5 — The Offer** | 1 meeting | In-person walk-through with Kara at the diner | Staging live |
| **6 — Handoff or portfolio park** | Contingent | Accept: live integrations + launch. Decline: archive as portfolio. | Phase 5 |

**Realistic calendar:** Saturday capture → Sunday kickoff → 2 weekends of focused build → Offer conversation in ~3–4 weeks total.

**Scope discipline during the spec build:**

- **No professional photographer.** Ryan's phone captures are the primary asset. Supplement with public Instagram content (at low res, with clear attribution) for visual density.
- **No commissioned illustrations.** Use AI-generated fly spot-illustrations (Midjourney / similar) in a style adjacent to the restaurant's wall art, clearly flagged as placeholder in the design doc. Real commission happens post-handoff if Kara engages the restaurant's actual artist.
- **No paid services.** Stick to free/low-cost stack: Next.js on Vercel free tier, Sanity free tier, Plausible optional ($9/mo but can wait for handoff). No EmbedSocial / Curator.io — we stub Instagram with mock data.
- **No legal or commercial commitments made on Kara's behalf.** All integrations (Toast, commerce, IG OAuth) remain stubs until after she agrees.

---

## 15. Open Questions (resolve before Phase 1 kickoff)

1. **~~Is this commissioned or speculative?~~ Resolved: warm lead.** Ryan has established rapport with Kara McMillian as a regular. He has brought cookies for the staff, knows most of the front-of-house, and Kara has already extended a business overture by offering him access to her commissary kitchen at 8 Mile & Woodward for his cookie business. Pitching a redesign is no longer cold outreach — it's a reciprocal conversation with someone who has demonstrated trust in him and whose publicly stated motivation for returning to ownership is protecting the legacy of what she and Gavin built. Commercial structure (paid engagement, barter for kitchen access, or hybrid) to be determined after the design direction is shared. See §16.
2. **~~Existing online ordering?~~ Resolved (Sunday capture):** Toast POS confirmed via visible terminal in back-bar shots. The Order Online stub on the home page therefore correctly reads "Powered by Toast — Coming Soon" and at handoff swaps to live Toast Online Ordering integration. No DoorDash / ChowNow conflict to resolve.
3. **Photography budget?** Half-day professional shoot ($1.2–2K), barter, or phone photography + existing assets?
4. **Content owner on their side?** Under the McMillians the content owner is almost certainly Kara or a staff member she designates. Gigi Christopher was manager under Buskard; unclear if still in place — confirm on weekend visit.
5. **Logo vector?** Does the current wordmark exist as SVG/AI, or do we redraw from the raster?
6. **Domain?** Stay on `theflytrapferndale.net` or move to `theflytrapferndale.com` (appears owned but dormant)?
7. **Reservations?** Are they wanted, or is walk-in/wait-list the intentional vibe?
8. **Accessibility bar?** Target WCAG 2.2 AA as the floor — confirm no higher requirement from ownership.

---

## 16. Engagement Model

**Strategy:** Build the complete site speculatively. Offer the finished product to Kara. Negotiate commercial terms only after she has seen and reacted to the work. The cookie business and Kara's kitchen offer are entirely separate threads and are not part of this engagement.

### The Offer conversation (Phase 5)

Once the site is live on staging, request a short meeting with Kara at the diner (15–20 minutes, off-peak — mid-afternoon after lunch service). Walk her through the staging site on a laptop. Let the work lead.

**Opening:**

> "I spent some time over the last couple months building this for the Fly Trap. It's not a sales pitch — I wanted to show you something real, not just describe it. Mind if I walk you through it?"

Show, don't tell. Let her react. Note which sections she lights up on and which she questions.

**At the end, present three commercial options:**

1. **Paid engagement.** Summit transfers the site, wires up Toast ordering, Instagram OAuth, and commerce. A scoped fixed-price for handoff + integrations + domain + deploy + three months of content support. A separate monthly retainer for ongoing updates if wanted. *(Ballpark numbers to be set by Ryan based on Summit rates — not decided in this document.)*

2. **Portfolio / gift structure.** Summit deploys the site at Fly Trap cost (domain, minor vendor costs) and hands off as-is. No ongoing engagement. Summit uses the project as a portfolio piece and case study with Kara's permission. Fly Trap owns everything on its own domain.

3. **Decline gracefully.** If the site doesn't fit Kara's vision, no hard feelings. Summit keeps the work as a portfolio piece (anonymized if Kara prefers). Nothing changes about the existing rapport, the kitchen offer, or the regular visits.

The third option is stated explicitly because it protects the relationship. Kara should feel zero pressure to say yes. If she says no, Ryan has still built a portfolio piece demonstrating real brand work on a real Detroit institution.

### Why this approach

- **Speculative work is rare and memorable.** Most people pitch with mockups, not finished products. Leading with a complete, production-quality site signals seriousness and respect for the brand in a way that a Keynote deck cannot.
- **The work sells itself or it doesn't.** If Kara's reaction to the finished site isn't enthusiastic, no sales technique was going to save it. Better to find out with a finished artifact than to drag both parties through months of approval gates.
- **Risk is bounded.** ~7 weeks of Summit time is the entire investment. The worst outcome is a portfolio piece, which has real value for the consultancy regardless.
- **Relationship-protective.** If Kara declines, no commercial ask ever happened. The rapport is intact. The kitchen offer is intact. Ryan is still a regular.

### What this explicitly is not

- **Not a barter for kitchen access.** Kara's kitchen offer is unrelated to this project and stays that way.
- **Not a free forever commitment.** Option 1 (paid engagement) is the primary target outcome. Options 2 and 3 exist as graceful alternatives, not as the goal.
- **Not a guarantee of Kara's engagement.** She may decline for any reason. The work must be valuable to Summit independent of her decision.

---

## Appendix A — Reference inventory (physical artwork & design cues)

Cues to be photographed or described on the site:

- **The fly paintings** — the collection of fly-as-human-character artwork on the restaurant walls. The brand thesis made visible. *Requires on-site photography; not available online.*
- **The checkerboard floor** — black & white, classic diner, high-contrast
- **Fire-engine red walls** — Pee-Wee's Playhouse tonal reference (per 2022 Detroit News review)
- **The marble bar top** — colored marbles embedded in the surface, a signature detail
- **Salt-and-pepper shaker collection** — "wacky" and extensive, per UTR Michigan
- **Yellow-green exterior paint** — referenced in the original DDD review blog
- **The banner logo / wordmark** — current `.webp` on site, needs re-sourcing

## Appendix B — Voice samples (from existing owner copy, preserved)

- *"Buzzin' since 2004"*
- *"The doors of The Fly Trap: a finer diner were eagerly thrown open for the first time on December 28th 2004."*
- *"We welcomed our first customers and started our magnificent life as a business that continues on through today."*
- *"Along with our beloved and inquisitive customers came the many questions of our origin."*

This is the voice. We write to match.

---

*End of Design Document v1.0. Next step: resolve Open Questions 1–3, then move to Phase 1 mood boards.*
