import ProjectsClient from './ProjectsClient';
import { getProjects, getProjectYears } from '@/lib/sanity/projects';

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
