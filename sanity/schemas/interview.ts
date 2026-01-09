import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publication',
      title: 'Publication/Source',
      type: 'string',
      description: 'e.g., "Artforum", "Frieze Magazine"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
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
      publication: 'publication',
      year: 'year',
    },
    prepare(selection) {
      const { title, publication, year } = selection;
      return {
        title: title || 'Untitled',
        subtitle: `${publication || 'No publication'} • ${year || 'No year'}`,
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
