# Mock Data

This directory contains Phase A mock data for integrations that will be replaced in Phase B.

## instagram-mock.json

**Phase A (current):** A static JSON file containing 12 Instagram posts shaped to match the Instagram Graph API `/me/media` endpoint response exactly. Includes post metadata: `id`, `caption`, `media_type`, `media_url`, `permalink`, `timestamp`, `username`. Four posts are tagged with `#flytrapspecial` to populate the daily specials feature. Media URLs reference local assets in `assets/photos-web/` to avoid external dependencies during development.

**Phase B (post-handoff):** Replace `instagram-mock.json` with a live fetch from the Instagram Graph API. The fetch will run on a Vercel Cron every 30 minutes, pull up to 25 posts from the `@theflytrapferndale` account, and cache the results to Vercel KV. The UI code and type signatures remain unchanged — only the data source in `src/lib/instagram.ts` swaps from local JSON to a KV read.

**Implementation notes:**
- Mock posts use safe image URLs (no identifiable people, no bathroom context).
- Captions mimic the store's voice and Instagram posting pattern.
- The hashtag filter is case-insensitive and happens at read time, not at ingest.
- Timestamps are realistic but fabricated; live timestamps will be pulled from the Graph API.

## src/lib/instagram.ts

**Phase A (current):** `getInstagramFeed()` imports and returns the mock JSON. A TODO comment marks where the Phase B swap happens.

**Phase B (post-handoff):** Replace the import with an async call to `fetchInstagramGraph(token)` that reads from Vercel KV or hits the API directly. Token refresh logic runs on a separate Vercel Cron every 7 days.

## src/lib/dailySpecial.ts

**Phase A (current):** `getCurrentDailySpecial()` attempts a Sanity query for documents in the last 7 days. If none exist, it falls back to the most recent Instagram post tagged `#flytrapspecial`, also applying the 7-day staleness rule. Returns null if neither source is valid.

**Phase B (post-handoff):** No changes needed. The function signature and fallback logic remain stable. By then, the daily special will be pulled by the Vercel Cron and cached alongside the main feed; the Sanity query can be phased out entirely and replaced with a KV read if preferred.
