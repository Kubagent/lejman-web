import { client } from './client';
import { riverVideosQuery } from './queries';
import { RiverVideo } from '../types';

/**
 * Fetch all river videos from Sanity CMS
 * Videos are automatically sorted by order (1-5) via the query
 *
 * Usage:
 * const videos = await getRiverVideos();
 */
export async function getRiverVideos(): Promise<RiverVideo[]> {
  try {
    const videos = await client.fetch<RiverVideo[]>(riverVideosQuery);
    return videos || [];
  } catch (error) {
    console.error('Error fetching river videos:', error);
    return [];
  }
}

/**
 * Fetch a single river video by ID
 *
 * Usage:
 * const video = await getRiverVideoById('video-id');
 */
export async function getRiverVideoById(id: string): Promise<RiverVideo | null> {
  try {
    const video = await client.fetch<RiverVideo>(
      `*[_type == "riverVideo" && _id == $id][0]`,
      { id }
    );
    return video || null;
  } catch (error) {
    console.error('Error fetching river video:', error);
    return null;
  }
}
