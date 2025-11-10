import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'riverVideo',
  title: 'River Video',
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
      name: 'order',
      title: 'Display Order (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Upload MP4/MOV video file (1080p, 45-90s, <5GB). Mux integration coming soon.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Thumbnail shown before video plays',
      validation: (Rule) => Rule.required(),
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
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.min(1900).max(new Date().getFullYear() + 1),
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      order: 'order',
      media: 'posterImage',
    },
    prepare(selection) {
      const { title, order, media } = selection;
      return {
        title: `${order}. ${title}`,
        subtitle: `Order: ${order}`,
        media: media,
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
