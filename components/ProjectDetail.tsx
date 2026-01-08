'use client';

import { useState } from 'react';
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
          <div className="w-full mb-8 md:mb-12 lg:mb-16 relative">
            {/* Media Container - Max viewport height */}
            <div className="relative w-full bg-black flex items-center justify-center" style={{ maxHeight: '85vh' }}>
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

              {/* Navigation Arrows */}
              {allMedia.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-black rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus z-10"
                    aria-label="Previous media"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-black rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus z-10"
                    aria-label="Next media"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Media Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                    <p className="font-body text-sm text-white">
                      {currentMediaIndex + 1} / {allMedia.length}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
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
