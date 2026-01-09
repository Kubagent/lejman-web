import { client } from './client';
import { SanityFileAsset } from '../types';

export interface Publication {
  _id: string;
  title: string;
  year: number;
  format: string;
  size: string;
  file: SanityFileAsset;
  order: number;
}

/**
 * Fetch all publications sorted by order and year
 *
 * @returns Array of publications
 */
export async function getPublications(): Promise<Publication[]> {
  try {
    const query = `*[_type == "publication"] | order(order asc, year desc) {
      _id,
      title,
      year,
      format,
      size,
      file,
      order
    }`;

    const publications = await client.fetch<Publication[]>(query);
    return publications || [];
  } catch (error) {
    console.error('[getPublications] Error fetching publications:', error);
    return [];
  }
}
