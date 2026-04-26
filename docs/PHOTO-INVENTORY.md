# Photo inventory — assets/photos-web/

Catalog of every web-optimized photo in this repo and the section it lands in per `docs/CLAUDE-DESIGN.md` §6. Originals live in private repo `ryankolean/flytrap-website-assets-archive` — do not re-add to this repo.

## Photo handling rules (recap from CLAUDE-DESIGN.md §7)

- Glass-reflection photos: present at ≤1200px wide. Reflections imperceptible at that size.
- Identifiable people: crop or hold. Never blur (reads evasive). Two back-bar shots have staff at POS / customer at counter — flagged below.
- AI extension or content alteration: never.
- Use `next/image` with explicit `alt`. Decorative-only images get `alt=""`.

## 01-artwork/fly-paintings/

17 individual fly paintings, dead-center captures. Filenames are pre-numbered to match the catalog.

| File | Title | Site placement |
|---|---|---|
| `01-fly-perched-on-blank-page.jpg` | *Fly Perched on a Blank Page* | Catalog only (gallery scroll) |
| `02-fly-asleep-recliner-tv.jpg` | *Fly Asleep in Recliner with TV* | Catalog only |
| `03-fly-art-class-portrait-session.jpg` | *Fly Art Class* | **Hero rotation 1** + opens §2 About |
| `04-fly-on-horseback-cowboy.jpg` | *Fly on Horseback (Cowboy)* | Catalog only |
| `05-flies-playing-hopscotch.jpg` | *Flies Playing Hopscotch* | Catalog only |
| `06-fly-fly-fishing.jpg` | *Fly Fly-Fishing* | **Hero rotation 2** |
| `07-fly-band-buskers-with-tip-jar.jpg` | *Fly Band / Buskers* | Catalog only |
| `08-flies-candlelit-dinner-date.jpg` | *Flies on a Dinner Date* | **Hero rotation 3** |
| `09-fly-mowing-lawn-other-on-vacation.jpg` | *Fly Mowing Lawn / Other on Vacation* | Catalog only |
| `10-flies-lightsaber-duel.jpg` | *Flies Lightsaber Duel* | Catalog only |
| `11-flies-kissing-with-hearts.jpg` | *Flies Kissing on a Hilltop* | **Hero rotation 4** |
| `12-fly-collapsed-in-desert.jpg` | *Fly Collapsed in Desert* | Catalog only |
| `13-fly-eye-doctor-version-A.jpg` | *The Eye Doctor* (A) | **Hero rotation 5** (preferred crop) |
| `13-fly-eye-doctor-version-B.jpg` | *The Eye Doctor* (B) | Backup crop |
| `14-fly-on-toilet.jpg` | *Fly on the Toilet* | **Catalog only — never hero** (bathroom-context) |
| `15-flies-bathroom-line.jpg` | *Bathroom Line* | **Catalog only — never hero** |
| `16-flies-at-urinals.jpg` | *Flies at Urinals* | **Catalog only — never hero** |
| `17-drunk-fly-with-other-on-scale.jpg` | *Drunk Fly with Other on Scale* | Catalog only |

Hero rotation order is locked. Bathroom-context paintings (14, 15, 16) appear only in §3 The Room gallery, never on the home rotation.

## 02-bar/

| File | Subject | Site placement | Notes |
|---|---|---|---|
| `back-bar-portrait-painting.jpg` | Joe Strummer back-bar portrait | §3 The Room (interior grid tile) | Frame this on back-bar-mauve wall context |
| `back-bar-wide-with-staff.jpg` | Wide back-bar with staff at POS | **HOLD** — has identifiable staff member | Crop tight to portrait + bottles before publishing, or hold until consent post-handoff |
| `marble-bar-top-detail-A.jpg` | Marble bar top close-up | §3 The Room (interior grid tile) | Anchors the marble-jewel-tone motif |
| `marble-bar-top-detail-B.jpg` | Marble bar top alt angle | Backup | Use only if A is over-saturated in layout |

## 04-details/

### checkerboard-signage/

| File | Subject | Site placement |
|---|---|---|
| `restroom-sign-checkerboard-toilet.jpg` | Restroom sign on checkerboard | §3 The Room interior grid OR §10 FAQ accent |

### marble-spheres/

| File | Subject | Site placement |
|---|---|---|
| `marble-spheres-and-fly-murals-wide.jpg` | Marble spheres + fly murals (wide) | §3 The Room (interior grid) |
| `marble-spheres-with-chalkboards.jpg` | Marble spheres on chalkboard wall (navy-slate) | §3 The Room OR §10 FAQ accent |

### tin-ceiling/

| File | Subject | Site placement |
|---|---|---|
| `tin-ceiling-A.jpg` | Pressed-tin ceiling (preferred) | §3 The Room (interior grid tile, "pressed-tin ceiling") |
| `tin-ceiling-B.jpg` | Pressed-tin ceiling (alt) | Backup |

## 07-menu/

Menu photos for OCR / transcription reference. Already extracted into `docs/menu-extracted.json` and `docs/menu-extraction-report.md`. **Do not display these as menu UI** — they are reference scans, not site content. Section §4 Menu highlights pulls from `docs/menu-extracted.json`.

| File | Use |
|---|---|
| `main-menu-front-A.jpg` / `B.jpg` | Reference for §4 dish list |
| `main-menu-back-A.jpg` / `B.jpg` | Reference for §4 dish list |
| `cocktail-menu.jpg` | Reference only (no cocktail section in Phase A) |
| `beer-menu.jpg` | Reference only (no beer section in Phase A) |

## §3 The Room — interior grid tile composition (6 tiles)

Per `docs/CLAUDE-DESIGN.md` §6 row 3, the interior grid is six tiles. Recommended source files:

| Tile | Subject | Source file |
|---|---|---|
| 1 | Checkerboard floor | (capture gap — placeholder until return visit; see CLAUDE-DESIGN §7) |
| 2 | Marble bar top | `02-bar/marble-bar-top-detail-A.jpg` |
| 3 | Pressed-tin ceiling | `04-details/tin-ceiling/tin-ceiling-A.jpg` |
| 4 | Marble spheres | `04-details/marble-spheres/marble-spheres-with-chalkboards.jpg` |
| 5 | Salt-and-pepper shaker wall | (capture gap — placeholder until return visit) |
| 6 | Exterior golden hour | (capture gap — placeholder until return visit) |

Capture gaps are tracked in `docs/CLAUDE-DESIGN.md` §7. Use the lighting / framing already established in surrounding tiles when staging placeholders.

## Reference photos (out of `assets/`, not for site)

`/tmp/flytrap-photos-batch3/` (local-only, not committed) — seven 2026-04-26 follow-up captures used to calibrate the 6-wall zone palette. Source-of-record for the wall-zone hex values in `globals.css` `@theme`. Do not copy into the repo; they are color-reference, not site content.

## Hard-stop reminder

- **Never** publish `back-bar-wide-with-staff.jpg` uncropped.
- **Never** include paintings 14, 15, 16 in the hero rotation.
- **Never** present glass-reflection photos above 1200px wide.
- **Never** AI-extend, content-alter, or blur faces.
