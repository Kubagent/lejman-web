import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ExhibitionDetail from '@/components/ExhibitionDetail';
import { mockExhibitions, mockArtworks } from '@/lib/mockData';

interface ExhibitionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all exhibitions
 * This enables static generation at build time for all exhibition pages
 */
export async function generateStaticParams() {
  return mockExhibitions.map((exhibition) => ({
    slug: exhibition.slug.current,
  }));
}

/**
 * Generate metadata for SEO
 * Each exhibition page gets optimized title and description
 */
export async function generateMetadata({
  params,
}: ExhibitionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exhibition = mockExhibitions.find(
    (ex) => ex.slug.current === slug
  );

  if (!exhibition) {
    return {
      title: 'Exhibition Not Found',
    };
  }

  const title = exhibition.title.en ?? 'Untitled Exhibition';
  const description = exhibition.description?.en ?? '';
  const venue = exhibition.venue.name.en ?? '';
  const location = `${exhibition.venue.city}, ${exhibition.venue.country}`;

  return {
    title: `${title} - ${exhibition.year}`,
    description: description || `${title} at ${venue}, ${location}`,
    openGraph: {
      title: `${title} - Dominik L.`,
      description: description,
      type: 'article',
      images: exhibition.mainImage
        ? [
            {
              url: exhibition.mainImage.asset._ref.startsWith('http')
                ? exhibition.mainImage.asset._ref
                : '', // In production, generate proper Sanity URL
              alt: `${title} exhibition view`,
            },
          ]
        : [],
    },
  };
}

/**
 * Exhibition Detail Page
 *
 * Dynamic route: /exhibitions/[slug]
 *
 * Displays complete exhibition information including:
 * - High-resolution images and gallery
 * - Full exhibition metadata and description
 * - Featured artworks with links
 * - Installation views
 *
 * SEO: Each page has optimized metadata for search engines and social sharing
 * Performance: Static generation at build time with Next.js App Router
 */
export default async function ExhibitionPage({ params }: ExhibitionPageProps) {
  const { slug } = await params;

  // Find the exhibition by slug
  const exhibition = mockExhibitions.find(
    (ex) => ex.slug.current === slug
  );

  // Show 404 if exhibition doesn't exist
  if (!exhibition) {
    notFound();
  }

  // Get featured artworks if they exist
  const featuredArtworks = exhibition.featuredArtworks
    ? exhibition.featuredArtworks
        .map((artworkId) => mockArtworks.find((art) => art._id === artworkId))
        .filter((art) => art !== undefined)
    : [];

  return (
    <ExhibitionDetail
      exhibition={exhibition}
      featuredArtworks={featuredArtworks}
      locale="en"
    />
  );
}
