import { client } from './client';
import { Artwork, ArtworkFilters } from '../types';

/**
 * Build GROQ query for artworks with optional filters
 *
 * Supports:
 * - Year filtering
 * - Medium filtering
 * - Title search (searches across all languages)
 */
function buildArtworkQuery(filters?: ArtworkFilters): string {
  const conditions: string[] = [];

  // Year filter
  if (filters?.year) {
    conditions.push(`year == ${filters.year}`);
  }

  // Medium filter (searches across all language variants)
  if (filters?.medium) {
    conditions.push(
      `(medium.en match "${filters.medium}" || medium.de match "${filters.medium}" || medium.pl match "${filters.medium}")`
    );
  }

  // Title search (searches across all language variants)
  if (filters?.search && filters.search.length >= 2) {
    const searchTerm = filters.search.toLowerCase();
    conditions.push(
      `(lower(title.en) match "*${searchTerm}*" || lower(title.de) match "*${searchTerm}*" || lower(title.pl) match "*${searchTerm}*")`
    );
  }

  const filterClause = conditions.length > 0 ? ` && ${conditions.join(' && ')}` : '';

  return `*[_type == "artwork"${filterClause}] | order(year desc, title.en asc) {
    _id,
    title,
    slug,
    year,
    medium,
    dimensions,
    mainImage,
    images,
    description,
    featured,
    exhibitions[]->{ _id, title }
  }`;
}

/**
 * Fetch all artworks with optional filtering
 *
 * @param filters - Optional filters (year, medium, search)
 * @returns Array of artworks sorted by year (descending) then title (ascending)
 */
export async function getArtworks(filters?: ArtworkFilters): Promise<Artwork[]> {
  try {
    const query = buildArtworkQuery(filters);
    const artworks = await client.fetch<Artwork[]>(query);
    return artworks || [];
  } catch (error) {
    console.error('[getArtworks] Error fetching artworks:', error);
    return [];
  }
}

/**
 * Fetch a single artwork by slug
 *
 * @param slug - Artwork slug
 * @returns Single artwork or null if not found
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  try {
    const query = `*[_type == "artwork" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      year,
      medium,
      dimensions,
      mainImage,
      images,
      description,
      featured,
      exhibitions[]->{ _id, title, year, venue }
    }`;

    const artwork = await client.fetch<Artwork | null>(query, { slug });
    return artwork;
  } catch (error) {
    console.error('[getArtworkBySlug] Error fetching artwork:', error);
    return null;
  }
}

/**
 * Get all unique years from artworks (for filter dropdown)
 *
 * @returns Array of years sorted descending
 */
export async function getArtworkYears(): Promise<number[]> {
  try {
    const query = `*[_type == "artwork"].year | order(@desc)`;
    const years = await client.fetch<number[]>(query);
    // Remove duplicates and return
    return Array.from(new Set(years)).sort((a, b) => b - a);
  } catch (error) {
    console.error('[getArtworkYears] Error fetching years:', error);
    return [];
  }
}

/**
 * Get all unique mediums from artworks (for filter dropdown)
 * Returns English versions only for simplicity
 *
 * @returns Array of medium names sorted alphabetically
 */
export async function getArtworkMediums(): Promise<string[]> {
  try {
    const query = `*[_type == "artwork"].medium.en | order(@asc)`;
    const mediums = await client.fetch<string[]>(query);
    // Remove duplicates and empty values
    return Array.from(new Set(mediums.filter(Boolean))).sort();
  } catch (error) {
    console.error('[getArtworkMediums] Error fetching mediums:', error);
    return [];
  }
}

/**
 * Get featured artworks (for homepage or highlights section)
 *
 * @param limit - Maximum number of featured artworks to return (default: 6)
 * @returns Array of featured artworks
 */
export async function getFeaturedArtworks(limit: number = 6): Promise<Artwork[]> {
  try {
    const query = `*[_type == "artwork" && featured == true] | order(year desc) [0...${limit}] {
      _id,
      title,
      slug,
      year,
      medium,
      mainImage,
      featured
    }`;

    const artworks = await client.fetch<Artwork[]>(query);
    return artworks || [];
  } catch (error) {
    console.error('[getFeaturedArtworks] Error fetching featured artworks:', error);
    return [];
  }
}
