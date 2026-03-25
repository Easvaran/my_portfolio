'use client';

import { useState, useEffect } from 'react';
import Section from '../Section';
import { Loader2 } from 'lucide-react';
import ProjectCard from '../ProjectCard';
import { portfolioConfig } from '@/config/portfolio';
import { useContent } from '@/context/ContentContext';

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
}

interface ProjectsProps {
  initialProjects?: Project[];
}

const Projects = ({ initialProjects }: ProjectsProps) => {
  const { content, loading: contentLoading } = useContent();
  const { title, subtitle, items: staticItems } = content.projects || portfolioConfig.projects;
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else if (!initialProjects) {
          setProjects(staticItems || []);
        }
      } catch (err) {
        console.error('Failed to fetch projects, using static data', err);
        if (!initialProjects) {
          setProjects(staticItems || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [staticItems, initialProjects]);

  return (
    <Section
      id="projects"
      title={title}
      subtitle={subtitle}
    >
      {(loading || contentLoading) ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project._id || index} {...project} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default Projects;
