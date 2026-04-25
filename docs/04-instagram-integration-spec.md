# Instagram Integration — Technical Spec

*Automated pull from @theflytrapferndale to the website. Zero manual intervention for the diner.*

---

## Requirement

- Pull all public posts from `@theflytrapferndale` automatically
- Filter for weekly specials via a tagged hashtag (`#flytrapspecial`)
- Two site placements fed by this: (1) the general IG carousel in The Scroll, (2) the "Today's Buzzing" / weekly specials block
- No one at the diner has to do anything other than post on Instagram as they already do
- Zero client-side API keys, zero CORS hacks, zero scraping

## Phasing under the build-then-offer engagement model

We cannot get OAuth access to `@theflytrapferndale` until after Kara has agreed to the site. That means the live integration is a post-handoff activity, not a pre-pitch one. Two phases:

**Phase A — Speculative build (pre-offer):** Build the full UI for Today's Buzzing and the IG carousel, wired to a mock JSON data source that mimics the real Instagram Graph API response shape. Seed the mock with hand-curated sample content derived from their public Instagram feed (low-resolution thumbnails with visible attribution, clearly watermarked "preview — live feed activates on launch"). This proves the pattern to Kara during the Offer conversation without requiring her OAuth consent first.

**Phase B — Live integration (post-handoff, only if Kara agrees):** Swap the mock data source for the real Instagram Graph API pull following the architecture below. The UI code does not change — only the data source file. This is a ~2 hour task at handoff.

The critical discipline during Phase A: **use public content respectfully, attribute clearly, and never misrepresent mock content as owned.** The goal is for Kara to see exactly what the finished feature will look like with her own posts flowing through it.

---

## Current API landscape (April 2026)

A few hard constraints shape the design:

The Instagram Graph API is Meta's official API, now the only supported way to access Instagram data after the Basic Display API shutdown, and only Business and Creator accounts are supported. The old Basic Display API was shut down December 2024, so any tutorial or library referencing it is dead.

Facebook Login OAuth 2.0 is required for authentication, rate limits are 200 calls per hour per app, and tokens are long-lived at 60 days.

Practical implication: before any code, **the diner's Instagram account needs to be a Business or Creator account, linked to a Facebook Page**. If `@theflytrapferndale` is currently a Personal account, it must be converted. This is free and takes ~2 minutes in the Instagram app settings.

---

## Two viable approaches

### Option A — Build it ourselves (recommended)

Full control, no recurring SaaS fees, stays in our stack.

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│  One-time setup (manual, by Summit)                         │
│  1. Convert IG account to Business (if not already)         │
│  2. Link IG account to a Facebook Page                      │
│  3. Create Meta app at developers.facebook.com              │
│  4. OAuth flow: owner grants permission → we receive token  │
│  5. Exchange short-lived → long-lived (60-day) token        │
│  6. Store token in environment secret (Vercel)              │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Scheduled pull (Vercel Cron, every 30 minutes)             │
│  1. Fetch latest 25 posts from /me/media endpoint           │
│  2. For each post, get media_url, caption, timestamp,       │
│     permalink, media_type                                   │
│  3. Classify: caption contains "#flytrapspecial" → specials │
│                otherwise → general feed                     │
│  4. Write two JSON blobs to Vercel KV / Upstash Redis:      │
│     - instagram:specials (up to 5 most recent)              │
│     - instagram:feed (up to 12 most recent)                 │
│  5. Proactively refresh token on day 55 of 60               │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Website render (user request)                              │
│  1. Server component reads cached JSON from KV              │
│  2. Renders carousel / specials block as static HTML        │
│  3. Zero API calls at request time                          │
│  4. Images served through Next.js Image component with      │
│     remote pattern allow-listed for instagram.com CDN       │
└─────────────────────────────────────────────────────────────┘
```

**Endpoints used:**
- `GET /me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&limit=25`
- `GET /refresh_access_token?grant_type=ig_refresh_token` (run on day 55)

**Rate-limit math:** 30-minute cron × 2 calls = 96 calls/day. Well under the 200/hour limit with headroom to spare.

**Critical details:**
- **Token refresh is the gotcha that bites everyone.** A long-lived token expires at 60 days. We schedule a weekly token-refresh Cron that calls the refresh endpoint — refresh is free and simple, but if you miss it for 60+ days, the integration silently dies and the owner has to re-authenticate. Set up Plausible or a simple email alert on pull failure.
- **Media URLs expire.** Instagram's CDN URLs for images are only valid for a few hours. Cache the JSON (not the images themselves) and always fetch fresh media URLs from the Graph API. Alternatively, cache the image bytes to Vercel Blob / R2 and serve from our own CDN.
- **Carousel posts** (multi-image Instagram posts) require an extra call to `/media-id/children` — handle them or display first frame only.
- **Video posts** have a `thumbnail_url` field — use that in the carousel, link out to the IG permalink for playback.
- **Private/archived posts** are filtered out by the API automatically — safe.

**Cost:** $0/month (Vercel free tier handles this scale), ~4 hours of dev time, plus an owner-side OAuth click-through.

### Option B — Third-party embed service (fallback if OAuth access is blocked)

If we can't get owner cooperation for the OAuth setup (a real risk if Matt Buskard isn't directly engaged), we use a service like EmbedSocial, Curator.io, Elfsight, or Taggbox. These services have their own auth to Instagram and render an embeddable widget.

**Pros:** Works immediately. Handles token refresh. Drop-in embed code.
**Cons:** $10–30/month. Limited design control — styling is constrained to whatever the widget exposes. Data lives in their system. Widget loads client-side (slower, worse for Core Web Vitals, less AEO-friendly).

**Recommendation order:**
1. Attempt Option A with owner cooperation — best outcome
2. If blocked, use **Curator.io** as the fallback — best design flexibility of the third-party options and reasonable pricing
3. As an absolute last resort if the account never gets OAuth permission: manually curate a handful of recent posts via CMS (loses the "automatic" requirement but preserves visual parity)

---

## The hashtag system — how the "specials" filter works

Ryan's instinct here is correct and exactly how this should work. The design:

- **Their account, their posts.** We only query `/me/media` — posts on the account itself. We never query the Instagram Hashtag Search endpoint, which requires extra permissions and has much stricter rate limits.
- **Hashtag as an in-caption marker, not an external search.** When the person running the IG wants a post to appear in the website's Specials block, they add `#flytrapspecial` anywhere in the caption. Our filter is purely client-side (well, server-side on the cron): `post.caption.toLowerCase().includes('#flytrapspecial')`.
- **Multiple hashtag conventions** give the diner flexibility:
  - `#flytrapspecial` → Today's Specials block (top of home page)
  - `#flytrapmenu` → feature in the Menu page as a "what's new" callout
  - `#flytrapevent` → show in a future Events section
  - No hashtag → general IG carousel, nothing featured
- **Document the convention.** A small internal one-pager ("How to post so it shows on the website") lives in the CMS. Two rules, one paragraph each. Critical for sustainability — the diner staff turns over, and the hashtag system has to survive that.

---

## UI behavior on the site

### Today's Buzzing block (home page)

- Shows the single most recent `#flytrapspecial` post
- Image + first 40 words of caption + link out to the IG post
- If there's been no specials post in the last 7 days, block renders with a static fallback ("See today's specials in person") — no stale content
- A small "via Instagram" microcopy tag with an IG glyph links to the account

### General IG carousel (home page, mid-scroll)

- 8 most recent posts, horizontally swipeable
- Each tile is a post thumbnail only, clean grid
- Tap/click opens the post on Instagram in a new tab
- Small header: "Latest from @theflytrapferndale" with a "Follow" button

### Fallback / degraded states

- **API call fails** → render last-successful cached content with a small "last updated" timestamp
- **Token expired and not refreshed** → static fallback + alert to Summit
- **No posts in the last 30 days** → hide the carousel entirely rather than show stale content
- **Reduced motion** → carousel is a static grid, not auto-advancing

---

## Privacy and legal

- **Instagram embeds include user-generated content considerations.** Posts on `@theflytrapferndale` are owned by the account — safe to display. If we ever expand to showing user-tagged content, we need an opt-in / attribution model.
- **GDPR / CCPA:** Instagram embeds load images from Instagram's CDN, which sets cookies. We don't have EU traffic concerns at this scale, but the privacy policy should note Instagram content is embedded.
- **Rate-limit backoff:** respect `x-app-usage` headers. Back off exponentially if we approach limits.

---

## Concrete decisions required from Ryan / the client

1. **Confirm @theflytrapferndale is a Business/Creator account.** If not, convert (2 min, free). Check in IG app: Settings → Account → Account Type.
2. **Confirm it's linked to a Facebook Page.** If there's no Page, create one (5 min, free) or link the existing Fly Trap FB page.
3. **Get owner OAuth sign-off** from Kara or Gavin McMillian (current owners as of October 2024). The Meta login flow takes ~2 minutes and is done once.
4. **Who is the account authority?** Most likely Kara or a staff member she designates — confirm on visit.
5. **Hashtag convention sign-off.** Confirm `#flytrapspecial` is acceptable, or propose an alternative.

---

## Checklist — what gets built during Phase 2

### Infrastructure
- [ ] Meta app created at developers.facebook.com (Summit-owned)
- [ ] App reviewed / permissions approved: `instagram_business_basic`, `instagram_business_content_publish` (we don't actually publish, but `basic` covers read)
- [ ] OAuth callback route in Next.js
- [ ] Token storage in Vercel env var + KV for rotated tokens
- [ ] Vercel Cron configured for `/api/cron/instagram-pull` every 30 minutes
- [ ] Vercel Cron configured for `/api/cron/instagram-refresh-token` weekly
- [ ] Error logging + email alert on pull failures

### Data
- [ ] Vercel KV namespace `instagram:*`
- [ ] JSON schema for cached post: `{ id, caption, media_url, thumbnail_url, permalink, timestamp, media_type, hashtags: string[] }`
- [ ] Fallback static content for each UI block when cache is empty

### UI
- [ ] `<InstagramSpecials />` server component on home page
- [ ] `<InstagramCarousel />` server component on home page
- [ ] Instagram glyph / "via Instagram" microcopy system
- [ ] Reduced-motion handling
- [ ] Next.js `images.remotePatterns` config for `scontent.cdninstagram.com` and `*.fbcdn.net`

### Docs
- [ ] Internal one-pager: "How to post so it shows on the website"
- [ ] Operations runbook: what to do when the integration fails

---

## Open technical questions

- Do we cache Instagram image bytes locally (Vercel Blob / R2) or proxy through Next.js Image optimization? The first is faster + more reliable but uses storage; the second is simpler but depends on IG CDN URL freshness.
- Do we want the Facebook Page Posts feed too, or is Instagram sufficient? (FB is mostly cross-posted from IG for most restaurants, so likely sufficient.)
- Should the Specials block have a "View all past specials" archive, or only show today's? (Recommend today only — archives add complexity and don't serve the core use case.)

These are resolvable in Phase 2 kickoff, not blockers.
