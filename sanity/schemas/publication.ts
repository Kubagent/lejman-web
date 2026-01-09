import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  description: 'Downloadable publications like books, catalogs, and PDFs available in the About section',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          { title: 'PDF', value: 'PDF' },
          { title: 'EPUB', value: 'EPUB' },
          { title: 'DOC', value: 'DOC' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'File Size',
      type: 'string',
      description: 'e.g., "12.5 MB"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.epub,.doc,.docx',
      },
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
      year: 'year',
      format: 'format',
    },
    prepare(selection) {
      const { title, year, format } = selection;
      return {
        title: title || 'Untitled',
        subtitle: `${year || 'No year'} • ${format || 'No format'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
});
