import { client } from './client';

export interface PressKitItem {
  _id: string;
  title: string;
  format: string;
  size: string;
  file: {
    _type: 'file';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  order: number;
}

/**
 * Fetch all press kit items sorted by order
 *
 * @returns Array of press kit items
 */
export async function getPressKitItems(): Promise<PressKitItem[]> {
  try {
    const query = `*[_type == "pressKit"] | order(order asc) {
      _id,
      title,
      format,
      size,
      file,
      order
    }`;

    const pressKitItems = await client.fetch<PressKitItem[]>(query);
    return pressKitItems || [];
  } catch (error) {
    console.error('[getPressKitItems] Error fetching press kit items:', error);
    return [];
  }
}
