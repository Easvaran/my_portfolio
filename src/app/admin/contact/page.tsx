'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Save, Mail, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Phone, MapPin, ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function ContactSettings() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    details: '',
    info: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.contact) {
        setFormData(data.contact);
      } else {
        // Default initial state
        setFormData({
          title: 'Get In Touch',
          subtitle: "Have a project in mind or just want to say hello? I'd love to hear from you.",
          details: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
          info: [
            { icon: 'Mail', label: 'Email', value: 'contact@example.com', href: 'mailto:contact@example.com' },
            { icon: 'Phone', label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
            { icon: 'MapPin', label: 'Location', value: 'San Francisco, CA', href: '#' },
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoChange = (index: number, field: string, value: string) => {
    const newInfo = [...formData.info];
    newInfo[index] = { ...newInfo[index], [field]: value };
    setFormData({ ...formData, info: newInfo });
  };

  const addInfo = () => {
    setFormData({
      ...formData,
      info: [...formData.info, { label: 'New Info', value: 'Value', icon: 'HelpCircle', href: '#' }]
    });
  };

  const removeInfo = (index: number) => {
    setFormData({ ...formData, info: formData.info.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      section: 'contact',
      data: formData,
      password
    };

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Contact section updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Failed to update contact section' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
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
              <Mail size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Contact Section</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage how visitors reach out to you</p>
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
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Section Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Description</label>
                <textarea rows={3} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Contact Methods</h2>
                <button type="button" onClick={addInfo} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                  <Plus size={14} /> Add Method
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.info.map((item, index) => (
                  <div key={index} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 relative group">
                    <button type="button" onClick={() => removeInfo(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Label</label>
                          <input type="text" value={item.label} onChange={e => handleInfoChange(index, 'label', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Icon</label>
                          <input type="text" value={item.icon} onChange={e => handleInfoChange(index, 'icon', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value</label>
                        <input type="text" value={item.value} onChange={e => handleInfoChange(index, 'value', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Link (href)</label>
                        <input type="text" value={item.href} onChange={e => handleInfoChange(index, 'href', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
                      </div>
                    </div>
                  </div>
                ))}
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
  );
}
