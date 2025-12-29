import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      initialValue: 'Dominik L.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'galleryEmail',
      title: 'Gallery Email (Optional)',
      type: 'string',
      description: 'If provided, contact form will CC this email',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'galleryName',
      title: 'Gallery Name',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string', initialValue: 'Molski Gallery' },
        { name: 'de', title: 'German', type: 'string', initialValue: 'Molski Gallery' },
        { name: 'pl', title: 'Polish', type: 'string', initialValue: 'Galeria Molski' },
      ],
    }),
    defineField({
      name: 'galleryUrl',
      title: 'Gallery Website URL',
      type: 'url',
      initialValue: 'https://molskigallery.com',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
        { name: 'pl', title: 'Polish', type: 'text' },
      ],
    }),
    defineField({
      name: 'biographyImage',
      title: 'Biography Portrait Image',
      type: 'image',
      description: 'Portrait image for the biography section',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          validation: (Rule) => Rule.max(160),
          initialValue: 'Professional digital portfolio for visual artist Dominik L., showcasing painting, digital media, and motion-based work.'
        },
        {
          name: 'de',
          title: 'German',
          type: 'text',
          validation: (Rule) => Rule.max(160)
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'text',
          validation: (Rule) => Rule.max(160)
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
});
