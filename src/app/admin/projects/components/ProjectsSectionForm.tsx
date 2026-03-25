'use client';

import React, { useState, useCallback } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProjectsSectionFormProps {
  initialData: {
    title: string;
    subtitle: string;
    githubLink: string;
  };
}

const ProjectsSectionForm = ({ initialData }: ProjectsSectionFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit } = useForm({
    defaultValues: initialData
  });

  const onSubmit = useCallback(async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'projects',
          data,
          password
        })
      });
      if (res.ok) {
        alert('Section updated successfully!');
      } else {
        alert('Failed to update section.');
      }
    } catch (err) {
      console.error('Error saving section data:', err);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  }, [password]);

  return (
    <div className="mb-12 p-8 rounded-[40px] bg-card/50 border border-white/10 shadow-2xl backdrop-blur-sm">
      <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
        <Settings size={20} className="text-primary" />
        Section Details
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Title</label>
            <input 
              type="text" 
              {...register('title')}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold" 
              placeholder="e.g. Featured Projects"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">GitHub Profile Link</label>
            <input 
              type="text" 
              {...register('githubLink')}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold" 
              placeholder="e.g. https://github.com/yourusername"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Subtitle</label>
            <textarea 
              rows={2}
              {...register('subtitle')}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-medium" 
              placeholder="A brief description of your projects section"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 active:scale-95 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Update Section Text
        </button>
      </form>
    </div>
  );
};

export default React.memo(ProjectsSectionForm);
