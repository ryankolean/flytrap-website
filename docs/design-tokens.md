# The Fly Trap — Design Tokens Reference

*Sampled from on-site capture (April 25, 2026) and documented in `07-capture-audit-and-discoveries.md`. These tokens form the foundation of the Tailwind theme and CSS variable system.*

---

## Overview: Three-Zone Color Model

The Fly Trap's interior is not painted in a single signature color—it is **deliberately color-zoned**, with each zone carrying its own emotional tone and spatial purpose. The website mirrors this model, allowing different sections and pages to adopt a "primary zone" color without creating visual chaos.

### Zones explained

| Zone | Wall Color | Role | Brand Use |
|---|---|---|---|
| **Bar Zone** | Gray-lavender (`#797A7E`) | Calming, lets the marble bar and back-bar art pop | Section backgrounds, contrast surfaces, data-heavy pages (menu, FAQ) |
| **Corridor Zone** | Yellow-mustard (`#B9A651`) | Playful, energetic, restroom environment | Playful accents, secondary CTAs, warm inviting sections (Visit, Shop) |
| **Dining Room Zone** | Fire-engine red (sample TBD — return visit) | Bold, appetite-stimulating, hero impact | Primary brand statements, hero CTAs, accent highlights (stubbed as `#992F1E` until sampled) |

**Website application rule:** Each page or section scroll-block has a single "primary zone." Never layer multiple zones on the same view. This preserves the spatial clarity of the physical room and prevents the site from reading as a parade of brand colors.

---

## Color Tokens

### Primary Brand Reds

| Token Name | Hex | Source | Role | Zone |
|---|---|---|---|---|
| `flytrap-red-deep` | `#992F1E` | Marble bar epoxy matrix (sampled April 25, 2026) | Primary brand identity, body accents, strong CTAs | Dining Room (accent) |
| `flytrap-red-bright` | TBD (return visit pending) | Dining room walls (not yet captured) | Hero statements, wordmark, high-impact accents | Dining Room (primary) |

**Note:** The audit doc samples `#992F1E` from the marble bar's epoxy matrix, not the wall color. The design doc v1.0 assumed "fire-engine red" walls; the audit reveals the walls are a separate sample TBD. For Phase 1 of the build, `flytrap-red-deep` (#992F1E) serves as the primary red until the dining-room wall is photographed on a return visit.

### Zone Neutrals

| Token Name | Hex | Source | Role | Zone |
|---|---|---|---|---|
| `bar-fog` | `#797A7E` | Gray-lavender bar walls (sampled April 25, 2026) | Section backgrounds, contrast surfaces, data-heavy sections | Bar (primary) |
| `corridor-mustard` | `#B9A651` | Yellow-mustard restroom corridor walls (sampled April 25, 2026) | Playful accents, secondary CTAs, warm inviting pages | Corridor (primary) |
| `cream-paper` | `#F5EEDC` | Menu paper (placeholder; verify on-site) | Page backgrounds, neutral content zones | All zones |
| `checker-black` | `#1A1A1A` | Menu border + restroom sign (sampled) | Text, structural framing, high-contrast elements | All zones |

### Marble Spectrum (Jewel Tones)

The marble bar top contains a full range of real gemstone-colored marbles. These form a purely decorative palette—never used for large fills or primary interface elements. Used for spot-illustration tints, hover states, small decorative touches, and the bar's signature visual motif.

| Token Name | Hex | Marble Color | Note |
|---|---|---|---|
| `marble-ruby` | TBD (calibrate from photo) | Ruby red | Spot illustration, hover effects |
| `marble-ultramarine` | TBD (calibrate from photo) | Deep blue | Spot illustration, hover effects |
| `marble-emerald` | TBD (calibrate from photo) | Emerald green | Spot illustration, hover effects |
| `marble-gold` | TBD (calibrate from photo) | Butterscotch/gold | Spot illustration, hover effects |
| `marble-plum` | TBD (calibrate from photo) | Plum purple | Spot illustration, hover effects |
| `marble-teal` | TBD (calibrate from photo) | Teal blue-green | Spot illustration, hover effects |
| `marble-jade` | TBD (calibrate from photo) | Jade green | Spot illustration, hover effects |
| `marble-white` | TBD (calibrate from photo) | White marble | Spot illustration, hover effects |

**TODO:** On return visit, photograph the marble bar close-up and sample each distinct marble color individually. These tokens exist as a named palette but should not ship in Phase 1 of the build unless the colors are calibrated directly from photos.

### Neutrals & Structural

| Token Name | Hex | Role |
|---|---|---|
| `text-ink` | `#1A1A1A` (same as `checker-black`) | Primary body text, high-contrast headings |
| `text-charcoal` | `#4A4A4E` (inferred from `bar-fog` harmony) | Secondary text, supporting copy |
| `text-light` | `#F5EEDC` (same as `cream-paper`) | Text on dark backgrounds |
| `bg-white` | `#FFFFFF` | Page backgrounds, card fills |
| `bg-off-white` | `#F5EEDC` (same as `cream-paper`) | Subtle fill, menu cards, section breaks |

---

## Typography System

*(Candidates identified in design doc §6. Final selection pending Phase 1 prototype.)*

### Font Families (locked for build; selection TBD at type-pairing phase)

**Option A — Warm Editorial**
- **Display:** Fraunces (Google Fonts, @import)
- **Body:** Figtree (Google Fonts, @import)
- **Accent:** Reenie Beanie (Google Fonts, @import)

**Option B — Confident Slab**
- **Display:** Recoleta (Google Fonts, @import)
- **Body:** Inter (Google Fonts, @import)
- **Accent:** Caveat (Google Fonts, @import)

**Option C — Signpainter**
- **Display:** Bagnard or Pilcrow (Google Fonts, @import)
- **Body:** Söhne (premium, requires license or substitution)
- **Accent:** Custom lettering (post-handoff)

### Type Scale

| Scale | Size (px) | Line-Height | Use Case |
|---|---|---|---|
| `h1` | 48 | 1.2 | Page hero headlines |
| `h2` | 36 | 1.3 | Section headings |
| `h3` | 28 | 1.4 | Subsection headings |
| `h4` | 24 | 1.4 | Card titles |
| `body-lg` | 18 | 1.6 | Large body copy (intro paragraphs) |
| `body-base` | 16 | 1.6 | Regular body copy (default) |
| `body-sm` | 14 | 1.5 | Supporting text, metadata |
| `caption` | 12 | 1.4 | Labels, timestamps |

**Mobile adjustment:** All sizes scale down by ~15–20% on 375px viewports; exact breakpoints set in Tailwind config.

---

## Spacing System

*(Classic 8px base grid for predictable, harmonious spacing.)*

| Token | Value (px) | Use |
|---|---|---|
| `space-1` | 8 | Tight spacing: padding within buttons, gaps between inline elements |
| `space-2` | 16 | Standard padding: card padding, section margins |
| `space-3` | 24 | Medium margins: section breaks, stacked elements |
| `space-4` | 32 | Large margins: page section spacing |
| `space-5` | 40 | Hero spacing: margin between hero and next section |
| `space-6` | 48 | XL spacing: vertical rhythm between major sections |
| `space-8` | 64 | XXL spacing: full-viewport breathing room |

---

## Radius & Shadows

### Border Radius

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | Checkerboard patterns, strict rectangles |
| `radius-sm` | 4px | Small buttons, subtle rounding |
| `radius-md` | 8px | Card corners, input fields |
| `radius-lg` | 12px | Large interactive components |
| `radius-full` | 9999px | Pills, circular elements |

### Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth on cards |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Standard card elevation |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.15)` | Modal/overlay depth |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.2)` | High-impact hero depth |

**Note:** The marble bar and pressed-tin ceiling textures may introduce custom shadow patterns in Phase 2 photography pass; these are baseline shadows for UI components.

---

## Motion & Timing

*(All motion respects `prefers-reduced-motion` media query.)*

| Token | Value | Use |
|---|---|---|
| `motion-fast` | 150ms | Quick feedback (button press, input focus) |
| `motion-base` | 200ms | Standard transitions (hover states, fade-ins) |
| `motion-slow` | 300ms | Dramatic reveals (scroll-triggered animations) |
| `timing-ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing for reveals |
| `timing-ease-in-out` | `cubic-bezier(0.4, 0, 0.4, 1)` | Smooth back-and-forth animations |

---

## Wordmark & Logo System

*(Captured from printed menu, April 25, 2026.)*

The wordmark "**the fly trap**" is rendered in a red, custom display serif (likely a customized Pacifico-adjacent or hand-drawn serif). Underneath sits the script tagline "**a finer diner**" with a small fly + double-line flourish. The entire lockup is typically framed by a **checkerboard border**.

**On the website:**
- **Primary lockup:** Wordmark + tagline + checkerboard border (hero section)
- **Secondary lockup:** Wordmark only (header, footer)
- **Icon mark:** Standalone fly + double-line flourish (small logo, favicon, loading spinner)

Vector redraw or font-match is pending; see `docs/01-design-document-v1.7.md` Open Question #5.

---

## Summary: Token Names (Quick Reference)

### Colors (Tailwind config keys)
- `flytrap-red-deep`, `flytrap-red-bright` (reds)
- `bar-fog`, `corridor-mustard` (zones)
- `cream-paper`, `checker-black` (neutrals)
- `marble-ruby`, `marble-ultramarine`, `marble-emerald`, `marble-gold`, `marble-plum`, `marble-teal`, `marble-jade`, `marble-white` (decorative palette)
- `text-ink`, `text-charcoal`, `text-light` (semantic text)
- `bg-white`, `bg-off-white` (semantic backgrounds)

### Spacing
- `space-1` through `space-8`

### Typography
- Scale: `h1`, `h2`, `h3`, `h4`, `body-lg`, `body-base`, `body-sm`, `caption`
- Font families: TBD on type-pairing selection (Options A, B, or C)

### Shadows & Radius
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- Radius: `radius-none`, `radius-sm`, `radius-md`, `radius-lg`, `radius-full`

### Motion
- Durations: `motion-fast` (150ms), `motion-base` (200ms), `motion-slow` (300ms)
- Easing: `timing-ease-out`, `timing-ease-in-out`

---

## TODOs & Return-Visit Calibrations

1. **`flytrap-red-bright`** — Photograph clean section of dining-room red wall on return visit; sample hex value
2. **Marble spectrum colors** — Photograph marble bar close-up; sample each marble individually
3. **`cream-paper` exact value** — Verify placeholder (#F5EEDC) against physical menu on return visit
4. **Font selection** — Prototype all three type pairings (Options A, B, C) against hero mock in Phase 1
5. **Wordmark vector** — Confirm whether current wordmark exists as SVG/AI, or redraw from menu raster
6. **Text hierarchy on photos** — Verify contrast ratios (WCAG AA minimum) when text sits on marble, pressed-tin, and photo backgrounds

---

*Last updated: April 25, 2026 — derived from `docs/07-capture-audit-and-discoveries.md` and `docs/01-design-document-v1.7.md`.*
