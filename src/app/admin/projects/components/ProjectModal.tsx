'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Upload, Type, Tag, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { optimizeImage } from '@/lib/image-optimizer';
import ImageAdjuster from '@/components/ImageAdjuster';
import { Maximize2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any | null;
  onSuccess: () => void;
  nextOrder: number;
}

const ProjectModal = ({ isOpen, onClose, project, onSuccess, nextOrder }: ProjectModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAdjuster, setShowAdjuster] = useState(false);
  
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.tags.join(', '),
        live: project.live,
        order: project.order
      });
      setImagePreview(project.image);
    } else {
      reset({
        title: '',
        description: '',
        image: '',
        tags: '',
        live: '',
        order: nextOrder
      });
      setImagePreview('');
    }
    setSelectedFile(null);
    setError(null);
    setShowAdjuster(false);
  }, [project, reset, nextOrder]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const optimized = await optimizeImage(file, 1200, 1200, 0.7);
      setImagePreview(optimized);
      setSelectedFile(file);
    }
  };

  const handleAdjustedImage = (base64: string) => {
    setImagePreview(base64);
    setShowAdjuster(false);
    setSelectedFile(null);
  };

  const onSubmit = async (data: any) => {
    setError(null);
    setSubmitting(true);

    let finalImageUrl = imagePreview;

    if (!finalImageUrl) {
      setError('Please provide a project image.');
      setSubmitting(false);
      return;
    }

    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError('Image is too large (max 4MB).');
        setSubmitting(false);
        return;
      }

      setUploading(true);
      try {
        finalImageUrl = await optimizeImage(selectedFile, 1200, 1200, 0.7);
      } catch (err) {
        setError('Image processing failed.');
        setSubmitting(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      ...data,
      image: finalImageUrl,
      tags: data.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== ''),
      password
    };

    try {
      const url = project ? `/api/projects/${project._id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to save project.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-white/10 rounded-[48px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {project ? 'Edit Project' : 'New Project'}
                  </h2>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Showcase your masterpiece</p>
                </div>
                <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                  <AlertCircle size={18} />
                  <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input type="text" {...register('title')} required className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold" placeholder="My Awesome Project" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tags (comma separated)</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input type="text" {...register('tags')} className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-medium" placeholder="Next.js, Tailwind, MongoDB" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image</label>
                    <div className="relative group aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                      {imagePreview ? (
                        <>
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button 
                              type="button"
                              onClick={() => setShowAdjuster(true)}
                              className="p-4 rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                            >
                              <Maximize2 size={24} />
                            </button>
                            <label className="p-4 rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 cursor-pointer">
                              <Upload size={24} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2 cursor-pointer hover:bg-white/5 transition-all">
                          <Upload size={32} />
                          <span className="text-[10px] font-black uppercase">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showAdjuster && imagePreview && (
                    <ImageAdjuster 
                      imageSrc={imagePreview}
                      onConfirm={handleAdjustedImage}
                      onCancel={() => setShowAdjuster(false)}
                      aspectRatio={16/9}
                      circular={false}
                    />
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Description</label>
                  <textarea rows={4} {...register('description')} required className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white leading-relaxed" placeholder="Tell the world about your project..." />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Live Demo URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input type="url" {...register('live')} className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" placeholder="https://..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting || uploading} className="flex-[2] py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>{project ? 'Update Project' : 'Publish Project'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ProjectModal);
