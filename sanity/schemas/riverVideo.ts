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
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).integer(),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      description: 'Upload video file. Mux will automatically optimize it for streaming with adaptive quality.',
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
    defineField({
      name: 'linkedArtwork',
      title: 'Linked Artwork/Project',
      type: 'reference',
      to: [{ type: 'artwork' }, { type: 'project' }],
      description: 'Optional: Link this video to an artwork or project page.',
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
