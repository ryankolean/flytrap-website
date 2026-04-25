// menuItem.ts
// Feeds JSON-LD: Menu → MenuItem (each dish in a menu section)
// from docs/01-design-document-v1.7.md §3 (menu categories, dish names, descriptions)
// from docs/03-seo-aeo-strategy.md §Part 1 (MenuItem schema with suitableForDiet)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  description: 'A single dish on the menu (e.g., Gingerbread Waffles, The Forager). Feeds MenuItem JSON-LD.',
  fields: [
    defineField({
      name: 'name',
      title: 'Dish Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Gingerbread Waffles", "The Forager". Must match menu copy exactly.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'name' },
      description: 'Auto-generated; used for deep-linking menu items.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.max(200),
      description: 'One sentence of what\'s in it, then one sentence of why it\'s good. Total max 200 chars. from docs/01-design-document-v1.7.md §7.',
    }),
    defineField({
      name: 'ingredients',
      title: 'Key Ingredients / Components',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of main components (e.g., "Poblano Pesto", "Jack Cheese", "Seared City Ham"). Used for allergen + dietary filters.',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Price in dollars. e.g., 12.95',
    }),
    defineField({
      name: 'image',
      title: 'Plate Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Overhead plate shot, natural daylight, no heavy styling. from docs/01-design-document-v1.7.md §6.',
    }),
    defineField({
      name: 'sectionRef',
      title: 'Menu Section',
      type: 'reference',
      to: [{ type: 'menuSection' }],
      validation: (Rule) => Rule.required(),
      description: 'Which menu section this belongs to (e.g., "All Things Eggs", "Oh Sugar Shack"). from docs/01-design-document-v1.7.md §3.',
    }),
    defineField({
      name: 'suitableForDiet',
      title: 'Suitable For Diet(s)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegetarian', value: 'vegetarian' },
          { title: 'Vegan', value: 'vegan' },
          { title: 'Gluten-Free', value: 'glutenFree' },
          { title: 'Dairy-Free', value: 'dairyFree' },
          { title: 'Nut-Free', value: 'nutFree' },
        ],
      },
      description: 'Dietary labels. Feeds JSON-LD MenuItem.suitableForDiet. from docs/03-seo-aeo-strategy.md §Part 1.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Sort position within the section. Use @sanity/orderable-document-list plugin to manage visually.',
    }),
    defineField({
      name: 'isSignatureDish',
      title: 'Signature Dish',
      type: 'boolean',
      description: 'Flag for dishes highlighted on home page. from docs/01-design-document-v1.7.md §2 (Gingerbread Waffles, The Forager, Lemongrass Pho Bowl, Red Chili Salmon Burger, Thai Peanut Chicken, Green Eggs and Ham, Veggie Rumble, Cowboy Curtis, Red Flannel Hash).',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      section: 'sectionRef.name',
      price: 'price',
    },
    prepare({ title, section, price }) {
      return {
        title: `${title} (${section})`,
        subtitle: `$${price}`,
      };
    },
  },
});
