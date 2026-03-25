'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const SkillCategories = dynamic(() => import('./SkillCategories'), { 
  ssr: false,
  loading: () => <div className="p-8 rounded-[40px] bg-card/50 h-64 animate-pulse border border-white/10" />
});

interface SkillsFormProps {
  initialData: {
    title: string;
    subtitle: string;
    categories: any[];
  };
}

const SkillsForm = ({ initialData }: SkillsFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  // Prepare initial data for React Hook Form
  const preparedData = {
    ...initialData,
    categories: initialData.categories.map(cat => ({
      ...cat,
      skills_raw: Array.isArray(cat.skills) ? cat.skills.join(', ') : ''
    }))
  };

  const { register, handleSubmit, control } = useForm({
    defaultValues: preparedData
  });

  const onSubmit = useCallback(async (data: any) => {
    setSubmitting(true);
    setMessage(null);

    // Convert skills_raw back to skills array
    const processedCategories = data.categories.map((cat: any) => ({
      ...cat,
      skills: cat.skills_raw.split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
      skills_raw: undefined // Remove helper field
    }));

    const payload = {
      section: 'skills',
      data: {
        title: data.title,
        subtitle: data.subtitle,
        categories: processedCategories
      },
      password
    };

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Skills section updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Failed to update skills section' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSubmitting(false);
    }
  }, [password, router]);

  return (
    <div className="space-y-8">
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{message.text}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Title</label>
            <input 
              type="text" 
              {...register('title')} 
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Subtitle</label>
            <input 
              type="text" 
              {...register('subtitle')} 
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all font-bold" 
            />
          </div>
        </div>

        <SkillCategories control={control} register={register} />

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={submitting} 
            className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(SkillsForm);
