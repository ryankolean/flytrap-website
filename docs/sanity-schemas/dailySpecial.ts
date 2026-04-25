// dailySpecial.ts
// Represents a daily special or "Today's Buzzing" entry
// from docs/01-design-document-v1.7.md §9 Section 2 (Today's Buzzing block, live daily specials)
// from docs/04-instagram-integration-spec.md (mock data shape, #flytrapspecial hashtag fallback)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'dailySpecial',
  title: 'Daily Special',
  type: 'document',
  description: 'A special dish or drink for the day. In Phase A, staff can manually add specials; Phase B pulls from Instagram #flytrapspecial tag.',
  fields: [
    defineField({
      name: 'title',
      title: 'Special Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'e.g., "Smoked Salmon Benedict" or "Oat-Milk Latte of the Week".',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.max(300),
      description: 'What is it? What\'s in it? Why should they order it? Keep it punchy.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Plate or product photo. Overhead, natural light.',
    }),
    defineField({
      name: 'activeDate',
      title: 'Date Active',
      type: 'date',
      validation: (Rule) => Rule.required(),
      description: 'When this special was offered. Used for chronological display and archiving.',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Cost if different from the regular menu item. Optional.',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Manual Entry (CMS)', value: 'manual' },
          { title: 'Instagram Feed', value: 'instagram' },
        ],
      },
      description: 'Whether this was entered manually or pulled from Instagram. Read-only after creation.',
    }),
    defineField({
      name: 'instagramPostUrl',
      title: 'Instagram Post Link',
      type: 'url',
      description: 'If sourced from Instagram, link to the original post. from docs/04-instagram-integration-spec.md.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'activeDate',
    },
    prepare({ title, date }) {
      return {
        title: title,
        subtitle: date,
      };
    },
  },
});
