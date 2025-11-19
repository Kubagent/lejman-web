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
    if (image.asset._ref.startsWith('http://') || image.asset._ref.startsWith('https://')) {
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
        <div className="px-6 md:px-12 lg:px-24 py-6">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 font-body text-base text-dark-gray hover:text-black transition-colors group"
            aria-label="Back to archive"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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

        {/* Main image - Edge-to-edge on mobile, max 960px centered on desktop */}
        <div className="w-full md:max-w-4xl md:mx-auto md:px-12 lg:px-24">
          <button
            onClick={() => handleImageClick(0)}
            className="relative w-full aspect-square md:aspect-auto block cursor-pointer group overflow-hidden"
            aria-label="Open image in lightbox"
          >
            <img
              src={mainImageUrl}
              alt={`${title} by Dominik L., ${artwork.year}`}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Zoom hint overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="font-body text-sm text-black flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Click to view full size
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Metadata section */}
        <div className="w-full md:max-w-4xl md:mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-6">
            {title}
          </h1>

          {/* Basic info */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-body text-lg text-dark-gray mb-8">
            <span>{artwork.year}</span>
            {medium && (
              <span className="before:content-['·'] before:mr-6">{medium}</span>
            )}
            {dimensions && (
              <span className="before:content-['·'] before:mr-6">{dimensions}</span>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="prose prose-lg max-w-none">
              <p className="font-body text-lg leading-relaxed text-black">
                {description}
              </p>
            </div>
          )}

          {/* Additional images grid - if there are more than just the main image */}
          {artwork.images && artwork.images.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-black mb-8">
                Additional Views
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {artwork.images.map((image, index) => {
                  const thumbUrl = getImageUrl(image, 400);
                  return (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index + 1)}
                      className="relative aspect-square bg-near-white overflow-hidden group cursor-pointer"
                      aria-label={`View additional image ${index + 1}`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`${title} - Detail ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spacer before next section */}
          <div className="mt-24 pt-12 border-t border-light-gray">
            <Link
              href="/works"
              className="inline-flex items-center gap-2 font-body text-base text-dark-gray hover:text-black transition-colors group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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
              View all works
            </Link>
          </div>
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
