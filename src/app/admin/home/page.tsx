'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Save, Home, Image as ImageIcon, Upload, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function HomeSettings() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    ctaPrimaryText: '',
    ctaPrimaryHref: '',
    ctaSecondaryText: '',
    ctaSecondaryHref: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.hero) {
        setFormData({
          name: data.hero.name,
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          description: data.hero.description,
          ctaPrimaryText: data.hero.ctaPrimary.text,
          ctaPrimaryHref: data.hero.ctaPrimary.href,
          ctaSecondaryText: data.hero.ctaSecondary.text,
          ctaSecondaryHref: data.hero.ctaSecondary.href,
          profileImage: data.hero.profileImage
        });
        setImagePreview(data.hero.profileImage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    let finalImageUrl = formData.profileImage;

    // Convert file to Base64 if a new file is selected (for Vercel compatibility)
    if (selectedFile) {
      try {
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(selectedFile);
        });
        
        finalImageUrl = base64Image;
      } catch (err: any) {
        console.error('Image processing failed:', err);
        setMessage({ type: 'error', text: 'Image processing failed. Please try again.' });
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      section: 'hero',
      data: {
        name: formData.name,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        ctaPrimary: { text: formData.ctaPrimaryText, href: formData.ctaPrimaryHref },
        ctaSecondary: { text: formData.ctaSecondaryText, href: formData.ctaSecondaryHref },
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
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-12 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
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

            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Home size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Home Section</h1>
                <p className="text-muted-foreground text-sm font-medium">Edit your landing page hero content</p>
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-sm font-bold uppercase tracking-wider">{message.text}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title (e.g. Full Stack Developer)</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Catchy Subtitle (e.g. Building Digital Masterpieces)</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                    <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8">Call to Action Buttons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Button</label>
                    <input placeholder="Text" type="text" value={formData.ctaPrimaryText} onChange={e => setFormData({...formData, ctaPrimaryText: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                    <input placeholder="Link (e.g. #projects)" type="text" value={formData.ctaPrimaryHref} onChange={e => setFormData({...formData, ctaPrimaryHref: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secondary Button</label>
                    <input placeholder="Text" type="text" value={formData.ctaSecondaryText} onChange={e => setFormData({...formData, ctaSecondaryText: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                    <input placeholder="Link (e.g. /resume.pdf)" type="text" value={formData.ctaSecondaryHref} onChange={e => setFormData({...formData, ctaSecondaryHref: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
        </div>
      </div>
    </>
  );
}
