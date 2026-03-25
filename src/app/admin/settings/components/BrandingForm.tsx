'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Globe, Save, Loader2, Upload, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { optimizeImage } from '@/lib/image-optimizer';
import { useRouter } from 'next/navigation';
import ImageAdjuster from '@/components/ImageAdjuster';
import { AnimatePresence } from 'framer-motion';

interface BrandingFormProps {
  initialData: {
    logo: string;
    heading: string;
  };
}

const BrandingForm = ({ initialData }: BrandingFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(initialData.logo);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialData
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImage(file, 400, 400, 0.8);
      setLogoPreview(optimized);
      setValue('logo', optimized);
    } catch (err) {
      console.error('Logo processing failed:', err);
    }
  };

  const handleAdjustedLogo = (base64: string) => {
    setLogoPreview(base64);
    setValue('logo', base64);
    setShowAdjuster(false);
  };

  const onSubmit = useCallback(async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'branding',
          data,
          password
        })
      });

      if (res.ok) {
        alert('Branding updated successfully!');
        router.refresh();
      } else {
        alert('Failed to update branding.');
      }
    } catch (err) {
      console.error('Branding save error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [password]);

  return (
    <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
      
      <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
        <Globe size={20} className="text-primary" />
        Global Branding
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Website Title (Heading)</label>
              <input 
                type="text" 
                {...register('heading')}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold transition-all" 
                placeholder="e.g. MY PORTFOLIO"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Favicon / Logo</label>
            <div className="flex items-center gap-6">
              {logoPreview && (
                <div className="relative group shrink-0">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                    <Image src={logoPreview} alt="Logo" width={60} height={60} className="object-contain" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowAdjuster(true)}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
              )}
              <label className="flex-grow flex items-center justify-center gap-3 px-6 py-6 rounded-3xl bg-white/5 border border-dashed border-white/20 hover:border-primary/50 cursor-pointer transition-all group/upload">
                <Upload size={20} className="text-primary group-hover/upload:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Icon</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAdjuster && logoPreview && (
            <ImageAdjuster 
              imageSrc={logoPreview}
              onConfirm={handleAdjustedLogo}
              onCancel={() => setShowAdjuster(false)}
              circular={false}
            />
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Update Branding
        </button>
      </form>
    </div>
  );
};

export default React.memo(BrandingForm);
