'use client';

import React from 'react';
import Image from 'next/image';
import { Edit3, Trash2, ExternalLink } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
  order: number;
}

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectsList = ({ projects, onEdit, onDelete }: ProjectsListProps) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20 bg-card border border-white/10 rounded-[48px]">
        <p className="text-muted-foreground font-medium">No projects found.</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Start by creating your first showcase!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project) => (
        <div key={project._id} className="group relative bg-card border border-white/10 rounded-[40px] overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-2xl">
          <div className="aspect-video relative overflow-hidden">
            <Image 
              src={project.image} 
              alt={project.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
            
            {/* Project Quick Actions */}
            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <button 
                onClick={() => onEdit(project)}
                className="p-3 rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => onDelete(project._id)}
                className="p-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {tag}
                </span>
              ))}
            </div>
            
            <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 font-medium leading-relaxed">
              {project.description}
            </p>

            <div className="flex gap-4 pt-4">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProjectsList);
