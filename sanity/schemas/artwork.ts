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
      title: 'Year (Start)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'yearEnd',
      title: 'Year End (if multi-year work)',
      type: 'number',
      description: 'Leave blank for single-year works. Fill in for works spanning multiple years, e.g. 2022 for a work created 2018–2022.',
      validation: (Rule) =>
        Rule.custom((yearEnd, context) => {
          if (yearEnd === undefined || yearEnd === null) return true;
          const year = (context.document as { year?: number })?.year;
          if (year && yearEnd <= year) return 'Year End must be greater than Year (Start)';
          if (yearEnd > new Date().getFullYear() + 1) return 'Year End seems too far in the future';
          return true;
        }),
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
      type: 'string',
      description: 'Free-text dimensions for non-standard measurements, e.g. "150 × 120 × 170 cm (left vertical × horizontal × right vertical)"',
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
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Videos of the artwork (displayed in the same gallery as images)',
      of: [
        {
          type: 'mux.video',
          title: 'Video (Mux)',
        },
        {
          type: 'file',
          title: 'Video File',
          options: {
            accept: 'video/*'
          }
        }
      ],
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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Optional. Lower numbers appear first. Leave blank to sort automatically by year.',
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
      yearEnd: 'yearEnd',
      medium: 'medium.en',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, year, yearEnd, medium, media } = selection;
      const yearDisplay = year ? (yearEnd ? `${year}–${yearEnd}` : String(year)) : 'No year';
      return {
        title: title || 'Untitled',
        subtitle: `${yearDisplay} · ${medium || 'No medium'}`,
        media: media,
      };
    },
  },
});
