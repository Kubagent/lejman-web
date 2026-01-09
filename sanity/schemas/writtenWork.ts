import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'writtenWork',
  title: 'Written Work',
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
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Essay', value: 'essay' },
          { title: 'Review', value: 'review' },
          { title: 'Interview', value: 'interview' },
          { title: 'Statement', value: 'statement' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'de', title: 'German', type: 'text' },
        { name: 'pl', title: 'Polish', type: 'text' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          validation: (Rule) => Rule.max(200),
        },
        {
          name: 'de',
          title: 'German',
          type: 'text',
          validation: (Rule) => Rule.max(200),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'text',
          validation: (Rule) => Rule.max(200),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author',
      date: 'publishedDate',
    },
    prepare(selection) {
      const { title, author, date } = selection;
      return {
        title: title,
        subtitle: `${author} - ${date ? new Date(date).getFullYear() : 'No date'}`,
      };
    },
  },
});
