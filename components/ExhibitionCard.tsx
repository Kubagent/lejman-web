'use client';

import Link from 'next/link';
import { ExhibitionCardProps } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';

/**
 * ExhibitionCard - Individual exhibition display
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
 * <ExhibitionCard exhibition={exhibition} locale="en" viewMode="detailed" />
 */
interface ExhibitionCardInternalProps extends ExhibitionCardProps {
  index?: number;
}

export default function ExhibitionCard({
  exhibition,
  locale = 'en',
  viewMode = 'detailed',
  index = 0
}: ExhibitionCardInternalProps) {
  // Get localized text
  const title = exhibition.title[locale] ?? exhibition.title.en ?? 'Untitled Exhibition';
  const venueName = exhibition.venue.name[locale] ?? exhibition.venue.name.en ?? '';
  const description = exhibition.description?.[locale] ?? exhibition.description?.en ?? '';

  // Format location (City, Country)
  const location = `${exhibition.venue.city}, ${exhibition.venue.country}`;

  // Format date range
  const formatDateRange = () => {
    if (!exhibition.startDate && !exhibition.endDate) {
      return exhibition.year.toString();
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (exhibition.startDate && exhibition.endDate) {
      const start = new Date(exhibition.startDate);
      const end = new Date(exhibition.endDate);

      // Same year: "Mar 15 - May 20, 2024"
      if (start.getFullYear() === end.getFullYear()) {
        const startMonth = start.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
        const endFull = formatDate(exhibition.endDate);
        return `${startMonth} - ${endFull}`;
      }

      // Different years: "Dec 15, 2023 - Feb 10, 2024"
      return `${formatDate(exhibition.startDate)} - ${formatDate(exhibition.endDate)}`;
    }

    return exhibition.startDate ? formatDate(exhibition.startDate) : exhibition.year.toString();
  };

  // Type label with proper capitalization
  const typeLabel = {
    solo: 'Solo Exhibition',
    group: 'Group Exhibition',
    institutional: 'Institutional Exhibition'
  }[exhibition.type];

  // Generate optimized image URL
  const imageUrl = exhibition.mainImage
    ? (exhibition.mainImage.asset._ref.startsWith('http://') || exhibition.mainImage.asset._ref.startsWith('https://'))
      ? exhibition.mainImage.asset._ref  // Mock URL
      : urlFor(exhibition.mainImage)
          .width(viewMode === 'detailed' ? 400 : 200)
          .height(viewMode === 'detailed' ? 300 : 150)
          .quality(85)
          .auto('format')
          .url()
    : null;

  // ARIA label for accessibility
  const ariaLabel = `${title}, ${exhibition.year}, ${typeLabel} at ${venueName}, ${location}`;

  // Alternating background
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  // Compact view - Timeline style (minimal info, single line)
  if (viewMode === 'compact') {
    return (
      <article className={`group ${bgClass}`}>
        <Link
          href={`/exhibitions/${exhibition.slug.current}`}
          className="block py-6 px-6 md:px-8 hover:opacity-80 transition-opacity duration-200"
          aria-label={ariaLabel}
        >
          <div className="flex items-baseline gap-6">
            {/* Year - Fixed width for alignment */}
            <span className="font-body text-lg md:text-xl font-semibold text-black w-16 flex-shrink-0">
              {exhibition.year}
            </span>

            {/* Title & Venue */}
            <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:gap-2">
              <h3 className="font-heading text-lg md:text-xl font-semibold text-black group-hover:text-dark-gray transition-colors">
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
        href={`/exhibitions/${exhibition.slug.current}`}
        className="block"
        aria-label={ariaLabel}
      >
        <div className="flex flex-col md:flex-row gap-6 py-10 px-6 md:px-8 hover:opacity-80 transition-opacity duration-200">
        {/* Image thumbnail (if available) */}
        {imageUrl && (
          <div className="relative w-full md:w-80 h-56 md:h-60 flex-shrink-0 bg-near-white overflow-hidden">
            <img
              src={imageUrl}
              alt={`${title} exhibition view`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {/* Year badge - prominent display */}
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-black text-white font-body text-sm font-semibold">
              {exhibition.year}
            </span>
            <span className="font-body text-sm text-mid-gray uppercase tracking-wide">
              {typeLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-black group-hover:text-dark-gray transition-colors">
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
          {exhibition.featuredArtworks && exhibition.featuredArtworks.length > 0 && (
            <p className="font-body text-sm text-mid-gray">
              {exhibition.featuredArtworks.length} {exhibition.featuredArtworks.length === 1 ? 'artwork' : 'artworks'} featured
            </p>
          )}

          {/* CTA Link */}
          <div className="font-body text-sm md:text-base text-black group-hover:text-dark-gray transition-colors mt-2">
            View Exhibition →
          </div>
        </div>
        </div>
      </Link>
    </article>
  );
}
