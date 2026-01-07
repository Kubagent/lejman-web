import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions (cm)',
      type: 'object',
      fields: [
        { name: 'width', title: 'Width', type: 'number' },
        { name: 'height', title: 'Height', type: 'number' },
        { name: 'depth', title: 'Depth (optional)', type: 'number' },
      ],
      description: 'Standard dimensions for regular artworks',
    }),
    defineField({
      name: 'customDimensions',
      title: 'Custom Dimensions (for irregular formats)',
      type: 'array',
      description: 'Use this for artworks with non-standard measurements (e.g., 150cm left vertical x 120cm horizontal x 170cm right vertical)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Measurement (cm)',
              type: 'number',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              placeholder: 'e.g., left vertical, horizontal, right vertical',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              value: 'value',
              label: 'label',
            },
            prepare({ value, label }) {
              return {
                title: `${value}cm (${label})`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image (Grid Thumbnail)',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: 'Primary image shown in the grid view',
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Gallery images shown on the artwork detail page',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Artwork',
      type: 'boolean',
      description: 'Display this artwork prominently on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
        { name: 'pl', title: 'Polish', type: 'text' },
      ],
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      year: 'year',
      medium: 'medium.en',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, year, medium, media } = selection;
      return {
        title: title || 'Untitled',
        subtitle: `${year || 'No year'} · ${medium || 'No medium'}`,
        media: media,
      };
    },
  },
});
