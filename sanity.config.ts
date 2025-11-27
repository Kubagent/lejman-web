import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { muxInput } from 'sanity-plugin-mux-input';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Lejman Web',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool(),
    muxInput()
  ],

  schema: {
    types: schemaTypes,
  },
});
