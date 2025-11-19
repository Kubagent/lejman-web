import Layout from '@/components/Layout';
import River from '@/components/River';
import { getRiverVideos } from '@/lib/sanity/riverVideos';
import { mockRiverVideos } from '@/lib/mockData';

/**
 * Home Page - Features the River video component
 *
 * This page fetches river videos from Sanity CMS and displays them
 * in a vertical river layout.
 *
 * Data fetching uses Next.js App Router server components for optimal performance.
 *
 * DEVELOPMENT MODE: Currently using mock data for preview.
 * Switch to real Sanity data once CMS is populated.
 */
export default async function Home() {
  // Fetch river videos from Sanity CMS
  let riverVideos = await getRiverVideos();

  // DEVELOPMENT MODE: Use mock data if no Sanity content available
  if (!riverVideos || riverVideos.length === 0) {
    riverVideos = mockRiverVideos;
  }

  return (
    <Layout>
      {/* River Video Section */}
      {riverVideos.length > 0 ? (
        <River videos={riverVideos} locale="en" />
      ) : (
        /* Fallback content when no videos are available */
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-48">
            <h1 className="font-heading text-4xl md:text-6xl font-semibold text-black mb-6">
              River
            </h1>
            <p className="font-body text-base md:text-lg text-dark-gray max-w-2xl">
              The River module will feature 5 auto-playing videos in a continuous vertical scroll.
              This space showcases motion-based work in a contemplative digital environment.
            </p>
            <p className="font-body text-sm text-mid-gray mt-12">
              Add videos in Sanity CMS to see them displayed here.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
