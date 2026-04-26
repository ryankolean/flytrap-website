# Fly Spot-Illustrations (Placeholder Set)

Eight stylized fly SVG components, deployed contextually across the site as placeholders. Each renders a fly character engaged in a human activity, sized for small accent use via Tailwind classes.

## Component Reference

| Component | Context | Why Placeholder |
|-----------|---------|-----------------|
| `FlyTippingHat` | Hero section | Initial greeting, whimsical welcome |
| `FlyPouringCoffee` | Today's Buzzing | Daily special section, morning service cue |
| `FlyAtCheckout` | Swat Shop (commerce) | Point-of-sale context |
| `FlyBookended` | Footer mark | Bookending footer content, visual marker |
| `FlyOnBlankPage` | 404 / empty states | Contextual placeholder for missing content |
| `FlySleeping` | Coming Soon stubs | Deferred feature indicator |
| `FlyReading` | FAQ section | Information-seeking context |
| `FlyWaving` | Contact / Visit section | Farewell / visit invitation |

## Props

Each component accepts:
- `className?: string` — Tailwind classes applied to the SVG (e.g., `"h-12 w-12 text-red-600"`)
- `aria-hidden?: boolean` — Defaults to `true`; override if the illustration has semantic meaning

## Swap Path (Post-Handoff)

To replace with commissioned illustrations:

1. Engage the original fly-painting artist (or another illustrator matching their style — see design doc §7.3 and OPEN-QUESTIONS.md #1)
2. Request 8 SVG files matching the component names and contexts above
3. Replace each file's `<svg>` content while keeping the React wrapper, props, and `aria-hidden` behavior intact
4. No changes needed to imports or usage across the site

Example:
```tsx
// Keep this wrapper and prop structure:
export default function FlyTippingHat({
  className = '',
  'aria-hidden': ariaHidden = true,
}: {
  className?: string;
  'aria-hidden'?: boolean;
}) {
  return (
    <svg viewBox="..." className={className} aria-hidden={ariaHidden} ...>
      {/* Replace only this SVG markup with the commissioned version */}
    </svg>
  );
}
```

## Style Notes

- All use `currentColor` for fill/stroke, so Tailwind `text-*` utilities control color
- Monoline style with minimal detail (New Yorker spot-illustration aesthetic)
- 100×100 viewBox for consistent scaling
- No specific painting replicated; these are intentional placeholders
