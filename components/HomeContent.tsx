'use client';

import River from '@/components/River';

interface HomeContentProps {
  riverVideos: any[];
  locale?: 'en' | 'de' | 'pl';
}

/**
 * HomeContent - Client wrapper for homepage river
 *
 * The first river video (order: 1) is used as the intro video (handled by IntroOverlay in layout).
 * The intro video is excluded from the river to avoid duplication.
 */
export default function HomeContent({ riverVideos, locale = 'en' }: HomeContentProps) {
  // Sort videos by order
  const sortedVideos = [...riverVideos].sort((a, b) => a.order - b.order);

  // Remaining videos are for the river (excluding the intro video)
  const riverOnlyVideos = sortedVideos.slice(1);

  if (riverVideos.length === 0) {
    return (
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
    );
  }

  return <River videos={riverOnlyVideos} locale={locale} />;
}
