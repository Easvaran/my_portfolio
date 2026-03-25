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
    <div className="p-10 rounded-[48px] glass relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-primary/10 transition-colors" />
      
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 italic">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Globe size={24} strokeWidth={2.5} />
        </div>
        Identity Design
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Website Identity</label>
              <input 
                type="text" 
                {...register('heading')}
                className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-white font-bold transition-all placeholder:text-muted-foreground/30" 
                placeholder="e.g. PORTFOLIO"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Brand Visual</label>
            <div className="flex items-center gap-8 p-6 rounded-3xl bg-white/5 border border-white/10 group/logo transition-all hover:border-primary/30">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl flex-shrink-0 group-hover/logo:scale-105 transition-transform duration-500">
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo" fill className="object-contain p-2" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Globe size={32} />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button type="button" className="w-full px-6 py-3 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/20 flex items-center gap-2">
                    <Upload size={14} /> Replace
                  </button>
                </div>
                {logoPreview && (
                  <button 
                    type="button" 
                    onClick={() => setShowAdjuster(true)}
                    className="w-full px-6 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
                  >
                    <Maximize2 size={14} /> Adjust
                  </button>
                )}
              </div>
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

        <div className="pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Save size={20} />
                Preserve Branding
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(BrandingForm);
