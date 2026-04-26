# Claude Design — initialization prompt

Paste-ready inputs for the "Company name and blurb (or name of design system)" prompt when initializing a Claude Design design system. Pair with the upload bundle in `flytrap-design-bundle.zip` (photos, fonts, tokens, voice rules).

---

## Company / project name

**The Fly Trap**

(Suggested design-system name if a separate field: **Fly Trap — a finer diner**)

## Blurb (paste this)

The Fly Trap is a finer diner at 22950 Woodward Avenue in Ferndale, Michigan — Buzzin' since 2004. American comfort food with global cooks' tables: pho, Thai peanut, Italian, breakfast all day, Monday through Sunday from 8am to 3pm. The diner came back under old management in October 2024. Owners: Kara and Gavin McMillian. Featured on Food Network's *Diners, Drive-Ins and Dives*.

The brand is funny, specific, and warm — never polished or corporate. Voice is contractions-yes, active voice, dishes named by name, the room arguing for itself. Anchor phrases preserved verbatim: *"a finer diner"*, *"Under Old Management"*, *"Catch a Buzz"*, *"Buzzin' since 2004"*, *"magnificent life"*, *"beloved and inquisitive customers"*. **No emojis, ever.** Banned words: *elevated, delve, leverage* (as a verb), *seamless, robust, dive deep, cutting-edge, game-changer, streamline, empower, unlock, craft* (as marketing verb).

The visual identity is built around the diner's actual room: a marble-inlay bar top with embedded jewel-tone marbles in red epoxy, six painted-wall color zones, a checkerboard floor that wraps into wordmark borders, a pressed-tin ceiling, and a catalog of seventeen surreal fly paintings (flies playing hopscotch, flies on a candlelit dinner date, flies kissing on a hilltop, an eye chart that spells FLY). The site is a single-page mobile-first scroll, one section per zone color, never two zones layered.

### Wall-zone palette

| Token | Hex | Wall source |
|---|---|---|
| `flytrap-red-deep` | `#992F1E` | Brand red, marble-bar epoxy |
| `cream-paper` | `#F5EEDC` | Page canvas |
| `butter-yellow` | `#C8B880` | Solid butter wall |
| `chartreuse` | `#C8B000` | Atomic-pendant back-bar |
| `terracotta` | `#D88858` | Burnt-orange wall |
| `plum` | `#685050` | Ceramic-jacks installation room |
| `navy-slate` | `#383838` | Chalkboard-menu wall |
| `back-bar-mauve` | `#6A6A6E` | Joe Strummer back-bar wall |
| `checker-black` | `#1A1A1A` | Floor and structural framing |

### Marble jewel tones (decorative only — never solid fills)

`marble-ruby #C00A1A`, `marble-ultramarine #0A2A66`, `marble-emerald #00664C`, `marble-gold #D4A574`, `marble-plum #6B4C7A`, `marble-teal #00A39C`, `marble-jade #2D9C7E`, `marble-white #F5F5F5`.

### Typography

- **Display serif:** Fraunces (fallback Recoleta, Georgia, serif) — wordmark and headlines
- **Body sans:** Inter (fallback Figtree, system-ui) — body, UI, microcopy
- **Script accent:** Caveat (fallback Reenie Beanie, cursive) — *"a finer diner"* tagline

### Audience and tone

Locals who treat the diner as a daily haunt. Out-of-towners following the *DDD* clip. Younger visitors arriving for the painting wall and the marble bar. Warm to all three; never reverent.

### Hard "no" list

No live integrations, no commerce, no analytics in Phase A. No identifiable people in published photos without consent. No AI-extension or content alteration of photos. No emojis. No corporate polish.

---

## What to upload alongside this blurb

Upload `flytrap-design-bundle.zip` (built at `/tmp/flytrap-design-bundle.zip` — see `docs/CLAUDE-DESIGN-UPLOAD-MANIFEST.md` for contents). It contains:

1. `00-START-HERE.md` — manifest + this blurb
2. `01-tokens.css` — Tailwind v4 `@theme` block (CSS-first, copy directly into Claude Design's tokens)
3. `02-section-outline.md` — twelve-section single-page outline with per-section zone assignment
4. `03-voice-rules.md` — anchor phrases, banned words, sample voice-matched copy
5. `04-photo-inventory.md` — every photo mapped to its target section
6. `photos/` — 30+ web-optimized photos (paintings, bar, details, menu) + 7 wall-color reference shots
7. `fonts/README.md` — Google Fonts download links for Fraunces, Inter, Caveat
8. `logos/README.md` — wordmark spec (vector pending; render from Fraunces + Caveat per spec)
