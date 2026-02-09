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

  // Localized "Permanent since" text for ongoing projects
  const permanentSinceText = {
    en: 'Permanent since',
    de: 'Permanent seit',
    pl: 'Stała instalacja od'
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
      return `${permanentSinceText} ${formatDate(project.startDate)}`;
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

  // Combine all media (videos first, then photos) into one array
  const allMedia: Array<{ type: 'image' | 'video'; data: any; index: number }> = [];

  // Add videos first (so they show initially)
  if (project.videos && project.videos.length > 0) {
    project.videos.forEach((video, idx) => {
      allMedia.push({ type: 'video', data: video, index: idx });
    });
  }

  // Add images after videos
  if (project.images && project.images.length > 0) {
    project.images.forEach((image, idx) => {
      allMedia.push({ type: 'image', data: image, index: idx });
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
                  alt={`${title} at ${venueName}, ${project.year} - Dominik Lejman`}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '85vh' }}
                />
              ) : (
                <div className="w-full" style={{ maxHeight: '85vh' }}>
                  {/* Handle Mux video */}
                  {currentMedia.data._type === 'mux.video' && currentMedia.data.asset?.playbackId ? (
                    <video
                      src={`https://stream.mux.com/${currentMedia.data.asset.playbackId}.m3u8`}
                      poster={`https://image.mux.com/${currentMedia.data.asset.playbackId}/thumbnail.jpg?width=1920&height=1080&fit_mode=smartcrop`}
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

          {/* Linked Artworks - Compact bubble style */}
          {featuredArtworks && featuredArtworks.length > 0 && (
            <div className="mt-16">
              <p className="font-body text-sm text-dark-gray mb-3">Associated Artworks:</p>
              <div className="flex flex-wrap gap-3">
              {featuredArtworks.map((artwork) => {
                const artworkTitle = artwork.title[locale] ?? artwork.title.en ?? 'Untitled';
                const thumbnailUrl = artwork.mainImage
                  ? getImageUrl(artwork.mainImage, 80)
                  : null;

                return (
                  <Link
                    key={artwork._id}
                    href={`/works/${artwork.slug.current}`}
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                    <span className="font-body text-sm text-dark-gray group-hover:text-black transition-colors">
                      {artworkTitle}
                    </span>
                  </Link>
                );
              })}
              </div>
            </div>
          )}

        </div>

      </article>
    </>
  );
}
