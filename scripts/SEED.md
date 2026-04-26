# Seed Script — Prerequisites and Usage

One-shot script that populates a freshly-created Sanity dataset with all
pre-handoff content: menu, fly paintings, site settings, FAQ entries, and
press entries.

---

## Prerequisites

All seven must be satisfied before running the seed.

### 1. Sanity project created

Create a free project at https://sanity.io. Note the **Project ID** shown on
the API settings page. The free tier is sufficient for this build.

### 2. Dataset created

Create a dataset named `production` inside the project:

```
npx sanity dataset create production
```

Or use the Sanity web UI: project → Datasets → Add dataset.

### 3. Sanity Studio schema deployed

The Studio schemas in `sanity.config.ts` must be recognized by the project
before you create documents. Run the Studio locally at least once:

```
pnpm dev
```

Or deploy the Studio:

```
npx sanity deploy
```

### 4. Write token created

1. Go to https://sanity.io → your project → API → Tokens.
2. Add a token with **Editor** (or **Administrator**) permissions.
3. Copy the token value — it is only shown once.

Set it as an environment variable:

```
export SANITY_API_WRITE_TOKEN=<your-token>
```

### 5. Environment variables set

| Variable | Required | Description |
|---|---|---|
| `SANITY_API_WRITE_TOKEN` | Yes | Write token from step 4 |
| `SANITY_PROJECT_ID` | Yes | Project ID from the Sanity dashboard |
| `SANITY_DATASET` | No | Dataset name (defaults to `production`) |

Recommended: create a `.env.local` file at the repo root (already in
`.gitignore`) and source it before running:

```
SANITY_API_WRITE_TOKEN=sk...
SANITY_PROJECT_ID=abc123
```

Then: `source .env.local && pnpm seed`

### 6. Node dependencies installed

```
pnpm install
```

This installs `tsx` (dev dep) and `@sanity/client` (dep), both of which the
seed script requires.

### 7. Photo assets present

The script uploads photos from `assets/photos-web/`. The fly-painting images
must exist at:

```
assets/photos-web/01-artwork/fly-paintings/
  01-fly-perched-on-blank-page.jpg
  02-fly-asleep-recliner-tv.jpg
  03-fly-art-class-portrait-session.jpg
  04-fly-on-horseback-cowboy.jpg
  05-flies-playing-hopscotch.jpg
  06-fly-fly-fishing.jpg
  07-fly-band-buskers-with-tip-jar.jpg
  08-flies-candlelit-dinner-date.jpg
  09-fly-mowing-lawn-other-on-vacation.jpg
  10-flies-lightsaber-duel.jpg
  11-flies-kissing-with-hearts.jpg
  12-fly-collapsed-in-desert.jpg
  13-fly-eye-doctor-version-A.jpg
  13-fly-eye-doctor-version-B.jpg  (version B is not seeded; kept for reference)
  14-fly-on-toilet.jpg
  15-flies-bathroom-line.jpg
  16-flies-at-urinals.jpg
  17-drunk-fly-with-other-on-scale.jpg
```

If any file is missing the script logs a warning and skips the upload for that
painting. The document is still created; just without an image reference.

---

## Running the seed

```
SANITY_API_WRITE_TOKEN=<token> SANITY_PROJECT_ID=<id> pnpm seed
```

Or, if using `.env.local`:

```
source .env.local && pnpm seed
```

---

## Expected output

```
Seeding Sanity dataset "production" (project: <id>)

--- Menu sections & items ---
  + created menuSection "all-day-eggs"
  + created menuItem "two-eggs-and-toast"
  ...

--- Fly paintings ---
  + created flyPainting "fly-art-class"
  ...

--- Site settings ---
  + created singleton siteSettings

--- FAQ entries ---
  + created faqEntry "faq-what-are-hours"
  ...

--- Press entries ---
  + created pressEntry "press-food-network-ddd"
  ...

Seed complete.
```

On re-runs, lines read `~ updated` instead of `+ created`.

---

## Resetting the dataset

To wipe all data and re-seed from scratch:

```
npx sanity dataset delete production
npx sanity dataset create production
pnpm seed
```

Warning: this is destructive. Any manual edits made in the Studio will be lost.

---

## People-photo exclusion list

The following files in `assets/photos-web/` contain identifiable people and
must NOT be uploaded to Sanity or published on the website without explicit
consent from those individuals. This consent must be obtained post-handoff by
Kara or Gavin McMillian.

| File path | Reason |
|---|---|
| `assets/photos-web/02-bar/back-bar-wide-with-staff.jpg` | Staff member visible at POS terminal |

Additional notes from `docs/06-capture-debrief.md`:

> Two back-bar shots include a staff member at the POS and a customer at the
> counter — crop or hold those until consent post-handoff.

The seed script does not upload either of these files. They are referenced in
code via the `EXCLUDED_PEOPLE_PHOTOS` Set in `scripts/seed.ts` so the
exclusion is machine-enforced, not just documented.

If additional photos with identifiable people are added to `assets/photos-web/`
in the future, add their absolute paths to `EXCLUDED_PEOPLE_PHOTOS` in
`scripts/seed.ts` and add a row to this table before running the seed.

---

## Open items requiring post-handoff follow-up

- **Artist attribution**: The artist who painted the fly series has not been
  identified. All `flyPainting` documents are seeded with `artistAttribution: null`.
  See `docs/OPEN-QUESTIONS.md`.
- **Press email**: The `siteSettings.pressEmail` field is `null`. Confirm the
  press contact address with Kara post-handoff.
- **DDD episode date and URL**: The Food Network entry uses a placeholder
  publish date of 2010-01-01. Confirm the episode number and update the
  `sourceUrl` before launch.
- **Gluten-free, alcohol, delivery, Fly Trap name origin**: Four FAQ entries
  are seeded with `answer: null` and `needsContent: true`. Fill these in the
  Studio once verified.
