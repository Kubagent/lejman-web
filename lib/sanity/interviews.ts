import { client } from './client';

export interface Interview {
  _id: string;
  title: string;
  publication: string;
  year: number;
  url?: string;
  pdfFile?: { asset?: { url: string } };
  videoFile?: { asset?: { url: string } };
  order: number;
}

/**
 * Fetch all interviews sorted by order and year
 *
 * @returns Array of interviews
 */
export async function getInterviews(): Promise<Interview[]> {
  try {
    const query = `*[_type == "interview"] | order(order asc, year desc) {
      _id,
      title,
      publication,
      year,
      url,
      pdfFile { asset->{ url } },
      videoFile { asset->{ url } },
      order
    }`;

    const interviews = await client.fetch<Interview[]>(query);
    return interviews || [];
  } catch (error) {
    console.error('[getInterviews] Error fetching interviews:', error);
    return [];
  }
}
