import { client } from './client';
import { SanityFileAsset } from '../types';

export interface DownloadablePublication {
  _id: string;
  title: string;
  year: number;
  format: string;
  size: string;
  file: SanityFileAsset;
  order: number;
}

/**
 * Fetch all downloadable publications sorted by order and year
 *
 * @returns Array of downloadable publications
 */
export async function getDownloadablePublications(): Promise<DownloadablePublication[]> {
  try {
    const query = `*[_type == "downloadablePublication"] | order(order asc, year desc) {
      _id,
      title,
      year,
      format,
      size,
      file,
      order
    }`;

    const publications = await client.fetch<DownloadablePublication[]>(query);
    return publications || [];
  } catch (error) {
    console.error('[getDownloadablePublications] Error fetching publications:', error);
    return [];
  }
}
