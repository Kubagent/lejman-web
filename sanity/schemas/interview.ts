import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  validation: (Rule) =>
    Rule.custom((doc: any) => {
      if (!doc?.url && !doc?.pdfFile?.asset && !doc?.videoFile?.asset) {
        return 'Please provide at least one of: URL, PDF file, or video file';
      }
      return true;
    }),
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
      title: 'URL (link to external source)',
      type: 'url',
      description: 'Link to the interview online (e.g. magazine website)',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload a PDF of the interview',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File (MP4)',
      type: 'file',
      description: 'Upload an MP4 video of the interview',
      options: { accept: 'video/mp4,video/*' },
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
