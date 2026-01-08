import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
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
      name: 'venue',
      title: 'Venue',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location (City, Country)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty for ongoing projects',
      readOnly: ({ document }) => document?.isOngoing === true,
      validation: (Rule) => Rule.custom((endDate, context) => {
        const { document } = context as { document: any };

        // If ongoing, endDate should be empty
        if (document?.isOngoing && endDate) {
          return 'End date must be empty for ongoing projects';
        }

        // If not ongoing and both dates exist, validate date order
        if (!document?.isOngoing && document?.startDate && endDate) {
          const start = new Date(document.startDate);
          const end = new Date(endDate);
          if (end < start) {
            return 'End date must be after start date';
          }
        }

        return true;
      }),
    }),
    defineField({
      name: 'isOngoing',
      title: 'Ongoing Project',
      type: 'boolean',
      description: 'Check this if the project is currently ongoing (has no end date yet)',
      initialValue: false,
    }),
    defineField({
      name: 'type',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo', value: 'solo' },
          { title: 'Group', value: 'group' },
          { title: 'Institutional', value: 'institutional' },
        ],
        layout: 'radio',
      },
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
      name: 'images',
      title: 'Photos',
      type: 'array',
      description: 'First photo will be used as the project thumbnail',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Videos of the project',
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
      name: 'artworks',
      title: 'Artworks Shown',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artwork' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      venue: 'venue.en',
      date: 'startDate',
      media: 'images.0',
      isOngoing: 'isOngoing',
    },
    prepare(selection) {
      const { title, venue, date, media, isOngoing } = selection;
      const dateLabel = isOngoing
        ? `${date ? new Date(date).getFullYear() : 'No date'} - Present`
        : date ? new Date(date).getFullYear() : 'No date';
      return {
        title: title,
        subtitle: `${venue} - ${dateLabel}`,
        media: media,
      };
    },
  },
});
