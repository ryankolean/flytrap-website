// pressEntry.ts
// Feeds JSON-LD: NewsArticle or Review schema (each press mention)
// from docs/02-press-page-spec.md (press inventory, pull-quote bank)
// from docs/03-seo-aeo-strategy.md §Part 1 (NewsArticle / Review schema)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pressEntry',
  title: 'Press Entry',
  type: 'document',
  description: 'A single press mention or review of The Fly Trap. Feeds NewsArticle or Review JSON-LD.',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline / Angle',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
      description: 'Short headline or angle of the coverage. e.g., "The return story — McMillians take back ownership".',
    }),
    defineField({
      name: 'outlet',
      title: 'Publication Outlet',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Crain\'s Detroit Business", "Food Network", "Detroit Free Press". from docs/02-press-page-spec.md.',
    }),
    defineField({
      name: 'outletLogo',
      title: 'Outlet Logo',
      type: 'image',
      options: { hotspot: false },
      description: 'Grayscale logo, ~40px tall. Used in the press-page timeline card.',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
      description: 'Publication date. Used for chronological ordering (newest-first). from docs/02-press-page-spec.md.',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'string',
      validation: (Rule) => Rule.max(100),
      description: 'A short quote (max 15 words). Must be attributable and linkable to source. from docs/02-press-page-spec.md.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Link to Full Article',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
      description: 'Full URL to the published article. Opens in a new tab with rel="noopener".',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'National / Flagship', value: 'national' },
          { title: 'Detroit & Metro', value: 'regional' },
          { title: 'Local (Ferndale/Oakland)', value: 'local' },
          { title: 'Food & Lifestyle Blogs', value: 'blog' },
        ],
      },
      description: 'Used for filter chips on the press page. from docs/02-press-page-spec.md.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured / Hero',
      type: 'boolean',
      description: 'Set true for the Food Network / DDD feature. Only one should be marked. from docs/02-press-page-spec.md.',
    }),
    defineField({
      name: 'isTvFeature',
      title: 'TV / Video Feature',
      type: 'boolean',
      description: 'Set true if this is a TV segment or video feature. Adds a "TV" badge on the press page.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Byline if applicable. e.g., "Jay Davis", "Susan Selasky". Optional.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Manual Order (if pinning)',
      type: 'number',
      description: 'Override chronological order for pinning specific entries. Leave empty for date-sort.',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      outlet: 'outlet',
      date: 'publishDate',
      featured: 'isFeatured',
    },
    prepare({ title, outlet, date, featured }) {
      return {
        title: `${featured ? '[HERO] ' : ''}${title}`,
        subtitle: `${outlet} • ${date}`,
      };
    },
  },
});
