import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

import { schemaTypes } from './src/sanity/schemas';
import { customStructure } from './src/sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'The Fly Trap',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: customStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
});
