'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArtworkCardProps } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';

/**
 * ArtworkCard - Individual artwork display in grid or list view
 *
 * Features:
 * - Responsive image with hover effects
 * - Optimized image loading with Sanity CDN
 * - Grid view: Image + minimal metadata
 * - List view: Image + full metadata
 * - Keyboard accessible link
 * - ARIA labels for screen readers
 *
 * Performance:
 * - Lazy loading images
 * - Optimized image sizes for different viewports
 * - CSS-based hover effects (no JS)
 */
interface ArtworkCardInternalProps extends ArtworkCardProps {
  index?: number;
}

export default function ArtworkCard({
  artwork,
  locale = 'en',
  viewMode = 'grid',
  index = 0
}: ArtworkCardInternalProps) {
  // State for mobile overlay (must be at top level, before any returns)
  const [showOverlay, setShowOverlay] = useState(false);

  // Get localized text
  const title = artwork.title[locale] ?? artwork.title.en ?? 'Untitled';
  const medium = artwork.medium[locale] ?? artwork.medium.en ?? '';
  const description = artwork.description?.[locale] ?? artwork.description?.en ?? '';

  // Format dimensions
  const dimensions = artwork.dimensions
    ? `${artwork.dimensions.width} × ${artwork.dimensions.height}${
        artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''
      } cm`
    : '';

  // Generate optimized image URL
  // Grid view: smaller size (600px), List view: larger (800px)
  const imageUrl = artwork.mainImage
    ? (artwork.mainImage.asset?._ref?.startsWith('http://') || artwork.mainImage.asset?._ref?.startsWith('https://'))
      ? artwork.mainImage.asset._ref  // Mock URL
      : urlFor(artwork.mainImage)
          .width(viewMode === 'grid' ? 600 : 800)
          .height(viewMode === 'grid' ? 600 : 800)
          .quality(85)
          .auto('format')
          .url()
    : '/placeholder-artwork.jpg';

  // ARIA label for accessibility
  const ariaLabel = `${title}, ${artwork.year}${medium ? `, ${medium}` : ''}`;

  // Alternating background for list view
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  if (viewMode === 'list') {
    return (
      <article className={`group ${bgClass}`}>
        <Link
          href={`/works/${artwork.slug.current}`}
          className="block no-underline group"
          aria-label={ariaLabel}
        >
          <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 py-10 px-6 md:px-8">
            {/* Image */}
            <div className="relative w-full md:w-64 h-64 flex-shrink-0 bg-near-white overflow-hidden">
              <img
                src={imageUrl}
                alt={`${title} by Dominik L.`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col justify-center gap-3">
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-black group-hover:underline transition-all inline-block">
                {title}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-base text-dark-gray">
                <span>{artwork.year}</span>
                {medium && <span className="before:content-['·'] before:mr-4">{medium}</span>}
                {dimensions && <span className="before:content-['·'] before:mr-4">{dimensions}</span>}
              </div>
              {description && (
                <p className="font-body text-base text-mid-gray line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Grid view (default) - Clean image with overlay on hover/tap
  return (
    <Link
      href={`/works/${artwork.slug.current}`}
      className="group block no-underline"
      aria-label={ariaLabel}
      onTouchStart={() => setShowOverlay(true)}
      onTouchEnd={() => setShowOverlay(false)}
    >
      <article className="relative w-full aspect-square bg-near-white overflow-hidden">
        {/* Image */}
        <img
          src={imageUrl}
          alt={`${title} by Dominik L.`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Metadata Overlay - Hidden by default, visible on hover (desktop) or tap (mobile) */}
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${showOverlay ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 pointer-events-none`}>
          <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2">
            {title}
          </h3>
          <div className="font-body text-sm md:text-base text-white/90">
            <span>{artwork.year}</span>
            {medium && <span className="before:content-['·'] before:mx-2">{medium}</span>}
          </div>
          {dimensions && (
            <div className="font-body text-xs md:text-sm text-white/70 mt-1">
              {dimensions}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
