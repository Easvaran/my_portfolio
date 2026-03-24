'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Save, Share2, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Globe, ArrowLeft, Settings } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function FooterSettings() {
  const [footerData, setFooterData] = useState({
    text: '',
    copyright: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!password || password !== adminPassword) {
      router.push('/admin/login');
      return;
    }
    fetchContent();
  }, [password, router]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.footer) setFooterData(data.footer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Save Footer
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'footer', data: footerData, password })
      });

      setMessage({ type: 'success', text: 'Footer updated successfully!' });
      router.refresh();
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-12 md:ml-64 transition-all duration-300">
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
              <Settings size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Footer Settings</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage your footer content and details</p>
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
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">Footer Details</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Footer Text</label>
                <textarea rows={3} value={footerData.text} onChange={e => setFooterData({...footerData, text: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Copyright Text</label>
                <input type="text" value={footerData.copyright} onChange={e => setFooterData({...footerData, copyright: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
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
