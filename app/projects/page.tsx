import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';
import { getProjects, getProjectYears } from '@/lib/sanity/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Exhibitions and projects by Dominik Lejman. Solo shows, group exhibitions, and institutional collaborations featuring video painting and time-based media installations.',
  openGraph: {
    title: 'Projects - Dominik Lejman',
    description: 'Exhibitions and projects by visual artist Dominik Lejman.',
    type: 'website',
  },
};

/**
 * Projects Page - Server Component
 *
 * Fetches projects and filter data from Sanity CMS
 * Delegates rendering and interactivity to ProjectsClient
 */
export default async function ProjectsPage() {
  // Fetch all projects and available years for filters
  const [projects, years] = await Promise.all([
    getProjects(),
    getProjectYears()
  ]);

  return <ProjectsClient projects={projects} years={years} />;
}
