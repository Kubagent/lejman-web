'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectCardProps } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';

/**
 * ProjectCard - Individual project display
 *
 * Features:
 * - Two view modes: list (default, timeline-style) and grid (full card with image)
 * - Responsive layout with image thumbnails
 * - Type badges (Solo/Group/Institutional)
 * - Formatted date ranges
 * - Hover effects for interactivity
 * - Keyboard accessible links
 * - ARIA labels for screen readers
 *
 * Design:
 * - Monochrome color palette
 * - Institutional "white cube" aesthetic
 * - Typography hierarchy (Cormorant Garamond for titles, Inter for metadata)
 * - 8px grid system for spacing
 *
 * Usage:
 * <ProjectCard project={project} locale="en" viewMode="list" />
 */
interface ProjectCardInternalProps extends ProjectCardProps {
  index?: number;
}

export default function ProjectCard({
  project,
  locale = 'en',
  viewMode = 'list',
  index = 0
}: ProjectCardInternalProps) {
  // State for mobile overlay in grid view
  const [showOverlay, setShowOverlay] = useState(false);

  // Get localized text
  const title = project.title[locale] ?? project.title.en ?? 'Untitled Project';
  const venueName = project.venue[locale] ?? project.venue.en ?? '';
  const description = project.description?.[locale] ?? project.description?.en ?? '';

  // Location (City, Country)
  const location = project.location;

  // Localized "Present" text for ongoing projects
  const presentText = {
    en: 'Present',
    de: 'Gegenwart',
    pl: 'Obecnie'
  }[locale];

  // Format date range
  const formatDateRange = () => {
    if (!project.startDate && !project.endDate) {
      return project.year.toString();
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Handle ongoing projects: "Mar 15, 2024 - Present"
    if (project.isOngoing && project.startDate) {
      const startFormatted = formatDate(project.startDate);
      return `${startFormatted} - ${presentText}`;
    }

    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      // Same year: "Mar 15 - May 20, 2024"
      if (start.getFullYear() === end.getFullYear()) {
        const startMonth = start.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
        const endFull = formatDate(project.endDate);
        return `${startMonth} - ${endFull}`;
      }

      // Different years: "Dec 15, 2023 - Feb 10, 2024"
      return `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`;
    }

    return project.startDate ? formatDate(project.startDate) : project.year.toString();
  };

  // Type label with proper capitalization
  const typeLabel = {
    solo: 'Solo Project',
    group: 'Group Project',
    institutional: 'Institutional Project'
  }[project.type];

  // Short type label for grid view overlay
  const shortTypeLabel = {
    solo: 'Solo',
    group: 'Group',
    institutional: 'Institutional'
  }[project.type];

  // Generate optimized image URL - use first photo as thumbnail
  const thumbnailImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const imageUrl = thumbnailImage
    ? (thumbnailImage.asset?._ref?.startsWith('http://') || thumbnailImage.asset?._ref?.startsWith('https://'))
      ? thumbnailImage.asset._ref  // Mock URL
      : urlFor(thumbnailImage)
          .width(viewMode === 'grid' ? 600 : 2400)
          .height(viewMode === 'grid' ? 600 : 1800)
          .quality(viewMode === 'grid' ? 85 : 100)
          .auto('format')
          .url()
    : null;

  // ARIA label for accessibility
  const ariaLabel = `${title}, ${project.year}, ${typeLabel} at ${venueName}, ${location}`;

  // Alternating background for list view
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  // Grid view - Square card with hover overlay (like ArtworkCard grid view)
  if (viewMode === 'grid') {
    return (
      <Link
        href={`/projects/${project.slug.current}`}
        className="group block no-underline"
        aria-label={ariaLabel}
        onTouchStart={() => setShowOverlay(true)}
        onTouchEnd={() => setShowOverlay(false)}
      >
        <article className="relative w-full aspect-square bg-near-white overflow-hidden">
          {/* Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${title} at ${venueName}, ${project.year} - Dominik Lejman exhibition`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-mid-gray text-sm">No image</span>
            </div>
          )}

          {/* Metadata Overlay - Hidden by default, visible on hover (desktop) or tap (mobile) */}
          <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${showOverlay ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 pointer-events-none`}>
            <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2">
              {title}
            </h3>
            <div className="font-body text-sm md:text-base text-white/90">
              <span>{project.year}</span>
              <span className="before:content-['·'] before:mx-2">{shortTypeLabel}</span>
            </div>
            <div className="font-body text-xs md:text-sm text-white/70 mt-1">
              {venueName}, {location}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // List view (default) - Full card with image and metadata
  return (
    <article className={`group ${bgClass}`}>
      <Link
        href={`/projects/${project.slug.current}`}
        className="block no-underline"
        aria-label={ariaLabel}
      >
        <div className="flex flex-col md:flex-row gap-8 py-8 px-6 md:px-12 lg:px-24">
        {/* Image thumbnail (if available) */}
        {imageUrl && (
          <div className="relative flex-shrink-0 bg-near-white overflow-hidden" style={{ maxHeight: '70vh', width: 'auto', aspectRatio: '4/3', marginLeft: '200px', marginRight: '200px' }}>
            <img
              src={imageUrl}
              alt={`${title} at ${venueName}, ${project.year} - Dominik Lejman exhibition`}
              loading="lazy"
              className="w-full h-full object-contain"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        )}

        {/* Metadata */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {/* Year badge - prominent display */}
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-black text-white font-body text-sm font-semibold">
              {project.year}
            </span>
            <span className="font-body text-sm text-mid-gray uppercase tracking-wide">
              {typeLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-black group-hover:underline transition-all inline-block">
            {title}
          </h3>

          {/* Venue & Location */}
          <div className="font-body text-base md:text-lg text-dark-gray">
            <p className="font-medium">{venueName}</p>
            <p className="text-mid-gray">{location}</p>
          </div>

          {/* Date Range */}
          <p className="font-body text-sm md:text-base text-mid-gray">
            {formatDateRange()}
          </p>

          {/* Description (if available) */}
          {description && (
            <p className="font-body text-sm md:text-base text-mid-gray line-clamp-2 mt-2">
              {description}
            </p>
          )}

          {/* Featured artworks count */}
          {project.featuredArtworks && project.featuredArtworks.length > 0 && (
            <p className="font-body text-sm text-mid-gray">
              {project.featuredArtworks.length} {project.featuredArtworks.length === 1 ? 'artwork' : 'artworks'} featured
            </p>
          )}

          {/* CTA Link */}
          <div className="font-body text-sm md:text-base text-black group-hover:text-dark-gray transition-colors mt-2">
            View Project →
          </div>
        </div>
        </div>
      </Link>
    </article>
  );
}
