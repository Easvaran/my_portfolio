'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import ProjectsSectionForm from './ProjectsSectionForm';
import ProjectsList from './ProjectsList';
import ProjectModal from './ProjectModal';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
  order: number;
}

interface ProjectsManagerProps {
  initialProjects: Project[];
  sectionData: {
    title: string;
    subtitle: string;
  };
}

const ProjectsManager = ({ initialProjects, sectionData }: ProjectsManagerProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}?password=${password}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      alert('An error occurred.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-12">
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      <ProjectsSectionForm initialData={sectionData} />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Project Showcases</h2>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Published
            </p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus size={18} /> Create New
          </button>
        </div>

        <ProjectsList 
          projects={projects} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      <ProjectModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        project={editingProject} 
        onSuccess={fetchProjects}
        nextOrder={projects.length}
      />
    </div>
  );
};

export default React.memo(ProjectsManager);
