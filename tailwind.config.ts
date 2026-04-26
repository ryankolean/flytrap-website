import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'flytrap-red': {
          deep: '#992F1E',
          bright: '#CC4433',
        },
        bar: {
          fog: '#797A7E',
        },
        corridor: {
          mustard: '#B9A651',
        },
        cream: {
          paper: '#F5EEDC',
        },
        checker: {
          black: '#1A1A1A',
        },
        text: {
          ink: '#1A1A1A',
          charcoal: '#4A4A4E',
          light: '#F5EEDC',
        },
        bg: {
          white: '#FFFFFF',
          'off-white': '#F5EEDC',
        },
        marble: {
          ruby: '#C00A1A',
          ultramarine: '#0A2A66',
          emerald: '#00664C',
          gold: '#D4A574',
          plum: '#6B4C7A',
          teal: '#00A39C',
          jade: '#2D9C7E',
          white: '#F5F5F5',
        },
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.15)',
        xl: '0 20px 25px rgba(0,0,0,0.2)',
      },
      fontSize: {
        h1: ['48px', { lineHeight: '1.2' }],
        h2: ['36px', { lineHeight: '1.3' }],
        h3: ['28px', { lineHeight: '1.4' }],
        h4: ['24px', { lineHeight: '1.4' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-base': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
      fontFamily: {
        sans: ['Inter', 'Figtree', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Recoleta', 'Georgia', 'serif'],
        script: ['Caveat', 'Reenie Beanie', 'cursive'],
      },
      transitionDuration: {
        'motion-fast': '150ms',
        'motion-base': '200ms',
        'motion-slow': '300ms',
      },
      transitionTimingFunction: {
        'timing-ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'timing-ease-in-out': 'cubic-bezier(0.4, 0, 0.4, 1)',
      },
      backgroundImage: {
        'marble-halftone': 'linear-gradient(135deg, rgba(200, 10, 26, 0.15), rgba(212, 165, 116, 0.15))',
      },
    },
  },
  plugins: [],
};

export default config;
