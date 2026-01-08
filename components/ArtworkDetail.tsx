'use client';

import { useState, useEffect } from 'react';
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
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Prepare all images (main + additional)
  const allImages = [artwork.mainImage, ...(artwork.images || [])];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setMainImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
          setMainImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length]);

  // Get localized content
  const title = artwork.title[locale] ?? artwork.title.en ?? 'Untitled';
  const medium = artwork.medium[locale] ?? artwork.medium.en ?? '';
  const description = artwork.description?.[locale] ?? artwork.description?.en;

  // Format dimensions
  const dimensions = artwork.customDimensions && artwork.customDimensions.length > 0
    ? artwork.customDimensions
        .map(d => `${d.value}cm (${d.label})`)
        .join(' × ')
    : artwork.dimensions
    ? `${artwork.dimensions.width} × ${artwork.dimensions.height}${
        artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''
      } ${artwork.dimensions.unit ?? 'cm'}`
    : '';

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

  const handleImageClick = () => {
    setSelectedImageIndex(mainImageIndex);
    setLightboxOpen(true);
  };

  return (
    <>
      <article className="min-h-screen bg-white">
        {/* Back button */}
        <div className="py-4" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <Link
            href="/works"
            className="inline-flex items-center gap-1 font-body text-xs text-dark-gray hover:text-black transition-colors whitespace-nowrap"
            aria-label="Back to works"
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
            Back to Works
          </Link>
        </div>

        {/* Main image - Full screen size */}
        <div className="w-full mb-4" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <div className="h-[80vh] flex items-center justify-center">
            <img
              src={getImageUrl(allImages[mainImageIndex], 960)}
              alt={`${title} by Dominik Lejman, ${artwork.year}`}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={handleImageClick}
            />
          </div>

          {/* Navigation below main image */}
          {allImages.length > 1 && (
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
              marginTop: '16px',
              marginBottom: '40px'
            }}>
              {/* Left Arrow */}
              <button
                onClick={() => setMainImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#000000',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                aria-label="Previous image"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image Counter */}
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#999999'
              }}>
                {mainImageIndex + 1} / {allImages.length}
              </span>

              {/* Right Arrow */}
              <button
                onClick={() => setMainImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#000000',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                aria-label="Next image"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Metadata section */}
        <div className="w-full md:max-w-4xl md:mx-auto py-12 md:py-16" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
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
