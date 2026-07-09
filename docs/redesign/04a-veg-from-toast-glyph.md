# Group 4a — Vegetarian mark driven by Toast description glyph (BLOCKED)

**Owner feedback (Sean, 7/8):** *"Kara is able to insert a green leaf in the description of a menu or special item in Toast. She is actively adding these descriptions today … think it is better if this could be controlled by whether or not the description contains the green leaf."*

## Goal
Derive the vegetarian mark from the presence of a leaf glyph in the item's Toast description, instead of a manual/heuristic `veg` flag.

## Current state
- Site **menu** `veg` flags are hand-set booleans in `data.js`; `Menu.jsx` renders `<VegLeaf />` when `veg` is true. The menu is hand-built, not Toast-pulled.
- Only **specials** come from Toast (via the `flytrap-specials` skill, outside this repo).
- The footer legend for the mark shipped separately as Group 4b (#71).

## Work (once unblocked)
1. Toast-pull (specials) — in the `flytrap-specials` skill, set `veg: true` when the Toast description contains the agreed leaf glyph; strip the glyph from the displayed text. (Change lives in `~/.claude/skills/flytrap-specials`, not this repo.)
2. Hand-built menu — decide: keep manual `veg` booleans in `data.js`, or also honor a leaf glyph if Kara maintains descriptions in Toast for menu items too.
3. `Menu.jsx` — if we detect from a description string, add a shared `isVeg(desc)` helper used by both specials and menu items.

## BLOCKED on
1. **Kara** finishing the leaf glyph in Toast descriptions.
2. **Confirm the exact glyph** — 🌿 vs 🍃 vs ☘ vs an inline SVG — so detection + the Group 4b legend match.
3. Decision on whether the hand-built menu switches mechanism or stays manual.

## Status
Draft, blocked. Placeholder for the detection change; primary logic is in the specials skill.
