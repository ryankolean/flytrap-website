# Group 7 — Menu scrolls through all sections (WIP)

**Owner feedback (Sean, 7/8):** *"Would like to have this actively scroll through each of the menu sections as the visitor scrolls down the page instead of requiring them to click on each of the headings to pull up each section. Keep the navigation so that they can quickly jump to each section."*

## Goal
Render all menu categories stacked and scrollable. The tab bar becomes jump-nav (anchors) with an active-section highlight (scrollspy) instead of a show-one-at-a-time switch.

## Current state
`Menu.jsx` keeps `active` state and renders only the selected category (or Specials). Tabs call `setActive`. Search filters within the active category.

## Work
1. `Menu.jsx` — render **every** category section in order (Specials first), each with an `id`. Remove the show-one gate.
2. Convert the tab bar to jump links that smooth-scroll to each category `id`; keep it sticky within the menu frame.
3. Scrollspy: `IntersectionObserver` marks the tab of the section nearest the top as active.
4. Decide search behavior: either keep a global filter that hides non-matching items across all sections, or drop search. **Needs a decision.**
5. `site.css` — styles for stacked sections + sticky jump-nav + active state.
6. Verify at 375 / 768 / 1280: scroll updates the active tab; jump links land on the right section; specials still first.

## Open questions
- Keep the search box? If yes, define filtered-scroll behavior.
- Sticky jump-nav on mobile (horizontal scroll) vs. a dropdown?

## Dependencies / ordering
- Touches `Menu.jsx` + `site.css`. Land **before** Group 6 (which also edits menu CSS) or coordinate.
- Independent of the hero groups.

## Status
Draft. Well-specified but a meaningful `Menu.jsx` rewrite with UX choices to confirm before build.
