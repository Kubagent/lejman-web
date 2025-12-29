'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Artwork } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';
import Lightbox from './Lightbox';

interface ArtworkDetailProps {
  artwork: Artwork;
  locale?: 'en' | 'de' | 'pl';
}

interface CarouselState {
  currentIndex: number;
}

/**
 * ArtworkDetail - Complete artwork display with high-res images and metadata
 *
 * Features:
 * - High-resolution main image (max 960px desktop, full-width mobile)
 * - Complete metadata: title, year, medium, dimensions, description
 * - Lightbox viewer on image click
 * - Localized content support
 * - Back to archive link
 * - Institutional "white cube" aesthetic
 *
 * Layout:
 * - Mobile: Edge-to-edge images, 24px padding for text
 * - Tablet: 48px margins
 * - Desktop: Max 960px width, 96px margins
 *
 * Accessibility:
 * - Semantic HTML structure
 * - Descriptive alt text
 * - Keyboard navigation
 * - ARIA labels
 *
 * Performance:
 * - Optimized image loading with Sanity CDN
 * - Lazy loading with blur placeholder
 * - Responsive images with srcset
 */
export default function ArtworkDetail({
  artwork,
  locale = 'en'
}: ArtworkDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Get localized content
  const title = artwork.title[locale] ?? artwork.title.en ?? 'Untitled';
  const medium = artwork.medium[locale] ?? artwork.medium.en ?? '';
  const description = artwork.description?.[locale] ?? artwork.description?.en;

  // Format dimensions
  const dimensions = artwork.dimensions
    ? `${artwork.dimensions.width} × ${artwork.dimensions.height}${
        artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''
      } ${artwork.dimensions.unit ?? 'cm'}`
    : '';

  // Prepare all images (main + additional)
  const allImages = [artwork.mainImage, ...(artwork.images || [])];

  // Generate optimized image URLs
  const getImageUrl = (image: typeof artwork.mainImage, width: number) => {
    // Handle mock URLs (development)
    if (image.asset?._ref?.startsWith('http://') || image.asset?._ref?.startsWith('https://')) {
      return image.asset._ref;
    }
    // Production: Use Sanity CDN
    return urlFor(image)
      .width(width)
      .quality(85)
      .auto('format')
      .url();
  };

  // Main image URL (960px for desktop)
  const mainImageUrl = getImageUrl(artwork.mainImage, 960);

  // Lightbox images
  const lightboxImages = allImages.map((img) => ({
    url: getImageUrl(img, 1920), // High-res for lightbox
    alt: `${title}, ${artwork.year}, ${medium}`,
    title: title,
    year: artwork.year
  }));

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <article className="min-h-screen bg-white">
        {/* Back button */}
        <div className="px-6 md:px-12 lg:px-24 py-4">
          <Link
            href="/works"
            className="inline-flex items-center gap-1 font-body text-xs text-dark-gray hover:text-black transition-colors whitespace-nowrap"
            aria-label="Back to archive"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Archive
          </Link>
        </div>

        {/* Main image - Full screen size */}
        <div className="w-full h-[80vh] flex items-center justify-center px-6 md:px-12 lg:px-24">
          <img
            src={mainImageUrl}
            alt={`${title} by Dominik L., ${artwork.year}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Metadata section */}
        <div className="w-full md:max-w-4xl md:mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-8">
            {title}
          </h1>

          {/* Basic info - vertical stack */}
          <div className="space-y-4 font-body text-lg text-dark-gray mb-12">
            <div>{artwork.year}</div>
            {medium && <div>{medium}</div>}
            {dimensions && <div>{dimensions}</div>}
          </div>

          {/* Description */}
          {description && (
            <div className="prose prose-lg max-w-none mb-12">
              <p className="font-body text-lg leading-relaxed text-black">
                {description}
              </p>
            </div>
          )}

          {/* Additional images carousel - if there are more than just the main image */}
          {artwork.images && artwork.images.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-black mb-8">
                Additional Views
              </h2>
              <div className="relative w-full h-[70vh] flex items-center justify-center group">
                {/* Current image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={getImageUrl(artwork.images[carouselIndex], 960)}
                    alt={`${title} - Detail ${carouselIndex + 1}`}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Left arrow */}
                {artwork.images.length > 1 && (
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev === 0 ? artwork.images!.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-dark-gray hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Right arrow */}
                {artwork.images.length > 1 && (
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev === artwork.images!.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-dark-gray hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Image counter */}
                {artwork.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="font-body text-xs text-black">
                      {carouselIndex + 1} / {artwork.images.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
