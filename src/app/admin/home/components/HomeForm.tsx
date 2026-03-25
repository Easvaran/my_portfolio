'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { optimizeImage } from '@/lib/image-optimizer';

interface HomeFormProps {
  initialData: {
    name: string;
    title: string;
    subtitle: string;
    description: string;
    ctaPrimaryText: string;
    ctaPrimaryHref: string;
    ctaSecondaryText: string;
    ctaSecondaryHref: string;
    profileImage: string;
  };
}

const HomeForm = ({ initialData }: HomeFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData.profileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit } = useForm({
    defaultValues: initialData
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = useCallback(async (data: any) => {
    setSubmitting(true);
    setMessage(null);

    let finalImageUrl = initialData.profileImage;

    // Convert file to Base64 if a new file is selected
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image is too large (max 4MB).' });
        setSubmitting(false);
        return;
      }

      try {
        finalImageUrl = await optimizeImage(selectedFile, 1200, 1200, 0.7);
      } catch (err) {
        setMessage({ type: 'error', text: 'Image processing failed.' });
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      section: 'hero',
      data: {
        name: data.name,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        ctaPrimary: { text: data.ctaPrimaryText, href: data.ctaPrimaryHref },
        ctaSecondary: { text: data.ctaSecondaryText, href: data.ctaSecondaryHref },
        profileImage: finalImageUrl
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
        setMessage({ type: 'success', text: 'Home section updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Failed to update home section' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSubmitting(false);
    }
  }, [password, router, selectedFile, initialData.profileImage]);

  return (
    <div className="space-y-8">
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{message.text}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                <input type="text" {...register('name')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</label>
                <input type="text" {...register('title')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Image</label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-2 border-primary/20 mx-auto">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-primary/50 cursor-pointer transition-all">
                  <Upload size={24} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Catchy Subtitle</label>
              <input type="text" {...register('subtitle')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
              <textarea rows={4} {...register('description')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8">Call to Action Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Button</label>
              <input placeholder="Text" type="text" {...register('ctaPrimaryText')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
              <input placeholder="Link" type="text" {...register('ctaPrimaryHref')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secondary Button</label>
              <input placeholder="Text" type="text" {...register('ctaSecondaryText')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
              <input placeholder="Link" type="text" {...register('ctaSecondaryHref')} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white transition-all" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(HomeForm);
