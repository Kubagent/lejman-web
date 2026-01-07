import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProjectDetail from '@/components/ProjectDetail';
import { getProjectBySlug } from '@/lib/sanity/projects';
import { client } from '@/lib/sanity/client';
import { Artwork } from '@/lib/types';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all projects
 * This enables static generation at build time for all project pages
 */
export async function generateStaticParams() {
  const projects = await client.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "project"]{ slug }`
  );

  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

/**
 * Generate metadata for SEO
 * Each project page gets optimized title and description
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = project.title.en ?? 'Untitled Project';
  const description = project.description?.en ?? '';
  const venue = project.venue?.en ?? '';
  const location = project.location ?? '';

  return {
    title: `${title} - ${project.year}`,
    description: description || `${title} at ${venue}, ${location}`,
    openGraph: {
      title: `${title} - Dominik L.`,
      description: description,
      type: 'article',
    },
  };
}

/**
 * Project Detail Page
 *
 * Dynamic route: /projects/[slug]
 *
 * Displays complete project information including:
 * - High-resolution images and gallery
 * - Full project metadata and description
 * - Featured artworks with links
 * - Installation views
 *
 * SEO: Each page has optimized metadata for search engines and social sharing
 * Performance: Static generation at build time with Next.js App Router
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Find the project by slug
  const project = await getProjectBySlug(slug);

  // Show 404 if project doesn't exist
  if (!project) {
    notFound();
  }

  // Get featured artworks if they exist
  const featuredArtworks: Artwork[] = project.featuredArtworks
    ? await client.fetch<Artwork[]>(
        `*[_type == "artwork" && _id in $ids]{ _id, title, slug, year, mainImage, images }`,
        { ids: project.featuredArtworks }
      )
    : [];

  return (
    <ProjectDetail
      project={project}
      featuredArtworks={featuredArtworks}
      locale="en"
    />
  );
}
