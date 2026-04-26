# Claude Design upload bundle — manifest

Companion doc to `docs/CLAUDE-DESIGN-PROMPT.md`. Describes what goes into the upload bundle for initializing a Claude Design design system.

## Bundle location (after generation)

`/tmp/flytrap-design-bundle/` (staging directory, 30 MB)
`/tmp/flytrap-design-bundle.zip` (single-file upload, ~30 MB, 78 files)

## Contents

```
flytrap-design-bundle/
├── 00-START-HERE.md                ← manifest + company name + blurb
├── 01-tokens.css                   ← Tailwind v4 @theme block (copy of src/app/globals.css)
├── 02-section-outline.md           ← 12-section single-page outline with per-section zone
├── 03-voice-rules.md               ← anchor phrases, banned words, sample copy, microcopy
├── 04-photo-inventory.md           ← every photo mapped to its section
├── photos/                         ← 40 web-optimized JPGs (29 MB)
│   ├── 01-artwork/fly-paintings/         (17 paintings, hero rotation locked)
│   ├── 02-bar/                            (4 bar shots — 1 flagged for consent)
│   ├── 04-details/                        (5 detail shots — tin, marble spheres, signage)
│   ├── 07-menu/                           (6 menu scans — reference only)
│   └── color-reference-2026-04-26/        (7 wall-color reference shots, renamed)
├── fonts/                          ← 15 woff2 files (420 KB)
│   ├── README.md                          (usage rules + Google Fonts source URLs)
│   ├── fraunces/                          (300/400/500/600/700/800/900)
│   ├── inter/                             (300/400/500/600/700/800/900)
│   └── caveat/                            (400/500/600/700)
└── logos/
    └── README.md                   ← wordmark spec (no vector yet — Open Question #5)
```

## How to regenerate the bundle

If the bundle is lost or stale, regenerate from this repo:

```bash
# Stage directory
mkdir -p /tmp/flytrap-design-bundle/{photos/color-reference-2026-04-26,fonts,logos}

# Photos from this repo
cp -R assets/photos-web/01-artwork /tmp/flytrap-design-bundle/photos/
cp -R assets/photos-web/02-bar     /tmp/flytrap-design-bundle/photos/
cp -R assets/photos-web/04-details /tmp/flytrap-design-bundle/photos/
cp -R assets/photos-web/07-menu    /tmp/flytrap-design-bundle/photos/

# Color-reference photos (from local /tmp; not in repo per design constraint)
cp /tmp/flytrap-photos-batch3/PXL_20260426_152724984.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-butter-yellow-swatch.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_152730755.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-terracotta-swatch.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_154525765.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-back-bar-mauve-context.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_154528211.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/marble-bar-top-jewel-tones.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_154537269.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-chartreuse-context.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_154540491.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-plum-with-jacks.jpg
cp /tmp/flytrap-photos-batch3/PXL_20260426_165950537.jpg /tmp/flytrap-design-bundle/photos/color-reference-2026-04-26/wall-navy-slate-with-chalkboard.jpg

# Fonts (Google Webfonts Helper, latin subset, woff2)
curl -sSL "https://gwfh.mranftl.com/api/fonts/fraunces?download=zip&subsets=latin&variants=300,400,500,600,700,800,900&formats=woff2" -o /tmp/fraunces.zip
curl -sSL "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin&variants=300,400,500,600,700,800,900&formats=woff2" -o /tmp/inter.zip
curl -sSL "https://gwfh.mranftl.com/api/fonts/caveat?download=zip&subsets=latin&variants=400,500,600,700&formats=woff2" -o /tmp/caveat.zip
mkdir -p /tmp/flytrap-design-bundle/fonts/{fraunces,inter,caveat}
unzip -q /tmp/fraunces.zip -d /tmp/flytrap-design-bundle/fonts/fraunces
unzip -q /tmp/inter.zip    -d /tmp/flytrap-design-bundle/fonts/inter
unzip -q /tmp/caveat.zip   -d /tmp/flytrap-design-bundle/fonts/caveat

# Tokens, section outline, voice, photo inventory
cp src/app/globals.css           /tmp/flytrap-design-bundle/01-tokens.css
cp docs/PHOTO-INVENTORY.md       /tmp/flytrap-design-bundle/04-photo-inventory.md

# 00-START-HERE, 02-section-outline, 03-voice-rules, fonts/README, logos/README
# are written by hand from docs/CLAUDE-DESIGN-PROMPT.md and docs/CLAUDE-DESIGN.md
# (see scripts/build-design-bundle.sh — TODO if this becomes a recurring need)

# Zip
cd /tmp && zip -qr flytrap-design-bundle.zip flytrap-design-bundle
```

## What is NOT in the bundle (and why)

- **Vector wordmark.** Tracked as Open Question #5. Wordmark is currently CSS-rendered from Fraunces + Caveat per the spec in `logos/README.md`. Commission a vector only after speculative-build handoff per `CLAUDE.md` engagement model.
- **DDD badge artwork.** Network owns rights — render as text chip per logos/README spec.
- **Social-icon set.** Use Instagram and Facebook official brand-approved icons at upload time, not bundled.
- **Full-resolution photo originals.** Live in private repo `ryankolean/flytrap-website-assets-archive`. Web-optimized only in this bundle.
- **Photos with identifiable people.** `back-bar-wide-with-staff.jpg` is included but FLAGGED in `04-photo-inventory.md`. Crop tight or hold until consent post-handoff. Never publish uncropped.
- **Bathroom-context paintings (14, 15, 16) in hero usage.** Catalog-only per CLAUDE-DESIGN.md §6. They are in the bundle but `04-photo-inventory.md` flags them.

## Hard "no" reminders (carry into Claude Design)

- No emojis anywhere — copy, code, output, headings.
- No live integrations in Phase A. Toast = "Coming Soon" stub. Instagram = mock JSON. Commerce = stubbed.
- No commercial commitments on Kara's behalf.
- noindex stays on until handoff (gated by `NEXT_PUBLIC_ALLOW_INDEXING !== 'true'`).
