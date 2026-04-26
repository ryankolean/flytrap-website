# flytrap-website

[![CI](https://github.com/ryankolean/flytrap-website/actions/workflows/ci.yml/badge.svg)](https://github.com/ryankolean/flytrap-website/actions/workflows/ci.yml)

Speculative website build for The Fly Trap, a diner in Ferndale, Michigan. Engagement model: build-then-offer.

See [`CLAUDE.md`](./CLAUDE.md) for engagement constraints and stack decisions. See [`docs/`](./docs/) for the strategic spine and capture analyses (start with [`docs/README.md`](./docs/README.md)). Full-resolution photo originals live in the private [flytrap-website-assets-archive](https://github.com/ryankolean/flytrap-website-assets-archive) repo.

## Status

Pre-scaffold. Specs ingested 2026-04-25.

## Stack

Next.js 15 (App Router), Tailwind, Sanity Studio, Vercel free tier, TypeScript.

## Quick start

Install dependencies:

```sh
pnpm install
```

Run the dev server:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the required values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name
- `SANITY_API_TOKEN` — Sanity API read token

The Sanity Studio is available at `/studio` and requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_TOKEN` to be configured.

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — Engagement model and architecture decisions
- [`docs/README.md`](./docs/README.md) — Strategic spine and capture analyses
