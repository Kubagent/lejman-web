import { client } from './client';
import { Project, ProjectFilters } from '../types';

/**
 * Fetch all projects with optional filtering
 *
 * @param filters - Optional filters (year, type, search)
 * @returns Array of projects sorted by start date (descending)
 */
export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const conditions: string[] = [];

    // Year filter
    if (filters?.year) {
      conditions.push(`year == ${filters.year}`);
    }

    // Type filter
    if (filters?.type && filters.type !== 'all') {
      conditions.push(`type == "${filters.type}"`);
    }

    // Search filter (title and venue across all languages)
    if (filters?.search && filters.search.length >= 2) {
      const searchTerm = filters.search.toLowerCase();
      conditions.push(
        `(lower(title.en) match "*${searchTerm}*" || lower(title.de) match "*${searchTerm}*" || lower(title.pl) match "*${searchTerm}*" || lower(venue.name.en) match "*${searchTerm}*" || lower(venue.name.de) match "*${searchTerm}*" || lower(venue.name.pl) match "*${searchTerm}*")`
      );
    }

    const filterClause = conditions.length > 0 ? ` && ${conditions.join(' && ')}` : '';

    const query = `*[_type == "project"${filterClause}] | order(order asc, isOngoing desc, startDate desc, year desc) {
      _id,
      title,
      slug,
      year,
      startDate,
      endDate,
      isOngoing,
      type,
      venue,
      location,
      description,
      images[]{
        asset->,
        hotspot,
        crop
      },
      artworks[]->{ _id, title }
    }`;

    const projects = await client.fetch<Project[]>(query);
    return projects || [];
  } catch (error) {
    console.error('[getProjects] Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by slug
 *
 * @param slug - Project slug
 * @returns Single project or null if not found
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      year,
      startDate,
      endDate,
      isOngoing,
      type,
      venue,
      location,
      description,
      images[]{
        asset->,
        hotspot,
        crop
      },
      videos[]{
        _type,
        asset->
      },
      featuredArtworks,
      artworks[]->{ _id, title, slug, year, mainImage, images }
    }`;

    const project = await client.fetch<Project | null>(query, { slug });
    return project;
  } catch (error) {
    console.error('[getProjectBySlug] Error fetching project:', error);
    return null;
  }
}

/**
 * Get all unique years from projects (for filter dropdown)
 *
 * @returns Array of years sorted descending
 */
export async function getProjectYears(): Promise<number[]> {
  try {
    const query = `*[_type == "project"].year | order(@desc)`;
    const years = await client.fetch<number[]>(query);
    // Remove duplicates and return
    return Array.from(new Set(years)).sort((a, b) => b - a);
  } catch (error) {
    console.error('[getProjectYears] Error fetching years:', error);
    return [];
  }
}
