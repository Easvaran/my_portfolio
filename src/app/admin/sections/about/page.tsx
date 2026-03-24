'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Save, Users, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import SimpleIconUpload from '@/components/SimpleIconUpload';

// 1. Define clear TypeScript interfaces for the state
interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface AboutFormData {
  title: string;
  subtitle: string;
  details: string;
  stats: Stat[];
}

// 2. A single, safe source of initial state
const initialFormData: AboutFormData = {
  title: '',
  subtitle: '',
  details: '',
  stats: [],
};

export default function AboutSettings() {
  const [formData, setFormData] = useState<AboutFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  // 3. Robust data fetching with useCallback
  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      
      // Safely construct the new state, ensuring stats is always an array
      const newFormData = {
        ...initialFormData,
        ...(data.about || {}),
        stats: Array.isArray(data.about?.stats) ? data.about.stats : [],
      };
      setFormData(newFormData);

    } catch (err) {
      console.error('Failed to fetch content:', err);
      setMessage({ type: 'error', text: 'Could not load settings data.' });
      setFormData(initialFormData); // Reset to safe state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!password || password !== adminPassword) {
      router.push('/admin/login');
    } else {
      fetchContent();
    }
  }, [password, router, fetchContent]);

  // 4. Clean state management with functional updates
  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    setFormData(prevData => {
      const newStats = [...prevData.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prevData, stats: newStats };
    });
  };

  const addStat = () => {
    setFormData(prevData => ({
      ...prevData,
      stats: [...prevData.stats, { label: 'New Stat', value: '0', icon: 'Activity' }],
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      stats: prevData.stats.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'about', data: formData, password }),
      });

      if (!res.ok) throw new Error('Failed to save data.');
      
      setMessage({ type: 'success', text: 'About section updated successfully!' });

    } catch (err) {
      console.error('Submission error:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Proper loading state handling
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-12 md:ml-64">
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
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">About Section</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage your personal details and statistics</p>
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
            <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Title</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Subtitle</label>
                <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Personal Details (Paragraph)</label>
                <textarea rows={6} value={formData.details || ''} onChange={e => setFormData({ ...formData, details: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white leading-relaxed" />
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Experience Stats</h2>
                <button type="button" onClick={addStat} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                  <Plus size={14} /> Add Stat
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 6. Safe rendering with conditional and fallback UI */}
                {Array.isArray(formData.stats) && formData.stats.length > 0 ? (
                  formData.stats.map((stat, index) => (
                    // Also check if stat object itself is valid before rendering
                    stat && (
                      <div key={index} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 relative group">
                        <button type="button" onClick={() => removeStat(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Label</label>
                            <input type="text" value={stat.label || ''} onChange={e => handleStatChange(index, 'label', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value</label>
                            <input type="text" value={stat.value || ''} onChange={e => handleStatChange(index, 'value', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Icon Image</label>
                        <SimpleIconUpload 
                          value={stat.icon || ''} 
                          onChange={value => handleStatChange(index, 'icon', value)} 
                        />
                      </div>
                      </div>
                    )
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white/5 rounded-2xl">
                    <p className="text-muted-foreground font-medium">No experience stats yet.</p>
                    <p className="text-sm text-muted-foreground/70">Click "Add Stat" to get started.</p>
                  </div>
                )}
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
      </main>
    </div>
  );
}
