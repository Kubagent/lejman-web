import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtworkBySlug, getArtworks } from '@/lib/sanity/artworks';
import ArtworkDetail from '@/components/ArtworkDetail';

interface ArtworkPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static params for all artworks
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((artwork) => ({
    slug: artwork.slug.current,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {
      title: 'Artwork Not Found',
    };
  }

  const title = artwork.title.en ?? 'Untitled';
  const medium = artwork.medium.en ?? '';
  const description = artwork.description?.en ?? `${title}, ${artwork.year}. ${medium}`;

  return {
    title: `${title} (${artwork.year}) - Dominik L.`,
    description: description,
    openGraph: {
      title: `${title} (${artwork.year})`,
      description: description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} (${artwork.year})`,
      description: description,
    },
  };
}

/**
 * Individual Artwork Detail Page
 *
 * Route: /works/[slug]
 *
 * Features:
 * - Dynamic routing by artwork slug
 * - High-resolution image display (max 960px desktop)
 * - Complete artwork metadata
 * - Lightbox mode for full-screen viewing
 * - SEO optimized with metadata
 * - 404 handling for invalid slugs
 * - Static generation at build time
 * - Real Sanity CMS data
 */
export default async function ArtworkPage({ params }: ArtworkPageProps) {
  // Fetch artwork by slug from Sanity
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  // Return 404 if artwork not found
  if (!artwork) {
    notFound();
  }

  // TODO: Get locale from context/URL params when i18n is implemented
  const locale = 'en';

  return (
    <ArtworkDetail artwork={artwork} locale={locale} />
  );
}
