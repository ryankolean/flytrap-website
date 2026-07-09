# Group 4a — Vegetarian mark driven by Toast description glyph (BLOCKED)

**Owner feedback (Sean, 7/8):** *"Kara is able to insert a green leaf in the description of a menu or special item in Toast. She is actively adding these descriptions today … think it is better if this could be controlled by whether or not the description contains the green leaf."*

## Goal
Derive the vegetarian mark from the presence of a glyph in the item's Toast description, instead of a manual/heuristic `veg` flag.

## Confirmed from Toast — pulled 2026-07-09
Read the live Toast ordering menu (behind Cloudflare, via Chrome) and scanned every item description for emoji-range glyphs.

- **Exact glyph: 🥬 `U+1F96C` (LEAFY GREEN).** Single code point — **no** variation selector (`U+FE0F`) and **no** ZWJ sequence. It is the only emoji-range glyph anywhere on the menu.
- **Not** a literal green leaf. Sean's email said "green leaf" (🌿 / 🍃); Kara is actually using 🥬. **Confirm which is canonical** — detection must key off whatever Kara actually types, i.e. 🥬 today.
- **Placement:** always at the **end** of the description. Spacing is inconsistent — sometimes a leading space (`… Provolone. 🥬`), sometimes none (`… toast.🥬`). Detection and stripping must be whitespace-insensitive.
- **Tagged so far (5 of many veg items):** Veggie Rumble, The Boot, Huevos Rancheros, Eggs ala Simple, Slacker. All 5 are genuinely vegetarian (no false tags). **Kara's tagging is incomplete** — e.g. Gingerbread Waffle, Oatmeal, Granola, salads, Tempting Tempeh, Tofu Fried Rice are veg but not yet marked.

## Detection spec (ready to implement)
```js
const VEG_GLYPH = "\u{1F96C}";                 // 🥬 LEAFY GREEN
const isVeg   = (desc) => desc.includes(VEG_GLYPH);
const stripVeg = (desc) => desc.replace(/\s*\u{1F96C}\s*$/u, "").trim();  // remove trailing glyph for display
```

## Work (once unblocked)
1. **Specials (primary):** in the `flytrap-specials` skill Stage 3, replace the no-meat keyword heuristic with `isVeg(desc)` off 🥬, and `stripVeg(desc)` before storing `desc`. Change lives in `~/.claude/skills/flytrap-specials` (**outside this repo**).
2. **Hand-built menu:** decide — keep manual `veg` booleans in `data.js`, or sync from Toast. If synced, guard against Kara's partial tagging (a glyph-only flip today would **under-mark** ~15 veg dishes that are currently correct via manual flags).
3. `Menu.jsx` / shared: if detecting from a string, add the `isVeg` / `stripVeg` helpers above.
4. **Site mark vs Toast glyph:** the site renders a leaf-outline `VegLeaf` SVG (Group 4b legend, #71); Toast uses 🥬. Pick the canonical on-site mark — detection keys off 🥬 regardless of what the site displays.

## BLOCKED on
1. **Kara** finishing the 🥬 tagging in Toast (5 done, more veg items outstanding).
2. ~~Confirm the exact glyph~~ — **RESOLVED: 🥬 `U+1F96C`** (pulled 2026-07-09).
3. Decision on whether the hand-built menu switches to glyph-detection or stays manual (see under-marking risk above).

## Status
Draft, blocked. Glyph confirmed; primary logic is in the specials skill. Do not flip the hand-built menu until Kara's tagging is complete.
