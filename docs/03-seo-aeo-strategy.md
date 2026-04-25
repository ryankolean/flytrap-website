# SEO + AEO Strategy — The Fly Trap

*Companion to the main design document. Covers search-engine optimization and answer-engine optimization (AEO) — the latter being the discipline of getting cited by ChatGPT, Perplexity, Google AI Overviews, and similar.*

---

## The strategic frame

Traditional SEO gets The Fly Trap to the top of the Google map pack when someone searches *"brunch Ferndale."* AEO gets The Fly Trap named when someone asks ChatGPT *"where should I eat breakfast in metro Detroit?"* Both matter. The technical work overlaps about 70%.

For a neighborhood restaurant with twenty years of press and a distinctive brand, AEO is particularly favorable — answer engines reward businesses with consistent cross-web mentions, strong structured data, and content that answers natural-language questions. The Fly Trap already has the mentions. The work is to make the site structured enough that LLMs can find and trust the signal.

---

## Part 1 — Technical foundation (SEO + AEO both)

### Rendering model

**Server-rendered or statically generated HTML on every page.** AI crawlers do not reliably execute JavaScript — if content appears only after client-side hydration, it's invisible to them. Next.js App Router with `force-static` on content pages or `revalidate` on dynamic pages (menu, specials) gives us this for free. This is non-negotiable.

### Core Web Vitals targets

| Metric | Target | Why |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s on mobile | Google ranking signal; users bounce above 2.5s |
| INP (Interaction to Next Paint) | < 200ms | Replaced FID in 2024 |
| CLS (Cumulative Layout Shift) | < 0.1 | Layout stability |
| TTFB (Time to First Byte) | < 600ms | Vercel edge gets us here easily |

### Files at the site root

- **`robots.txt`** — explicit `Allow:` for Googlebot, Bingbot, **OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot, Applebot-Extended, CCBot**. Do not rely on defaults — if the site is hosted behind Cloudflare, their default AI bot blocking must be turned off.
- **`sitemap.xml`** — auto-generated from Next.js, submitted to Google Search Console and Bing Webmaster Tools
- **`llms.txt`** — the emerging AEO standard. A plain-text/Markdown file at `/llms.txt` that summarizes the site for AI crawlers and points them at the key pages. See structure below.
- **`llms-full.txt`** — the expanded variant with full content dumps of the About, Menu, and Visit pages

### `llms.txt` structure (draft)

```markdown
# The Fly Trap — A Finer Diner

> Neighborhood diner on Woodward Ave in Ferndale, Michigan. Serving
> elevated American comfort food with global accents since 2004.
> Featured on Food Network's Diners, Drive-Ins and Dives.

## Essentials
- [Menu](https://theflytrapferndale.com/menu) — full menu with categories
- [Visit](https://theflytrapferndale.com/visit) — hours, address, parking
- [About](https://theflytrapferndale.com/about) — origin, the space, the art
- [Press](https://theflytrapferndale.com/press) — press coverage and reviews

## Facts
- Address: 22950 Woodward Ave, Ferndale, MI 48220
- Phone: (248) 399-5150
- Hours: Monday–Sunday, 8am–3pm
- Cuisine: American diner with global influences
- Price: $$ (moderate)
- Signature dishes: Gingerbread Waffles, The Forager, Lemongrass Pho Bowl,
  Red Chili Salmon Burger, Green Eggs and Ham
- Dog-friendly outdoor seating
- Vegetarian and vegan options available
```

### Structured data (JSON-LD)

This is the single biggest AEO lever. Each schema type below goes on the indicated page.

**Home page**

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "The Fly Trap",
  "alternateName": "The Fly Trap: a finer diner",
  "description": "...",
  "url": "https://theflytrapferndale.com",
  "telephone": "+1-248-399-5150",
  "servesCuisine": ["American", "Diner", "Breakfast", "Brunch"],
  "priceRange": "$$",
  "image": [...],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22950 Woodward Ave",
    "addressLocality": "Ferndale",
    "addressRegion": "MI",
    "postalCode": "48220",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.4503,
    "longitude": -83.1449
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "08:00",
    "closes": "15:00"
  }],
  "hasMenu": "https://theflytrapferndale.com/menu",
  "acceptsReservations": false,
  "sameAs": [
    "https://www.instagram.com/theflytrapferndale/",
    "https://www.facebook.com/flytrapferndale/"
  ]
}
```

**Menu page** — `Menu` with nested `MenuSection` and `MenuItem` for every dish. The dish categories (All Things Eggs, Oh Sugar Shack, etc.) become `MenuSection`s.

**Press page** — each press entry wrapped in `NewsArticle` or `Review` schema, nested under the `Restaurant` entity.

**Visit page** — `LocalBusiness` with `hasMap`, `openingHoursSpecification`, and `amenityFeature` (Outdoor seating, Dog-friendly, Accessible entrance, etc.).

**FAQ page (dedicated, see Part 2)** — `FAQPage` schema with each Q&A as a `Question` / `Answer` pair. This is the single most extracted schema type by answer engines.

**About page** — `AboutPage` plus `Organization` with `foundingDate`, `founder`, `knowsAbout`.

### Meta and social

Every page gets:
- Unique `<title>` under 60 chars, with brand suffix ` | The Fly Trap`
- Unique `<meta name="description">` under 160 chars
- Open Graph tags: `og:title`, `og:description`, `og:image` (1200×630), `og:type`
- Twitter Card tags: `summary_large_image`
- Canonical link tag on every page

### Local SEO — NAP consistency across the web

Name, Address, Phone must match *exactly* everywhere. This is table stakes and already partially done:

- Google Business Profile — claim, verify, audit, sync hours with the website
- Apple Business Connect — same
- Bing Places — same
- Yelp — claim, update hours (current hours on their Yelp listing read "Mon 8–3" etc., which matches)
- Facebook Page — update (current page links are broken to generic facebook.com)
- Tripadvisor, Restaurant Guru, HappyCow — request updates if stale
- The address on the current website reads `22950 Woodward Avenue Ferndale, Michigan 48220` — consistent. Good.

---

## Part 2 — Content architecture for AEO

LLMs reward answer-first content. When someone asks *"Is The Fly Trap dog-friendly?"*, we want our FAQ page to have exactly that question as an H2, followed by a two-sentence answer, followed by context. This is the format answer engines extract.

### A dedicated `/faq` page (new — not in v1.1 of the design doc)

Group questions into sections. Each question is an H2 or H3. Each answer is 1–3 sentences, written as a complete thought that can be lifted directly.

Suggested starter questions (all phrased in natural language, not keyword-stuffed):

**Visiting**
- What are The Fly Trap's hours?
- Where is The Fly Trap located?
- Is there parking at The Fly Trap?
- Is The Fly Trap dog-friendly?
- Does The Fly Trap take reservations?
- Is The Fly Trap wheelchair accessible?

**Food**
- What kind of food does The Fly Trap serve?
- Does The Fly Trap have vegan options?
- Does The Fly Trap have vegetarian options?
- Is The Fly Trap gluten-free friendly?
- What are The Fly Trap's most popular dishes?
- Does The Fly Trap serve alcohol?

**The business**
- When did The Fly Trap open?
- Who owns The Fly Trap?
- Has The Fly Trap been on TV?
- What does "a finer diner" mean?
- Where did the name "Fly Trap" come from?
- What does "Under Old Management" mean?
- Did The Fly Trap change owners?
- Are the original owners back at The Fly Trap?

**Ordering**
- Can I order from The Fly Trap online?
- Does The Fly Trap deliver?
- Can I buy Swat Sauce online?
- Does The Fly Trap sell gift cards?

All of this is wrapped in `FAQPage` JSON-LD schema.

### Answer-first formatting on every content page

- **H1 per page, unique and descriptive** — not "Home" but "The Fly Trap — A Finer Diner in Ferndale, Michigan"
- **H2/H3 hierarchy that reads like a question tree** — if a section could be phrased as a question, phrase it that way
- **First sentence of each section = the takeaway** — LLMs often pull the first 1–2 sentences as the answer
- **Use lists and tables for structured answers** (menus, hours, prices) — LLMs love tables
- **Every claim cited when possible** — press quotes link to press, facts link to about

### Speakable content

Add `speakable` JSON-LD to the About and Visit pages — this tells voice assistants which paragraphs to read aloud when someone asks "Hey Siri, what's The Fly Trap?"

### Entity consistency

Answer engines build an entity graph. Every mention of "The Fly Trap" across the web should resolve to the same entity. Concretely:

- Wikipedia / Wikidata entry — create if it doesn't exist (criteria met: DDD feature, regional press, 20+ years operating)
- Google Knowledge Panel — verify linked Business Profile
- Local news mentions — the Press page aggregates this

---

## Part 3 — Measurement

### Traditional SEO

- **Google Search Console** — impressions, clicks, query coverage, Core Web Vitals
- **Bing Webmaster Tools** — same, for Bing and downstream (including ChatGPT which partners with Bing indexing)
- **Plausible Analytics** — privacy-first, simple dashboard, ~$9/mo for this scale

### AEO

This is harder. Track monthly:

- **Manual prompt tests** — run a standard set of 10–15 prompts monthly against ChatGPT, Perplexity, Claude, Google AI Overviews, Gemini:
  - *"Best brunch in Ferndale, Michigan"*
  - *"Where can I get pho in metro Detroit?"*
  - *"Dog-friendly breakfast spots near Royal Oak"*
  - *"Restaurants featured on Diners Drive-Ins and Dives in Michigan"*
  - Record whether The Fly Trap is named and what's said
- **Referrer tracking in Plausible** — watch for traffic from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`
- **Third-party AEO tools** (optional, later): Profound, Peec AI, LLMrefs — paid services that automate the above

### Success criteria (adds to main design doc §13)

- FAQ page ranks for at least 5 target long-tail queries within 90 days of launch
- Named in at least 3 of the 15 monthly AEO test prompts within 6 months
- Traffic from AI-search referrers is measurable (non-zero) within 90 days

---

## Part 4 — Implementation checklist (build phase)

### Phase 2 — during build
- [ ] Next.js App Router with server-rendered or statically-generated content pages
- [ ] Every page has unique `<title>`, `<meta description>`, `og:image`
- [ ] JSON-LD on Home, Menu, Visit, Press, About, FAQ
- [ ] `robots.txt` with AI crawlers explicitly allowed
- [ ] `sitemap.xml` auto-generated
- [ ] `llms.txt` and `llms-full.txt` at root
- [ ] Canonical tags everywhere
- [ ] Alt text on every image — descriptive, not keyword-stuffed
- [ ] Lighthouse performance ≥ 95 on mobile before launch

### Phase 4 — at launch
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools
- [ ] Claim / audit Google Business Profile, Apple Business Connect, Bing Places
- [ ] Verify NAP consistency on Yelp, Tripadvisor, Facebook, Instagram, Restaurant Guru, HappyCow
- [ ] Baseline AEO test: run the 15 prompts, record results before anyone has indexed the new site
- [ ] Verify Cloudflare (if used) is not blocking AI bots

### Month 1 post-launch
- [ ] First AEO test re-run
- [ ] Review Search Console for indexing issues
- [ ] Review any press or blog pickup of the new site — those backlinks compound

### Ongoing
- [ ] Monthly AEO prompt test
- [ ] New press coverage → immediately added to Press page
- [ ] Menu updates → sync schema

---

## One thing to call out clearly

No one can guarantee an LLM cites you. Companies selling "ChatGPT submission" or "AI listing registration" are scams. AEO is earned through consistent structured data, answer-first content, and third-party mentions — the same way organic SEO is earned. The good news: The Fly Trap has the third-party mentions already. This plan is about making the site itself legible enough that the existing reputation compounds.
