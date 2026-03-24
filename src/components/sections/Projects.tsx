'use client';

import { useState, useEffect } from 'react';
import Section from '../Section';
import Link from 'next/link';
import { Github, Loader2 } from 'lucide-react';
import ProjectCard from '../ProjectCard';
import { portfolioConfig } from '@/config/portfolio';

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
  github: string;
}

const Projects = () => {
  const { title, subtitle, items: staticItems, githubLink } = portfolioConfig.projects;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(staticItems);
        }
      } catch (err) {
        console.error('Failed to fetch projects, using static data', err);
        setProjects(staticItems);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [staticItems]);

  return (
    <Section
      id="projects"
      title={title}
      subtitle={subtitle}
    >
      {loading ? (
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
      
      <div className="mt-20 text-center">
        <Link
          href={githubLink}
          target="_blank"
          className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold inline-flex items-center gap-3 backdrop-blur-sm group"
        >
          <Github size={24} className="group-hover:rotate-12 transition-transform" />
          More Projects on GitHub
        </Link>
      </div>
    </Section>
  );
};

export default Projects;
