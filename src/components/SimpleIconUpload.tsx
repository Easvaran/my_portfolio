'use client';

import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SimpleIconUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SimpleIconUpload({ value, onChange }: SimpleIconUploadProps) {
  const [uploading, setUploading] = useState(false);

  const isUrl = value && (value.startsWith('http') || value.startsWith('/'));
  const CurrentIcon = !isUrl && (Icons as any)[value] ? (Icons as any)[value] : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
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
          {value ? 'Change Icon' : 'Upload Icon'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
        
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
  );
}
