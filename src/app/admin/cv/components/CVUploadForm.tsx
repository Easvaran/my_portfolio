'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, CheckCircle, AlertCircle, FileText, Clock } from 'lucide-react';

interface CVUploadFormProps {
  initialCV: { url: string; lastModified: string } | null;
}

const CVUploadForm = ({ initialCV }: CVUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentCV, setCurrentCV] = useState(initialCV);

  const fetchCurrentCV = useCallback(async () => {
    try {
      const res = await fetch('/api/get-cv');
      if (res.ok) {
        const data = await res.json();
        setCurrentCV(data);
      } else {
        setCurrentCV(null);
      }
    } catch (err) {
      console.error('Failed to fetch current CV:', err);
      setCurrentCV(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cv-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'CV uploaded successfully!');
        setFile(null);
        fetchCurrentCV(); 
      } else {
        setError(data.error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('An error occurred during the upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current CV Status */}
      <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <FileText size={20} className="text-primary" />
          Current Resume
        </h2>

        {currentCV ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-white font-bold">resume.pdf</p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                  <Clock size={12} />
                  <span>Last updated: {new Date(currentCV.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <a 
              href={currentCV.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all text-center border border-white/10"
            >
              View Current CV
            </a>
          </div>
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground font-medium italic">No CV uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8">Upload New Version</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <label className={`
              relative flex flex-col items-center justify-center w-full h-64 
              border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500
              ${file ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'}
            `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${file ? 'bg-primary text-white scale-110' : 'bg-white/5 text-primary group-hover:scale-110'}`}>
                  <Upload size={32} />
                </div>
                <p className="mb-2 text-sm text-white font-bold uppercase tracking-wider">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  PDF format recommended (MAX. 5MB)
                </p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
              <AlertCircle size={18} />
              <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3">
              <CheckCircle size={18} />
              <p className="text-sm font-bold uppercase tracking-wider">{success}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className={`
              w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl
              ${!file || uploading 
                ? 'bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5' 
                : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-primary/20'}
            `}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            <span>{uploading ? 'Uploading...' : 'Publish New Resume'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(CVUploadForm);
