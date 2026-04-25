// siteSettings.ts
// Singleton document for global site configuration
// from docs/01-design-document-v1.7.md §2 (address, phone, hours, taglines)
// from docs/03-seo-aeo-strategy.md §Part 1 (restaurant schema metadata)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Singleton configuration for the entire website. One document only. Edit to update global metadata, hours, contact info.',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "The Fly Trap". Used in meta tags and schemas.',
    }),
    defineField({
      name: 'taglinePrimary',
      title: 'Primary Tagline',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '"a finer diner" — the main brand hook. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'taglineSecondary',
      title: 'Secondary Tagline',
      type: 'string',
      description: '"Under Old Management" — shown on hero and receipts. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'taglineTertiary',
      title: 'Tertiary Tagline',
      type: 'string',
      description: '"Catch a Buzz" — on the bar/drinks menu. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'originHandle',
      title: 'Origin Handle',
      type: 'string',
      description: '"Buzzin\' since 2004" — year founded. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '22950 Woodward Ave, Ferndale, MI 48220. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '(248) 399-5150. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email(),
      description: 'dine@theflytrapferndale.com. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'hoursMonFri',
      title: 'Hours: Monday–Friday',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "8am–3pm". from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'hoursSatSun',
      title: 'Hours: Saturday–Sunday',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "8am–3pm". from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'closedDates',
      title: 'Closed Dates / Holidays',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'date', title: 'Date' },
            { name: 'reason', type: 'string', title: 'Reason' },
          ],
        },
      ],
      description: 'Special closures, holidays, etc.',
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      description: '42.4503 (for geo schema). from docs/03-seo-aeo-strategy.md §Part 1.',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      description: '-83.1449 (for geo schema). from docs/03-seo-aeo-strategy.md §Part 1.',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: '@theflytrapferndale. from docs/01-design-document-v1.7.md §7.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full URL to the Instagram profile.',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      description: 'Full URL to the Facebook page.',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Founded Year',
      type: 'number',
      description: '2004. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'currentOwners',
      title: 'Current Owners',
      type: 'string',
      description: 'Kara & Gavin McMillian. from docs/01-design-document-v1.7.md §2.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
      description: 'Used in <meta name="description"> and Open Graph. Max 160 chars. from docs/03-seo-aeo-strategy.md §Part 1.',
    }),
  ],
});
