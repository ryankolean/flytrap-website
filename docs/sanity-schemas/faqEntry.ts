// faqEntry.ts
// Feeds JSON-LD: FAQPage schema with Question/Answer pairs
// from docs/03-seo-aeo-strategy.md §Part 2 (natural-language Q&A, answer-first formatting)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqEntry',
  title: 'FAQ Entry',
  type: 'document',
  description: 'A single question-answer pair for the /faq page. Feeds FAQPage JSON-LD.',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
      description: 'Phrased in natural language, not keyword-stuffed. e.g., "Is The Fly Trap dog-friendly?" from docs/03-seo-aeo-strategy.md §Part 2.',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required().max(500),
      description: 'One to three sentences, written as a complete thought. Must be liftable directly by LLMs. from docs/03-seo-aeo-strategy.md §Part 2.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Visiting', value: 'visiting' },
          { title: 'Food', value: 'food' },
          { title: 'The Business', value: 'business' },
          { title: 'Ordering', value: 'ordering' },
        ],
      },
      description: 'Used to group Q&A into sections on the /faq page. from docs/03-seo-aeo-strategy.md §Part 2.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Sort position within the category. Use @sanity/orderable-document-list plugin to manage visually.',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
    },
    prepare({ title, category }) {
      return {
        title: title,
        subtitle: `Category: ${category}`,
      };
    },
  },
});
