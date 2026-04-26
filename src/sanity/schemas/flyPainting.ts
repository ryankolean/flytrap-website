// flyPainting.ts
// Individual fly artwork piece from the restaurant collection
// from docs/01-design-document-v1.7.md §1 (brand thesis: humanizing a fly, 17-item catalog)
// from docs/01-design-document-v1.7.md §9 Section 4 (The Room: five pieces for hero rotation, rest in catalog)
// from docs/01-design-document-v1.7.md §12 (Asset inventory: 17 pieces captured 2026-04-25)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'flyPainting',
  title: 'Fly Painting',
  type: 'document',
  description: 'A piece from the restaurant\'s fly-art collection. 17 total pieces catalogued. Five pinned for home-page hero rotation.',
  fields: [
    defineField({
      name: 'title',
      title: 'Painting Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'e.g., "Fly Art Class", "Fly Fly-Fishing", "Flies on a Dinner Date". from docs/01-design-document-v1.7.md §9 Section 4.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'title' },
      description: 'Auto-generated; used for deep-linking in the gallery.',
    }),
    defineField({
      name: 'description',
      title: 'Caption / Context',
      type: 'text',
      validation: (Rule) => Rule.max(300),
      description: 'A short caption or story about the piece. What is the fly doing? Why is it funny or meaningful?',
    }),
    defineField({
      name: 'image',
      title: 'Photograph of Painting',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: { hotspot: false },
      description: 'Straight-on, uncropped photo of the painting. Clean, no reflections if possible. from docs/01-design-document-v1.7.md §12.',
    }),
    defineField({
      name: 'inHeroRotation',
      title: 'Include in Home-Page Hero Rotation',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
      description: 'Only FIVE paintings eligible: Fly Art Class, Fly Fly-Fishing, Flies on a Dinner Date, Flies Kissing on a Hilltop, The Eye Doctor. Bathroom-context pieces (Fly on the Toilet, Bathroom Line, Flies at Urinals) are catalog-only. from docs/01-design-document-v1.7.md §9 Section 4 & CLAUDE.md constraint #7.',
    }),
    defineField({
      name: 'catalogOnly',
      title: 'Catalog/Gallery Only',
      type: 'boolean',
      description: 'Set true if this piece should never appear in the hero rotation (e.g., bathroom-context pieces). from docs/01-design-document-v1.7.md §9 Section 4.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank (Gallery)',
      type: 'number',
      description: 'Sort position in the full fly-art catalog / About-page secondary grid.',
    }),
    defineField({
      name: 'capturedDate',
      title: 'Capture Date',
      type: 'date',
      description: 'When the photo was taken. All pieces captured 2026-04-25. from docs/01-design-document-v1.7.md §12.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      inHero: 'inHeroRotation',
      catalogOnly: 'catalogOnly',
    },
    prepare({ title, inHero, catalogOnly }) {
      const tags = [];
      if (inHero) tags.push('[HERO]');
      if (catalogOnly) tags.push('[CATALOG ONLY]');
      return {
        title: `${tags.join(' ')} ${title}`.trim(),
        subtitle: inHero ? 'Home-page rotation eligible' : 'Catalog only',
      };
    },
  },
});
