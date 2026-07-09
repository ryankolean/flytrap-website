# Group 8b — Homepage hero rebuild (WIP, needs mock)

**Owner feedback (Sean, 7/8):**
- *"We would like the opening page to show the menu and special items up top under the logo."*
- *"Would be cool if the logo could minimize/shrink off the page as the site visitor scrolls down the page."*
- *"Like the Open Now if that can still be squeezed in somehow without impeding getting specials on opening page."*
- (8a, already shipped in #74) remove the See the Menu / Visit Us buttons.

## Goal
Opening screen = logo up top, specials/menu front and center directly beneath it, Open Now still visible, logo shrinks/lifts away on scroll.

## Current state
`App.jsx` hero = kicker "a finer diner" + wordmark + animated fly + (removed) CTA row + `hero-strip` (Open Now + hours). The existing scroll handler already hands the wordmark off to the sticky nav lockup (`pastHero`, `scrolled`) — reuse that for the shrink.

## Work
1. Surface specials in/under the hero (reuse the `Menu` specials grid or a compact strip).
2. Logo shrink-on-scroll: extend the existing hero→nav wordmark handoff into a scale/translate that lifts the logo off-screen.
3. Keep Open Now (`hero-strip`) visible without pushing specials below the fold.
4. Verify at 375 / 768 / 1280.

## BLOCKING dependency
- **Homepage layout mock** from Sean's 7/8 email (the image under "Example:") has not been retrieved — it defines this exact layout. Pull it before building.
- **Entangled with Group 9** (logo/fly) — the hero logo + fly animation are rebuilt together; coordinate or land 9 first.
- Builds on **8a (#74)**.

## Status
Draft. Blocked on the layout mock + coordination with Group 9.
