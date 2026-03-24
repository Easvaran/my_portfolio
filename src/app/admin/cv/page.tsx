'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, Loader2, CheckCircle, AlertCircle, ArrowLeft, FileText, Clock } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { useEffect } from 'react';

export default function CVPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentCV, setCurrentCV] = useState<{ url: string; lastModified: string } | null>(null);
  const router = useRouter();

  const fetchCurrentCV = async () => {
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
  };

  useEffect(() => {
    fetchCurrentCV();
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
        fetchCurrentCV(); // Refresh CV info after upload
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
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
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

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/20">
              <Upload size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Upload CV</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage your downloadable curriculum vitae.</p>
            </div>
          </div>

          {currentCV && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <FileText size={24} className="text-primary" />
                <div>
                  <p className="text-sm font-bold text-white">Current CV</p>
                  <a href={currentCV.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {currentCV.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={14} />
                <span>Last updated: {new Date(currentCV.lastModified).toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl shadow-black/40"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">CV / Resume File (PDF)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={48} className="text-primary mb-4" />
                      {file ? (
                        <p className="font-bold text-white">{file.name}</p>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground/70">PDF format only (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
                  <CheckCircle size={20} />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="animate-spin" size={22} /> : <Upload size={22} />}
                {uploading ? 'Uploading...' : 'Upload CV'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
