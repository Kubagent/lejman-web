'use client';

import { ArtworkGridProps } from '@/lib/types';
import ArtworkCard from './ArtworkCard';

/**
 * ArtworkGrid - Responsive grid/list container for artworks
 *
 * Layout:
 * - Mobile (< 640px): 2 columns
 * - Small (640-768px): 2 columns
 * - Medium (768-1024px): 3 columns
 * - Large (1024-1280px): 3 columns
 * - Extra Large (> 1280px): 4 columns
 *
 * Features:
 * - Grid view: Multi-column masonry-style layout
 * - List view: Single column with horizontal cards
 * - Responsive gaps and padding
 * - Empty state handling
 * - Accessibility: Proper semantic HTML
 */
export default function ArtworkGrid({
  artworks,
  locale = 'en',
  viewMode = 'grid'
}: ArtworkGridProps) {
  // Empty state
  if (!artworks || artworks.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-body text-mid-gray text-lg">
            No artworks found.
          </p>
          <p className="font-body text-mid-gray text-sm mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="w-full"
      role="region"
      aria-label={`Artwork ${viewMode} view with ${artworks.length} ${artworks.length === 1 ? 'artwork' : 'artworks'}`}
    >
      {viewMode === 'list' ? (
        // List View - Single column with horizontal cards
        <div className="flex flex-col">
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork._id}
              artwork={artwork}
              locale={locale}
              viewMode="list"
              index={index}
            />
          ))}
        </div>
      ) : (
        // Grid View - Responsive multi-column layout
        <div
          className="grid grid-cols-3 gap-6"
          role="list"
        >
          {artworks.map((artwork) => (
            <div key={artwork._id} role="listitem">
              <ArtworkCard
                artwork={artwork}
                locale={locale}
                viewMode="grid"
              />
            </div>
          ))}
        </div>
      )}

      {/* Artwork count indicator */}
      <div className="mt-12 text-center">
        <p className="font-body text-sm text-mid-gray">
          Showing {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'}
        </p>
      </div>
    </section>
  );
}
