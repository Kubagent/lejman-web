'use client';

import { RiverProps } from '@/lib/types';
import RiverVideoSlot from './RiverVideoSlot';
import { RiverErrorBoundary } from './RiverErrorBoundary';

/**
 * River - Main container component for the video river layout
 *
 * Displays 5 video slots in a vertical river layout on the homepage.
 * Each video slot takes up full viewport width and maintains 16:9 aspect ratio.
 *
 * Features:
 * - Responsive vertical stack layout
 * - Full-width video slots
 * - Maintains consistent 16:9 aspect ratio
 * - High-performance scroll-triggered video playback
 * - Intersection Observer-based lazy loading
 * - Handles missing videos gracefully
 *
 * Performance Optimizations:
 * - Each video slot manages its own Intersection Observer
 * - Videos preload when within 100px of viewport
 * - Automatic play/pause based on scroll position
 * - Respects user's reduced motion preference
 *
 * Future enhancements (handled by other agents):
 * - Smooth scroll navigation (accessibility specialist)
 * - Loading states and skeleton screens
 *
 * Usage:
 * <River videos={riverVideos} locale="en" />
 */
export default function River({ videos, locale = 'en' }: RiverProps) {
  // Sort videos by order property to ensure correct sequence
  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

  // Handle empty state
  if (!videos || videos.length === 0) {
    return (
      <section
        className="w-full min-h-screen flex items-center justify-center bg-near-white"
        role="region"
        aria-label="Video River"
      >
        <div className="text-center px-6">
          <p className="font-body text-mid-gray text-lg">
            No videos available at this time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <RiverErrorBoundary>
      <section
        id="video-river"
        className="w-full"
        role="region"
        aria-label="Video River - Interactive video gallery"
      >
      {/* Skip Link for Keyboard Users */}
      <a
        href="#after-river"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
      >
        Skip video gallery
      </a>

      {/* River Video Stack */}
      <div className="flex flex-col" role="list" aria-label="Video gallery with 5 videos">
        {sortedVideos.map((video, index) => (
          <div
            key={video._id}
            className="w-full"
            role="listitem"
            data-river-slot={index + 1}
          >
            <RiverVideoSlot
              video={video}
              locale={locale}
            />
          </div>
        ))}
      </div>

      {/* Skip Link Target */}
      <div id="after-river" className="sr-only">End of video gallery</div>

      {/* Scroll Indicator - Optional decorative element */}
      <div
        className="fixed bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-body text-xs text-mid-gray uppercase tracking-wider">
          Scroll
        </span>
        <div className="w-px h-12 bg-mid-gray/30" />
      </div>
    </section>
    </RiverErrorBoundary>
  );
}
