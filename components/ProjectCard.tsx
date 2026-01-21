'use client';

import Link from 'next/link';
import { ProjectCardProps } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';

/**
 * ProjectCard - Individual project display
 *
 * Features:
 * - Two view modes: detailed (default) and compact (timeline-style)
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
 * <ProjectCard project={project} locale="en" viewMode="detailed" />
 */
interface ProjectCardInternalProps extends ProjectCardProps {
  index?: number;
}

export default function ProjectCard({
  project,
  locale = 'en',
  viewMode = 'detailed',
  index = 0
}: ProjectCardInternalProps) {
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

  // Generate optimized image URL - use first photo as thumbnail
  const thumbnailImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const imageUrl = thumbnailImage
    ? (thumbnailImage.asset?._ref?.startsWith('http://') || thumbnailImage.asset?._ref?.startsWith('https://'))
      ? thumbnailImage.asset._ref  // Mock URL
      : urlFor(thumbnailImage)
          .width(viewMode === 'detailed' ? 2400 : 300)
          .height(viewMode === 'detailed' ? 1800 : 225)
          .quality(100)
          .auto('format')
          .url()
    : null;

  // ARIA label for accessibility
  const ariaLabel = `${title}, ${project.year}, ${typeLabel} at ${venueName}, ${location}`;

  // Alternating background
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  // Compact view - Timeline style (minimal info, single line)
  if (viewMode === 'compact') {
    return (
      <article className={`group ${bgClass}`}>
        <Link
          href={`/projects/${project.slug.current}`}
          className="block py-6 px-6 md:px-8 no-underline"
          aria-label={ariaLabel}
        >
          <div className="flex items-baseline gap-6">
            {/* Year - Fixed width for alignment */}
            <span className="font-body text-lg md:text-xl font-semibold text-black w-16 flex-shrink-0">
              {project.year}
            </span>

            {/* Title & Venue */}
            <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:gap-2">
              <h3 className="font-heading text-lg md:text-xl font-semibold text-black group-hover:underline transition-all inline-block">
                {title}
              </h3>
              <span className="font-body text-sm md:text-base text-mid-gray">
                {venueName}, {location}
              </span>
            </div>

            {/* Arrow indicator */}
            <span className="font-body text-mid-gray hidden md:inline" aria-hidden="true">
              →
            </span>
          </div>
        </Link>
      </article>
    );
  }

  // Detailed view (default) - Full card with image and metadata
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
