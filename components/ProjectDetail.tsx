'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, Artwork } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';

interface ProjectDetailProps {
  project: Project;
  featuredArtworks?: Artwork[];
  locale?: 'en' | 'de' | 'pl';
}

/**
 * ProjectDetail - Complete project display with unified media gallery
 *
 * Features:
 * - Combined photos and videos in a single carousel
 * - Left/right navigation through all media
 * - Viewport-constrained media (no scrolling to see full content)
 * - Complete metadata and description
 */
export default function ProjectDetail({
  project,
  featuredArtworks = [],
  locale = 'en'
}: ProjectDetailProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Get localized content
  const title = project.title[locale] ?? project.title.en ?? 'Untitled Project';
  const venueName = project.venue[locale] ?? project.venue.en ?? '';
  const description = project.description?.[locale] ?? project.description?.en;

  // Localized "Present" text for ongoing projects
  const presentText = {
    en: 'Present',
    de: 'Gegenwart',
    pl: 'Obecnie'
  }[locale];

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date range with ongoing support
  const dateRange = (() => {
    if (project.isOngoing && project.startDate) {
      return `${formatDate(project.startDate)} – ${presentText}`;
    }

    if (project.startDate && project.endDate) {
      return `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`;
    }

    return project.year ? project.year.toString() : '';
  })();

  // Format project type
  const typeLabels = {
    solo: { en: 'Solo Project', de: 'Einzelausstellung', pl: 'Wystawa indywidualna' },
    group: { en: 'Group Project', de: 'Gruppenausstellung', pl: 'Wystawa zbiorowa' },
    institutional: { en: 'Institutional Project', de: 'Institutionelle Ausstellung', pl: 'Wystawa instytucjonalna' }
  };
  const typeLabel = typeLabels[project.type][locale] ?? typeLabels[project.type].en;

  // Combine all media (photos and videos) into one array
  const allMedia: Array<{ type: 'image' | 'video'; data: any; index: number }> = [];

  // Add images
  if (project.images && project.images.length > 0) {
    project.images.forEach((image, idx) => {
      allMedia.push({ type: 'image', data: image, index: idx });
    });
  }

  // Add videos
  if (project.videos && project.videos.length > 0) {
    project.videos.forEach((video, idx) => {
      allMedia.push({ type: 'video', data: video, index: idx });
    });
  }

  // Generate image URL
  const getImageUrl = (image: any, width: number) => {
    if (!image || !image.asset) return '';

    if (image.asset?._ref?.startsWith('http://') || image.asset?._ref?.startsWith('https://')) {
      return image.asset._ref;
    }

    try {
      return urlFor(image)
        .width(width)
        .quality(85)
        .auto('format')
        .url();
    } catch (error) {
      console.error('Error generating image URL:', error);
      return '';
    }
  };

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
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  const currentMedia = allMedia[currentMediaIndex];

  // Debug logging
  console.log('Total media items:', allMedia.length);
  console.log('Current media index:', currentMediaIndex);
  console.log('Current media:', currentMedia);
  console.log('Images:', project.images?.length || 0);
  console.log('Videos:', project.videos?.length || 0);

  return (
    <>
      {/* Back to Projects Link */}
      <div className="py-4" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 font-body text-xs text-dark-gray hover:text-black transition-colors whitespace-nowrap"
          aria-label="Back to projects list"
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
          Back to Projects
        </Link>
      </div>

      {/* Main Project Content */}
      <article className="pb-16 md:pb-24">
        {/* Media Carousel */}
        {allMedia.length > 0 && currentMedia && (
          <>
            {/* Media Container */}
            <div className="w-full bg-black flex items-center justify-center mb-4" style={{ maxHeight: '85vh' }}>
              {currentMedia.type === 'image' ? (
                <img
                  src={getImageUrl(currentMedia.data, 1920)}
                  alt={`${title} - Media ${currentMediaIndex + 1}`}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '85vh' }}
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

            {/* Minimalist Navigation */}
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

        {/* Project Metadata */}
        <div className="w-full md:max-w-4xl md:mx-auto py-12 md:py-16" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-8">
            {title}
          </h1>

          {/* Basic info - vertical stack */}
          <div className="space-y-4 font-body text-lg text-dark-gray mb-12">
            <div>{project.year}</div>
            {venueName && <div>{venueName}</div>}
            {project.location && <div>{project.location}</div>}
            {dateRange && <div>{dateRange}</div>}
          </div>

          {/* Description */}
          {description && (
            <div className="prose prose-lg max-w-none mb-12">
              <p className="font-body text-lg leading-relaxed text-black whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Featured Artworks */}
          {featuredArtworks && featuredArtworks.length > 0 && (
            <div className="mt-12 md:mt-16">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-black mb-6 md:mb-8">
                Featured Artworks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {featuredArtworks.map((artwork) => (
                  <Link
                    key={artwork._id}
                    href={`/works/${artwork.slug.current}`}
                    className="group block no-underline"
                  >
                    <div className="aspect-square bg-near-white overflow-hidden mb-2">
                      {artwork.mainImage && (
                        <img
                          src={getImageUrl(artwork.mainImage, 400)}
                          alt={artwork.title.en ?? 'Artwork'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <h3 className="font-body text-sm md:text-base text-dark-gray group-hover:text-black transition-colors">
                      {artwork.title[locale] ?? artwork.title.en}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </article>
    </>
  );
}
