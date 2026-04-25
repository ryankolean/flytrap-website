# Press Page — Content & Layout Spec

*Companion to the main design document. Defines the dedicated Press page: what goes on it, how it's laid out, and which positive coverage anchors the page.*

---

## Purpose

A single page at `/press` that does three jobs at once:

1. **Build trust** — twenty-plus years of positive third-party validation, including national TV, the region's two biggest papers, and hyper-local outlets
2. **Feed SEO + AEO** — authoritative inbound links and third-party mentions are what answer engines use to decide who's trustworthy. A clean press page lets crawlers and LLMs find the full context in one place.
3. **Feed the website itself** — the hero home-page section ("Buzzin' Since 2004") pulls its pull quotes from this page, so we maintain them in one place

---

## Layout

The page is a single scrolling timeline, chronologically **newest-first**. Each entry is a card with:

- Outlet logo (grayscale, 40px tall)
- Publication name
- Date
- Short headline / angle
- One pull quote, 15 words or fewer (keep it tight; link out for more)
- "Read the full piece →" link opens in a new tab with `rel="noopener"`
- Small badge if it's a TV/video feature (DDD)

**Top of page:** A hero slot for the Food Network / *Diners, Drive-Ins and Dives* feature. This is the single biggest credential. Play a muted autoplay loop of the DDD still or embed the episode clip if rights allow.

**Filter chips:** `All` · `National` · `Detroit & Metro` · `Local (Ferndale/Oakland)` · `Food & Lifestyle Blogs`

**Schema:** each press entry uses `NewsArticle` or `Review` JSON-LD, nested under the `Restaurant` schema for the business. This is how we surface in "who has written about The Fly Trap" queries in AI search. See the SEO/AEO strategy doc for the full structured-data plan.

---

## Press inventory — confirmed positive coverage

Organized by tier. Status flags: **[Live]** = URL confirmed working; **[Verify]** = URL to be re-checked before launch.

### Tier 1 — National / flagship

| Outlet | Date | Angle | Status |
|---|---|---|---|
| **Food Network — *Diners, Drive-Ins and Dives*** | Featured (Guy Fieri) | National TV feature; Fieri called it one of the first places he saw when the show started | [Verify — source episode reference] |

"When I started watching the show, one of the first restaurants I saw was a little joint in Ferndale, MI called The Fly Trap. It was fabulous." — attributed to Guy Fieri in press coverage of the feature. This becomes the hero pull quote.

### Tier 2 — Regional / Detroit metro

| Outlet | Date | Angle | Status |
|---|---|---|---|
| **Crain's Detroit Business** (Jay Davis) | October 21, 2024 | **The return story** — McMillians take back ownership; legacy-preservation framing | [Live] — **highest-priority recent press, anchor of the "Return" section** |
| **Detroit Free Press** (Susan Selasky) | February 2022 | Reopening under Buskard (historical context for the ownership arc) | [Live] |
| **The Detroit News** | July 14, 2022 | Review under Buskard; "as good as ever"; still relevant as proof of preservation | [Live] |
| **Metro Times Detroit** | Multiple dates | Dining listings + ownership-change coverage | [Live] |

Suggested pull quotes (all under 15 words, one per outlet, per our copyright discipline):

- Crain's (Oct 2024), from Kara McMillian: *"We want to make sure the legacy of The Fly Trap lives on"* — this is the anchor quote for the About page and the Section 5 return story
- Crain's (Oct 2024), from Kara McMillian: *"Coming back wasn't exactly something that was anticipated"* — candid, human, on-brand
- Detroit News (2022): *"as good as ever"* — headline framing, proves the brand held through the Buskard era
- Food Network: *the Guy Fieri quote above*

**Narrative note:** The press page should be organized as a story, not a pile. The structure we're building toward:

1. **Hero:** DDD / Guy Fieri (national, flagship, evergreen)
2. **The Return (2024):** Crain's article, the tagline, Kara's quote
3. **The Legacy (2022–2024):** Detroit News review, Free Press coverage, Metro Times — proof the brand survived the transition intact
4. **The Origin (2004–2021):** older press, local coverage, the long run

### Tier 3 — Local / Oakland County

| Outlet | Date | Angle | Status |
|---|---|---|---|
| **Oakland County Times — Reporter Food** | December 2020 | Gingerbread Waffle + BLAT+C omelette feature | [Live] |
| **Oakland County Times — Reporter Food** | April 2022 | Post-reopening revisit; "nothing has changed" framing | [Live] |
| **UTR Michigan** | June 2019 | Eclectic decor + creative cuisine feature | [Live] |

### Tier 4 — Food / lifestyle blogs and review platforms

These shouldn't sit in the main timeline — they'd overwhelm the flagship press. Put them in a smaller "Around the Web" footer strip at the bottom of the Press page, as a logo cloud only, each logo linking to the source.

- Yelp (4+ stars, 1,000+ reviews, 770+ photos)
- Tripadvisor
- Restaurant Guru (4.6 stars)
- HappyCow (strong vegan-friendly coverage)
- Sirved
- Hip In Detroit
- dddreview.blogspot.com (Triple-D fan review)
- DinersDriveInsDivesLocations.com
- TripleDMap

---

## Pull-quote bank (for reuse across the site)

Rules for the bank: one quote per source, each under 15 words, each links to the original. These get pulled into the hero slot on the home page, the About page's quote strip, and the press page itself.

| Source | Quote (paraphrased / short) | Where it's used |
|---|---|---|
| Guy Fieri via DDD | *(full quote above — the hero)* | Home hero pull-quote, Press page top |
| Detroit News | "as good as ever" | Home page, Press page |
| HappyCow reviewer | "this place is very unique and the brand personality takes center stage" | About page quote strip |
| UTR Michigan | "from the crazy décor to the creative cuisine, these three came up with a winning recipe" — paraphrase to under 15 words for site use | Press page, possibly home |

**For the live website copy, all pull quotes should be rewritten to be under 15 words and each used only once per source.** The quotes above are research notes; final on-site versions will be paraphrased or tightened.

---

## Sources still to confirm or obtain

- [ ] Exact DDD episode number and season for the Fly Trap feature
- [ ] Is there a video clip / still we have rights to embed? (Food Network licensing is strict — may need to link out instead)
- [ ] Detroit News article direct URL (not just syndication)
- [ ] Crain's Detroit direct URL for the ownership-change piece
- [ ] Any owner-supplied press kit from Matt Buskard or the prior owners (McMillians)
- [ ] Any print-only coverage not indexed online (local Ferndale papers, magazine profiles)

---

## Implementation notes

- **Each press entry is a Sanity CMS document** so new press can be added without a deploy
- **Schema.org markup** for each entry: `NewsArticle` or `Review` type, nested under the `Restaurant` entity
- **OG images** for this page = a composite of all outlet logos so the page shares well on social
- **No press quotes on the site without source links.** Every quote visible must be clickable to the original article. This is both journalistic practice and AEO trust-building.
- **Avoid paraphrasing other reviewers' words without attribution.** If we can't quote cleanly under 15 words, we don't quote — we link.
