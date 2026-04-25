// index.ts
// Sanity Studio v3 schemaTypes export
// Central barrel export for all content types

import menuItem from './menuItem';
import menuSection from './menuSection';
import pressEntry from './pressEntry';
import faqEntry from './faqEntry';
import dailySpecial from './dailySpecial';
import flyPainting from './flyPainting';
import intentCaptureSubmission from './intentCaptureSubmission';
import siteSettings from './siteSettings';

export const schemaTypes = [
  // Singleton
  siteSettings,

  // Menu system
  menuSection,
  menuItem,

  // Press & media
  pressEntry,

  // Content & SEO
  faqEntry,
  dailySpecial,

  // Gallery
  flyPainting,

  // Form captures
  intentCaptureSubmission,
];
