import HomeContent from '@/components/HomeContent';
import { getRiverVideos } from '@/lib/sanity/riverVideos';

/**
 * Home Page - Features the River video component with intro overlay
 *
 * This page fetches river videos from Sanity CMS and displays them
 * in a vertical river layout. On first visit of a session, an intro
 * overlay shows the first video full-screen before revealing the river.
 *
 * Data fetching uses Next.js App Router server components for optimal performance.
 */
export default async function Home() {
  // Fetch river videos from Sanity CMS
  const riverVideos = await getRiverVideos();

  return <HomeContent riverVideos={riverVideos} locale="en" />;
}
