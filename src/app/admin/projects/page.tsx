import React from 'react';
import { getInitialContent, getInitialProjects } from '@/lib/data-fetchers';
import ProjectsHeader from './components/ProjectsHeader';
import ProjectsManager from './components/ProjectsManager';

export const dynamic = 'force-dynamic';

export default async function ProjectsSettings() {
  const content = await getInitialContent();
  const projects = await getInitialProjects();
  
  const sectionData = {
    title: content.projects?.title || 'Featured Projects',
    subtitle: content.projects?.subtitle || 'A collection of my work'
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <ProjectsHeader />
      <ProjectsManager initialProjects={projects} sectionData={sectionData} />
    </div>
  );
}
