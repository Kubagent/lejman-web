'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Exhibition, Artwork } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';
import Lightbox from './Lightbox';

interface ExhibitionDetailProps {
  exhibition: Exhibition;
  featuredArtworks?: Artwork[];
  locale?: 'en' | 'de' | 'pl';
}

/**
 * ExhibitionDetail - Complete exhibition display with images and metadata
 *
 * Features:
 * - High-resolution main image and gallery
 * - Complete metadata: title, dates, venue, type, description
 * - Lightbox viewer for installation images
 * - Featured artworks section with links
 * - Localized content support
 * - Back to exhibitions list link
 * - Institutional "white cube" aesthetic
 *
 * Layout:
 * - Mobile: Edge-to-edge images, 24px padding for text
 * - Tablet: 48px margins
 * - Desktop: Max 1200px width, 96px margins
 *
 * Accessibility:
 * - Semantic HTML structure
 * - Descriptive alt text
 * - Keyboard navigation
 * - ARIA labels
 */
export default function ExhibitionDetail({
  exhibition,
  featuredArtworks = [],
  locale = 'en'
}: ExhibitionDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get localized content
  const title = exhibition.title[locale] ?? exhibition.title.en ?? 'Untitled Exhibition';
  const venueName = exhibition.venue.name[locale] ?? exhibition.venue.name.en ?? '';
  const description = exhibition.description?.[locale] ?? exhibition.description?.en;

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const dateRange = exhibition.startDate && exhibition.endDate
    ? `${formatDate(exhibition.startDate)} – ${formatDate(exhibition.endDate)}`
    : exhibition.year.toString();

  // Format exhibition type
  const typeLabels = {
    solo: { en: 'Solo Exhibition', de: 'Einzelausstellung', pl: 'Wystawa indywidualna' },
    group: { en: 'Group Exhibition', de: 'Gruppenausstellung', pl: 'Wystawa zbiorowa' },
    institutional: { en: 'Institutional Exhibition', de: 'Institutionelle Ausstellung', pl: 'Wystawa instytucjonalna' }
  };
  const typeLabel = typeLabels[exhibition.type][locale] ?? typeLabels[exhibition.type].en;

  // Prepare all images (main + additional)
  const allImages = exhibition.mainImage
    ? [exhibition.mainImage, ...(exhibition.images || [])]
    : (exhibition.images || []);

  // Generate optimized image URLs
  const getImageUrl = (image: typeof exhibition.mainImage, width: number) => {
    if (!image) return '';

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

  // Main image URL (1200px for desktop)
  const mainImageUrl = exhibition.mainImage ? getImageUrl(exhibition.mainImage, 1200) : '';

  // Lightbox images
  const lightboxImages = allImages.map((image, index) => ({
    url: getImageUrl(image, 1920),
    alt: `${title} - Installation view ${index + 1}`,
    title: title,
    year: exhibition.year
  }));

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Back to Exhibitions Link */}
      <div className="px-6 py-6 md:px-12 md:py-8 lg:px-24">
        <Link
          href="/exhibitions"
          className="inline-flex items-center text-dark-gray hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-focus rounded"
          aria-label="Back to exhibitions list"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Exhibitions
        </Link>
      </div>

      {/* Main Exhibition Content */}
      <article className="pb-16 md:pb-24">
        {/* Main Image */}
        {mainImageUrl && (
          <div className="w-full mb-8 md:mb-12 lg:mb-16">
            <button
              onClick={() => openLightbox(0)}
              className="relative block w-full group cursor-zoom-in focus:outline-none focus:ring-4 focus:ring-focus"
              aria-label={`View ${title} in fullscreen`}
            >
              <img
                src={mainImageUrl}
                alt={`${title} - Exhibition view`}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                loading="eager"
              />
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-4 py-2 rounded text-sm text-dark-gray">
                  Click to view fullscreen
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Exhibition Metadata */}
        <div className="px-6 md:px-12 lg:px-24 max-w-4xl">
          {/* Title and Year */}
          <header className="mb-8 md:mb-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-4">
              {title}
            </h1>
            <div className="text-lg md:text-xl text-dark-gray">
              {exhibition.year}
            </div>
          </header>

          {/* Exhibition Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            {/* Type */}
            <div>
              <dt className="text-sm uppercase tracking-wide text-mid-gray mb-1">
                Exhibition Type
              </dt>
              <dd className="text-base md:text-lg text-dark-gray">
                {typeLabel}
              </dd>
            </div>

            {/* Dates */}
            <div>
              <dt className="text-sm uppercase tracking-wide text-mid-gray mb-1">
                Dates
              </dt>
              <dd className="text-base md:text-lg text-dark-gray">
                {dateRange}
              </dd>
            </div>

            {/* Venue */}
            <div>
              <dt className="text-sm uppercase tracking-wide text-mid-gray mb-1">
                Venue
              </dt>
              <dd className="text-base md:text-lg text-dark-gray">
                {venueName}
              </dd>
            </div>

            {/* Location */}
            <div>
              <dt className="text-sm uppercase tracking-wide text-mid-gray mb-1">
                Location
              </dt>
              <dd className="text-base md:text-lg text-dark-gray">
                {exhibition.venue.city}, {exhibition.venue.country}
              </dd>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-sm uppercase tracking-wide text-mid-gray mb-4">
                About the Exhibition
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-base md:text-lg leading-relaxed text-dark-gray whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Featured Artworks */}
          {featuredArtworks && featuredArtworks.length > 0 && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-black mb-6 md:mb-8">
                Featured Artworks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredArtworks.map((artwork) => {
                  const artworkTitle = artwork.title[locale] ?? artwork.title.en ?? 'Untitled';
                  const artworkImageUrl = artwork.mainImage.asset._ref.startsWith('http')
                    ? artwork.mainImage.asset._ref
                    : urlFor(artwork.mainImage).width(400).quality(85).auto('format').url();

                  return (
                    <Link
                      key={artwork._id}
                      href={`/works/${artwork.slug.current}`}
                      className="group block focus:outline-none focus:ring-2 focus:ring-focus rounded"
                    >
                      <div className="relative aspect-square mb-3 overflow-hidden bg-near-white">
                        <img
                          src={artworkImageUrl}
                          alt={`${artworkTitle} by Dominik L., ${artwork.year}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-black group-hover:text-dark-gray transition-colors">
                        {artworkTitle}
                      </h3>
                      <p className="text-sm text-mid-gray mt-1">
                        {artwork.year}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Images Gallery */}
          {exhibition.images && exhibition.images.length > 0 && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-black mb-6 md:mb-8">
                Installation Views
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {exhibition.images.map((image, index) => {
                  const imageUrl = getImageUrl(image, 800);
                  return (
                    <button
                      key={index}
                      onClick={() => openLightbox(index + 1)} // +1 because main image is at index 0
                      className="relative aspect-[4/3] overflow-hidden bg-near-white group cursor-pointer focus:outline-none focus:ring-2 focus:ring-focus rounded"
                      aria-label={`View installation image ${index + 1} in fullscreen`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${title} - Installation view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Back Link */}
        <div className="px-6 md:px-12 lg:px-24 mt-12 md:mt-16">
          <Link
            href="/exhibitions"
            className="inline-flex items-center text-dark-gray hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-focus rounded"
            aria-label="Back to exhibitions list"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Exhibitions
          </Link>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxImages.length > 0 && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxImages}
          initialIndex={selectedImageIndex}
        />
      )}
    </>
  );
}
