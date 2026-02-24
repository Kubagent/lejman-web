import { client } from './client';

export interface WrittenWork {
  _id: string;
  title: {
    en?: string;
    de?: string;
    pl?: string;
  };
  slug: {
    current: string;
  };
  author?: string;
  publishedDate?: string;
  category?: string;
  excerpt?: {
    en?: string;
    de?: string;
    pl?: string;
  };
}

/**
 * Fetch all written works sorted by published date
 *
 * @returns Array of written works
 */
export async function getWrittenWorks(): Promise<WrittenWork[]> {
  try {
    const query = `*[_type == "writtenWork"] | order(publishedDate desc) {
      _id,
      title,
      slug,
      "author": { "en": author, "de": author, "pl": author },
      "year": publishedDate[0..3],
      publishedDate,
      category,
      type,
      "fileUrl": file.asset->url,
      "description": excerpt
    }`;

    const writtenWorks = await client.fetch<WrittenWork[]>(query);
    return writtenWorks || [];
  } catch (error) {
    console.error('[getWrittenWorks] Error fetching written works:', error);
    return [];
  }
}
