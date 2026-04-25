// menuSection.ts
// Feeds JSON-LD: Menu → MenuSection (each category grouping)
// from docs/01-design-document-v1.7.md §3 (five menu sections: All Things Eggs, Oh Sugar Shack, Green Things, Between Bread, Other Stuff)
// from docs/03-seo-aeo-strategy.md §Part 1 (MenuSection schema)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'menuSection',
  title: 'Menu Section',
  type: 'document',
  description: 'A category grouping on the menu (e.g., "All Things Eggs"). Feeds MenuSection JSON-LD.',
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "All Things Eggs", "Oh Sugar Shack", "Green Things", "Between Bread", "Other Stuff". from docs/01-design-document-v1.7.md §3.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'name' },
      description: 'Auto-generated; used for deep-linking menu categories on /menu page.',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'string',
      validation: (Rule) => Rule.max(200),
      description: 'Brief descriptor (optional). e.g., "Build-your-own egg scrambles."',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      validation: (Rule) => Rule.required(),
      description: 'Sort position on the menu. Use @sanity/orderable-document-list plugin to manage visually.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      order: 'orderRank',
    },
    prepare({ title, order }) {
      return {
        title: `${title}`,
        subtitle: `Position: ${order}`,
      };
    },
  },
});
