'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Github, 
  Loader2,
  Image as ImageIcon,
  Tag,
  Type,
  Layout,
  Briefcase,
  Users,
  MessageSquare,
  X,
  Settings,
  LayoutDashboard,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  ArrowLeft
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
  github: string;
  order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    live: '',
    github: '',
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!adminPassword) {
      setError('System configuration error: NEXT_PUBLIC_ADMIN_PASSWORD is not defined.');
      setLoading(false);
      return;
    }

    if (!password || password !== adminPassword) {
      router.push('/admin/login');
      return;
    }
    fetchProjects();
  }, [password, router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      
      if (!res.ok) {
        const text = await res.text().catch(() => 'No response body');
        let errorData: any;
        
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { message: text };
        }

        console.error('API Error:', res.status, errorData);
        setProjects([]);
        setError(errorData.message || errorData.error || `Error ${res.status}`);
        return;
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProjects(data);
        setError(null);
      } else {
        console.error('API response is not an array:', data);
        setProjects([]);
        setError(data.error || 'Failed to fetch projects. API did not return an array.');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('An error occurred while fetching projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: '',
      live: '',
      github: '',
      order: Array.isArray(projects) ? projects.length : 0
    });
    setSelectedFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      live: project.live,
      github: project.github,
      order: project.order
    });
    setSelectedFile(null);
    setImagePreview(project.image);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let finalImageUrl = formData.image;

    // Upload image if a new file is selected
    if (selectedFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          finalImageUrl = uploadData.url;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setError('Image upload failed. Please try again.');
        setSubmitting(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      ...formData,
      image: finalImageUrl,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      password
    };

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject._id}` 
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}?password=${password}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      
      <main className="flex-grow p-6 md:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm font-bold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          {/* Header with Search and Profile */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/20">
                <Briefcase size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Projects Management</h1>
                <p className="text-muted-foreground text-sm font-medium">Curate and refine your digital portfolio showcase</p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center gap-4 shadow-xl shadow-red-500/5"
            >
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <X size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-grow">
                <p className="font-black text-sm uppercase tracking-widest">Operational Error</p>
                <p className="text-xs font-bold opacity-80 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Projects Management Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-card/30 p-8 rounded-[40px] border border-white/5">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Project List</h2>
              <p className="text-muted-foreground mt-2 font-medium">Manage all your projects from here</p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-3 px-10 py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 group"
            >
              <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              Create New Showcase
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.isArray(projects) && projects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={project._id}
                className="p-6 rounded-[48px] bg-card border border-white/10 backdrop-blur-sm group hover:border-primary/50 transition-all duration-500 shadow-2xl shadow-black/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                  <button onClick={() => openEditModal(project)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all hover:scale-110 shadow-xl border border-white/10">
                    <Edit3 size={18} strokeWidth={2.5} />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-2xl text-red-400 transition-all hover:scale-110 shadow-xl border border-red-500/10">
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="relative h-60 rounded-[32px] overflow-hidden mb-8 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center">
                      <a href={project.live} target="_blank" className="px-5 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all">
                        Live Preview
                      </a>
                      <a href={project.github} target="_blank" className="p-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/10">
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-2 mb-3">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 font-medium">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {(!Array.isArray(projects) || projects.length === 0) && !loading && !error && (
            <div className="text-center py-32 bg-card/20 rounded-[64px] border border-dashed border-white/10 mt-12 shadow-inner">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                <Layout className="text-white/20" size={48} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">No projects curated yet</h2>
              <p className="text-muted-foreground mt-2 mb-10 font-medium max-w-sm mx-auto leading-relaxed">Your digital gallery is empty. Let's start by adding your first masterpiece showcase.</p>
              <button
                onClick={openAddModal}
                className="px-12 py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95"
              >
                Create First Showcase
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-white/10 rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh]">
                <h2 className="text-3xl font-black text-white mb-8">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                        <Type size={14} /> Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                        placeholder="Project Title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                        <ImageIcon size={14} /> Project Image
                      </label>
                      
                      <div className="space-y-4">
                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative h-32 w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => { setSelectedFile(null); setImagePreview(''); setFormData({...formData, image: ''}); }}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                            <Upload size={18} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Upload File</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                          
                          <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                              <LinkIcon size={14} />
                            </div>
                            <input
                              type="text"
                              value={formData.image}
                              onChange={(e) => { setFormData({ ...formData, image: e.target.value }); setImagePreview(e.target.value); }}
                              className="w-full h-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs text-white"
                              placeholder="Or paste URL..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                      <Layout size={14} /> Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white min-h-[120px]"
                      placeholder="Project details..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                      <Tag size={14} /> Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                      placeholder="React, Next.js, Tailwind..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                        <ExternalLink size={14} /> Live Link
                      </label>
                      <input
                        type="text"
                        value={formData.live}
                        onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                        <Github size={14} /> GitHub Link
                      </label>
                      <input
                        type="text"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                        placeholder="https://github.com/..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                    >
                      {(submitting || uploading) && <Loader2 className="animate-spin" size={20} />}
                      {uploading ? 'Uploading...' : editingProject ? 'Save Changes' : 'Publish Project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
