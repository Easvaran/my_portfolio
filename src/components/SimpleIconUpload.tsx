'use client';

import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { optimizeImage } from '@/lib/image-optimizer';
import ImageAdjuster from './ImageAdjuster';
import { AnimatePresence } from 'framer-motion';

interface SimpleIconUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SimpleIconUpload({ value, onChange }: SimpleIconUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showAdjuster, setShowAdjuster] = useState(false);

  const isUrl = value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:image'));
  const CurrentIcon = !isUrl && (Icons as any)[value] ? (Icons as any)[value] : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Direct Base64 conversion and optimization for Vercel
      const optimizedBase64 = await optimizeImage(file, 400, 400, 0.8);
      onChange(optimizedBase64);
      // Automatically show adjuster after upload for better UX
      setShowAdjuster(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleAdjusted = (base64: string) => {
    onChange(base64);
    setShowAdjuster(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {uploading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : isUrl ? (
            <img src={value} alt="Icon" className="w-full h-full object-cover" />
          ) : CurrentIcon ? (
            <CurrentIcon size={24} className="text-primary" />
          ) : (
            <ImageIcon size={24} className="text-muted-foreground" />
          )}
        </div>

        <div className="flex-grow flex gap-2">
          <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black uppercase tracking-widest cursor-pointer transition-all border border-primary/10">
            <Upload size={14} />
            {value ? 'Change' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
          
          {value && isUrl && (
            <button
              type="button"
              onClick={() => setShowAdjuster(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              title="Adjust Icon"
            >
              <Maximize2 size={14} />
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/10"
              title="Remove Icon"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdjuster && value && isUrl && (
          <ImageAdjuster 
            imageSrc={value}
            onConfirm={handleAdjusted}
            onCancel={() => setShowAdjuster(false)}
            circular={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
