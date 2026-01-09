import { client } from './client';

export interface Link {
  _id: string;
  title: string;
  url: string;
  description: string;
  order: number;
}

/**
 * Fetch all links sorted by order
 *
 * @returns Array of links
 */
export async function getLinks(): Promise<Link[]> {
  try {
    const query = `*[_type == "link"] | order(order asc) {
      _id,
      title,
      url,
      description,
      order
    }`;

    const links = await client.fetch<Link[]>(query);
    return links || [];
  } catch (error) {
    console.error('[getLinks] Error fetching links:', error);
    return [];
  }
}
