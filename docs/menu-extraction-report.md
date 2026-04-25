# Menu Extraction Report — The Fly Trap

**Capture Date:** 2026-04-25  
**Photos Processed:** 6  
**Total Sections:** 13  
**Total Items:** 63

---

## Summary

All 6 menu photos were successfully processed and transcribed. The menu consists of breakfast (All Day Eggs), lunch specials, dinner items, sandwiches, salads, appetizers, and a full beverage program (mimosas, cocktails, wine, and beer).

---

## Sections & Confidence

| Section | Items | Confidence | Notes |
|---------|-------|-----------|-------|
| All Day Eggs | 10 | HIGH | Clear pricing and descriptions. Standard breakfast fare. |
| Lunch Special | 7 | HIGH | All prices legible. Lunch-until-3pm notation preserved. |
| Dinner Items | 4 | MEDIUM | Item names and descriptions clear, but **prices illegible** for 3 of 4 items. |
| Sandwiches | 7 | HIGH | Prices and descriptions clear. Good photo quality on this section. |
| Salads | 5 | HIGH | All readable. Standard salad offerings with clear pricing. |
| Appetizers | 7 | MEDIUM | Most items clear, but 2 items flagged for description clarity. See below. |
| Fly Mimosas | 4 | HIGH | Clear brunch-only callout. All prices legible. |
| Cocktails | 4 | LOW | **Prices entirely illegible.** Only house specialty names captured (Fly Berry, Fly Passion Fruit Margarita, etc.). |
| Wine | 2 | LOW | **No specific wine names or prices.** Only "Red Mountain" and "White Sparkling/Chablis/Pinot Grigio" categories legible. Prices unclear. |
| Beer - Draft | 3 | MEDIUM | 3 beers legible by name, **prices illegible.** Note mentions rotating taps. |
| Beer - Bottles | 1 | LOW | Only Corona Extra identified; **price illegible.** |
| Beer - Cans | 5 | MEDIUM | Beer names legible, **prices illegible.** No prices visible in photo. |
| N/A (Non-Alcoholic) | 2 | LOW | Only category headers visible ("Pop/Soda," "Fresh Juice Drafts"). **Prices illegible.** |

---

## Items Flagged for Reverification

### Critical Clarity Issues

1. **B.L.T. (Lunch Special)** — Description reads "Three Strips of Seasoned Ground Beef, Three Fresh Lettuce..." This is inconsistent with a traditional BLT (should be bacon, lettuce, tomato). May be a mislabeled sandwich or photo quality issue.

2. **Breaded Mushrooms (Appetizers)** — Description states "Mushrooms Sautéed and Breaded, Pepper, Onion, Spinach & Preservatives Stuffed in a One-Sandwich." The phrase "Preservatives Stuffed" and "One-Sandwich" do not parse. Likely a transcription error or unclear photo.

3. **Onion Rings (Appetizers)** — Description mentions "Onion Rings or Cha Chim Salsa Served with Fries or Chips." "Cha Chim" is unclear — may be a specific style or sauce name. Needs verification.

### Price Illegibility

The following items have `price: null` and `price_unclear: true`:

- **Dinner Items:** Ribeye Steak, Roasted Chicken, Pork Chops (3 items)
- **Cocktails:** All 4 specialty cocktails
- **Wine:** Red Mountain, White Sparkling/Chablis/Pinot Grigio (both categories)
- **Beer on Draft:** Bud Light, Modelo, Stella Artois
- **Beer - Bottles:** Corona Extra
- **Beer - Cans:** Busch Light, Bud Light, Modelo, Miller Lite, Natural Light (5 items)
- **Non-Alcoholic:** Pop/Soda, Fresh Juice Drafts (2 items)

**Total items with price issues: 17 out of 63 (27%)**

---

## Photo Quality Notes

- **Main Menu Front-A & B (breakfast/lunch):** Excellent clarity. Prices and descriptions fully legible.
- **Main Menu Back-A & B (dinner/sandwiches/salads):** Good clarity on item names and descriptions. Dinner prices partially illegible.
- **Cocktail Menu:** Section headers and specialty names clear. **Prices entirely obscured or not visible in photo.** Likely reflection/glare on the menu lamination.
- **Beer Menu:** Beer names legible via green bottle shapes and labels. **Prices not legible.** Layout uses green banner badges which may obscure pricing info.

---

## Footnotes Captured

One footnote was identified and preserved verbatim:

> "OTHER FLY TRAP HAS A FULL BAR, WINE AND BRUNCH, AFTER 3 BREAKFAST"

This appears on the back of the main menu and refers to an alternate or sister location.

---

## Open Questions for Human Verification

1. **BLT ingredient confusion** — Is this actually a beef sandwich mislabeled, or does The Fly Trap do a unique ground-beef BLT?
2. **Dinner prices** — What are the prices for Ribeye Steak, Roasted Chicken, and Pork Chops?
3. **Cocktail prices** — What are the prices for the four house specialty cocktails?
4. **Wine pricing and selection** — Are there specific wine names/selections, or is it truly a "ask bartender" situation? What are glass/bottle prices?
5. **Beer pricing** — What are the draft, bottle, and can prices? Are prices consistent or do draft beers vary by size?
6. **Non-alcoholic drinks** — What soft drink brands are available? What are the prices?
7. **Breaded Mushrooms description** — Is this an appetizer with modifiers, or is the description corrupted?
8. **Onion Rings description** — Does "Cha Chim Salsa" refer to a dipping sauce or a variant?

---

## Sanity CMS Readiness

The extracted JSON is structured and ready for Sanity ingestion. All required fields are present:

- ✓ Section IDs (kebab-case)
- ✓ Item IDs (kebab-case)
- ✓ Names and descriptions (preserved verbatim)
- ✓ Prices (null where illegible; `price_unclear: true` flag set)
- ✓ Dietary flags (vegetarian, vegan identified where applicable)
- ✓ Modifiers (choice-based options captured)
- ✓ Reverification flags on ambiguous items

**Recommended next step:** Share the JSON with Kara or a menu stakeholder to clarify the 17 items with price issues and the 3 items with description clarity problems.

---

## Process Notes

- All 6 photos were successfully read (no unreadable or non-menu photos).
- Capitalization, punctuation, and phrasing preserved exactly as printed.
- No menu items were invented or prices guessed.
- Dietary flags inferred from item names only where confident (e.g., "Portobello Mushroom Sandwich" marked vegetarian/vegan).
- No other files were modified.
