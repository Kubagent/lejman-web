import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pressKit',
  title: 'Press Kit Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          { title: 'PDF', value: 'PDF' },
          { title: 'ZIP', value: 'ZIP' },
          { title: 'DOC', value: 'DOC' },
          { title: 'JPEG', value: 'JPEG' },
          { title: 'PNG', value: 'PNG' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'File Size',
      type: 'string',
      description: 'e.g., "245 KB" or "156 MB"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      format: 'format',
      size: 'size',
    },
    prepare(selection) {
      const { title, format, size } = selection;
      return {
        title: title || 'Untitled',
        subtitle: `${format || 'No format'} • ${size || 'No size'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
