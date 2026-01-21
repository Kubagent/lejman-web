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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Prepare all images (main + additional)
  const allImages = [artwork.mainImage, ...(artwork.images || [])];

  // Combine all media (videos first, then images) into one array
  const allMedia: Array<{ type: 'image' | 'video'; data: any; index: number }> = [];

  // Add videos first (so they show initially)
  if (artwork.videos && artwork.videos.length > 0) {
    artwork.videos.forEach((video, idx) => {
      allMedia.push({ type: 'video', data: video, index: idx });
    });
  }

  // Add images after videos
  allImages.forEach((image, idx) => {
    allMedia.push({ type: 'image', data: image, index: idx });
  });

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentMediaIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allMedia.length > 1) {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allMedia.length]);

  const currentMedia = allMedia[currentMediaIndex];

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

  // Lightbox images (only images, not videos)
  const lightboxImages = allImages.map((img) => ({
    url: getImageUrl(img, 1920), // High-res for lightbox
    alt: `${title}, ${artwork.year}, ${medium}`,
    title: title,
    year: artwork.year
  }));

  const handleImageClick = () => {
    // Only open lightbox if current media is an image
    if (currentMedia?.type === 'image') {
      setSelectedImageIndex(currentMedia.index);
      setLightboxOpen(true);
    }
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

        {/* Media Gallery - Images and Videos */}
        {allMedia.length > 0 && currentMedia && (
          <>
            {/* Media Container */}
            <div className="w-full bg-black flex items-center justify-center mb-4" style={{ maxHeight: '85vh' }}>
              {currentMedia.type === 'image' ? (
                <img
                  src={getImageUrl(currentMedia.data, 1920)}
                  alt={`${title} by Dominik Lejman, ${artwork.year}`}
                  className="w-full h-full object-contain cursor-pointer"
                  style={{ maxHeight: '85vh' }}
                  onClick={handleImageClick}
                />
              ) : (
                <div className="w-full" style={{ maxHeight: '85vh' }}>
                  {/* Handle Mux video */}
                  {currentMedia.data._type === 'mux.video' && currentMedia.data.asset?.playbackId ? (
                    <video
                      src={`https://stream.mux.com/${currentMedia.data.asset.playbackId}.m3u8`}
                      controls
                      className="w-full h-auto"
                      style={{ maxHeight: '85vh' }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : currentMedia.data._type === 'file' && currentMedia.data.asset?.url ? (
                    <video
                      src={currentMedia.data.asset.url}
                      controls
                      className="w-full h-auto"
                      style={{ maxHeight: '85vh' }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
              )}
            </div>

            {/* Navigation */}
            {allMedia.length > 1 && (
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                marginBottom: '40px'
              }}>
                {/* Left Arrow */}
                <button
                  onClick={goToPrevious}
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
                  aria-label="Previous media"
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Media Counter */}
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#999999'
                }}>
                  {currentMediaIndex + 1} / {allMedia.length}
                </span>

                {/* Right Arrow */}
                <button
                  onClick={goToNext}
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
                  aria-label="Next media"
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

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

          {/* Linked Projects - Compact bubble style */}
          {artwork.projects && artwork.projects.length > 0 && (
            <div className="mt-16">
              <p className="font-body text-sm text-dark-gray mb-3">Associated Projects:</p>
              <div className="flex flex-wrap gap-3">
              {artwork.projects.map((project) => {
                const projectTitle = project.title[locale] ?? project.title.en ?? 'Untitled Project';
                const thumbnailUrl = project.thumbnail
                  ? urlFor(project.thumbnail).width(80).height(80).quality(80).url()
                  : null;

                return project.slug?.current ? (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug.current}`}
                    className="group inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                    )}
                    <span className="font-body text-sm text-dark-gray group-hover:text-black transition-colors">
                      {projectTitle}
                    </span>
                  </Link>
                ) : null;
              })}
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
