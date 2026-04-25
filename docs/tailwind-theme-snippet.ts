// Fly Trap Design Tokens — Tailwind Theme Configuration
// Sampled from on-site capture (April 25, 2026)
// Source: docs/07-capture-audit-and-discoveries.md
// To use: Copy this object into `theme.extend` in tailwind.config.ts

export const flyTrapTheme = {
  colors: {
    // Primary brand reds
    // flytrap-red-deep: marble bar epoxy matrix (ACCENT only until dining-room wall sampled)
    // flytrap-red-bright: TBD dining-room wall color (return visit)
    'flytrap-red': {
      deep: '#992F1E',  // From bar marble epoxy; primary brand accent
      bright: '#CC4433', // Placeholder until dining-room wall is sampled (return visit TODO)
    },

    // Zone colors (three-zone model)
    // bar-fog: gray-lavender bar walls (calming, lets marble bar pop)
    // corridor-mustard: yellow restroom corridor walls (playful, energetic)
    'bar': {
      fog: '#797A7E', // Gray-lavender bar walls — section backgrounds, data-heavy pages
    },
    'corridor': {
      mustard: '#B9A651', // Yellow-mustard restroom walls — playful accents, secondary CTAs
    },

    // Neutrals & backgrounds
    'cream': {
      paper: '#F5EEDC', // Menu paper (placeholder; verify on-site visit)
    },
    'checker': {
      black: '#1A1A1A', // Menu border + restroom sign — text, structural framing
    },

    // Semantic text colors
    'text': {
      ink: '#1A1A1A',      // Primary body text, high-contrast
      charcoal: '#4A4A4E', // Secondary text, supporting copy
      light: '#F5EEDC',    // Text on dark backgrounds
    },

    // Semantic background colors
    'bg': {
      white: '#FFFFFF',    // Page backgrounds, card fills
      'off-white': '#F5EEDC', // Subtle fill, menu cards, section breaks
    },

    // Marble spectrum (jewel tones)
    // Decorative palette ONLY — never for solid fills. Used for spot illustrations,
    // hover states, small decorative touches. Values are placeholders pending
    // color calibration from marble bar close-up on return visit.
    // Reference: docs/07-capture-audit-and-discoveries.md line 59-132
    'marble': {
      ruby: '#C00A1A',        // TODO: sample from bar marble
      ultramarine: '#0A2A66', // TODO: sample from bar marble
      emerald: '#00664C',     // TODO: sample from bar marble
      gold: '#D4A574',        // TODO: sample from bar marble (butterscotch)
      plum: '#6B4C7A',        // TODO: sample from bar marble
      teal: '#00A39C',        // TODO: sample from bar marble
      jade: '#2D9C7E',        // TODO: sample from bar marble
      white: '#F5F5F5',       // White marble from bar
    },
  },

  spacing: {
    // 8px base grid (classic, predictable, harmonious)
    '1': '8px',   // Tight spacing: button padding, inline gaps
    '2': '16px',  // Standard padding: card padding, section margins
    '3': '24px',  // Medium margins: section breaks, stacked elements
    '4': '32px',  // Large margins: page section spacing
    '5': '40px',  // Hero spacing: margin between hero and next section
    '6': '48px',  // XL spacing: vertical rhythm between major sections
    '8': '64px',  // XXL spacing: full-viewport breathing room
  },

  borderRadius: {
    none: '0',
    sm: '4px',   // Small buttons, subtle rounding
    md: '8px',   // Card corners, input fields
    lg: '12px',  // Large interactive components
    full: '9999px', // Pills, circular elements (checkerboard patterns use radius-none)
  },

  boxShadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',       // Subtle depth on cards
    md: '0 4px 6px rgba(0,0,0,0.1)',        // Standard card elevation
    lg: '0 10px 15px rgba(0,0,0,0.15)',     // Modal/overlay depth
    xl: '0 20px 25px rgba(0,0,0,0.2)',      // High-impact hero depth
  },

  fontSize: {
    // Type scale (desktop baseline; mobile reduces ~15–20% at breakpoint)
    'h1': ['48px', { lineHeight: '1.2' }],      // Page hero headlines
    'h2': ['36px', { lineHeight: '1.3' }],      // Section headings
    'h3': ['28px', { lineHeight: '1.4' }],      // Subsection headings
    'h4': ['24px', { lineHeight: '1.4' }],      // Card titles
    'body-lg': ['18px', { lineHeight: '1.6' }], // Large body copy (intro)
    'body-base': ['16px', { lineHeight: '1.6' }], // Regular body copy (default)
    'body-sm': ['14px', { lineHeight: '1.5' }], // Supporting text, metadata
    'caption': ['12px', { lineHeight: '1.4' }], // Labels, timestamps
  },

  fontFamily: {
    // Three font-pairing options (Phase 1 prototype to select one)
    // Option A — Warm Editorial (default candidate)
    // display: Fraunces (expressive serif, wide weight range)
    // body: Figtree (warm humanist sans)
    // accent: Reenie Beanie (hand-drawn, for stickers/badges)
    //
    // Option B — Confident Slab
    // display: Recoleta (slab-ish serif with personality)
    // body: Inter (neutral, very legible)
    // accent: Caveat (handwriting)
    //
    // Option C — Signpainter
    // display: Bagnard or Pilcrow (eccentric display serif)
    // body: Söhne (premium neutral sans)
    // accent: custom lettering for "Buzzin' Since 2004" lockup
    //
    // TODO: finalize selection in Phase 1 type-pairing prototype
    'sans': ['Inter', 'Figtree', 'system-ui', 'sans-serif'],
    'serif': ['Fraunces', 'Recoleta', 'Georgia', 'serif'],
    'script': ['Caveat', 'Reenie Beanie', 'cursive'],
  },

  transitionDuration: {
    'motion-fast': '150ms',  // Quick feedback (button press, input focus)
    'motion-base': '200ms',  // Standard transitions (hover, fade-in)
    'motion-slow': '300ms',  // Dramatic reveals (scroll-triggered)
  },

  transitionTimingFunction: {
    'timing-ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'timing-ease-in-out': 'cubic-bezier(0.4, 0, 0.4, 1)',
  },

  // Plugin: custom gradient utilities for marble-halftone effects
  // (reference: design doc §6, Photography Direction)
  backgroundImage: {
    'marble-halftone': 'linear-gradient(135deg, rgba(200, 10, 26, 0.15), rgba(212, 165, 116, 0.15))',
  },
};

/**
 * Integration instructions:
 *
 * In tailwind.config.ts, import and extend:
 *
 *   import { flyTrapTheme } from './docs/tailwind-theme-snippet';
 *
 *   export default {
 *     theme: {
 *       extend: flyTrapTheme,
 *     },
 *     // ... rest of config
 *   }
 *
 * Then use in templates as:
 *
 *   <div className="bg-bar-fog text-text-ink">
 *   <button className="bg-flytrap-red-deep text-white">Order Now</button>
 *   <section className="bg-corridor-mustard">Welcome</section>
 *   <span className="text-marble-gold">Accent detail</span>
 *
 * CSS variable equivalents are in tokens-css-vars.css for use outside Tailwind.
 *
 * @see docs/design-tokens.md for full token reference and three-zone color model explanation
 * @see docs/07-capture-audit-and-discoveries.md for sampled color values and source photos
 * @see docs/01-design-document-v1.7.md §6 (Visual System) for design rationale
 */
