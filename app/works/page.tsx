import { getArtworks, getArtworkYears, getArtworkMediums } from '@/lib/sanity/artworks';
import WorksClient from './WorksClient';

/**
 * Works Page - Main archive/gallery page
 *
 * Features:
 * - Responsive artwork grid (4/3/1 columns)
 * - Grid/List view toggle
 * - Year and medium filtering
 * - Real-time title search
 * - Client-side filtering for instant results
 *
 * Performance:
 * - Server component for initial data fetch
 * - Client component for interactivity
 * - Real Sanity data from CMS
 * - Efficient filtering with Array methods
 */
export default async function WorksPage() {
  // Fetch all data from Sanity
  const artworks = await getArtworks();
  const years = await getArtworkYears();
  const mediums = await getArtworkMediums();

  return <WorksClient artworks={artworks} years={years} mediums={mediums} />;
}
