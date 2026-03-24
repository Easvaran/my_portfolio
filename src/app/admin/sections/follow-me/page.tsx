'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Save, 
  Share2, 
  Plus, 
  Trash2, 
  Edit3,
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Video,
  Globe,
  Link as LinkIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

const ICON_OPTIONS = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Twitter', icon: Twitter },
  { name: 'Instagram', icon: Instagram },
  { name: 'Youtube', icon: Youtube },
  { name: 'Telegram', icon: Send },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'Vimeo', icon: Video },
  { name: 'Github', icon: Github },
  { name: 'Globe', icon: Globe },
  { name: 'Link', icon: LinkIcon },
];

export default function FollowMeSettings() {
  const [data, setData] = useState({
    title: 'Follow Me',
    socials: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    const checkAuth = async () => {
      if (!password) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/admin/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        
        if (!res.ok) {
          localStorage.removeItem('admin_auth');
          router.push('/admin/login');
        } else {
          fetchContent();
        }
      } catch (err) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [password, router]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.socials_section) {
        // Ensure enabled property exists for all socials
        const normalizedSocials = data.socials_section.socials.map((s: any) => ({
          ...s,
          enabled: s.enabled !== undefined ? s.enabled : true
        }));
        setData({ ...data.socials_section, socials: normalizedSocials });
      } else if (data.socials) {
        const normalizedSocials = data.socials.map((s: any) => ({
          ...s,
          enabled: true
        }));
        setData({ title: 'Follow Me', socials: normalizedSocials });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialChange = (index: number, field: string, value: any) => {
    const newSocials = [...data.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setData({ ...data, socials: newSocials });
  };

  const addSocial = () => {
    setData({
      ...data,
      socials: [...data.socials, { name: 'New Link', href: 'https://', icon: 'Facebook', enabled: true }]
    });
  };

  const removeSocial = (index: number) => {
    setData({
      ...data,
      socials: data.socials.filter((_, i) => i !== index)
    });
  };

  const toggleSocial = (index: number) => {
    const newSocials = [...data.socials];
    newSocials[index].enabled = !newSocials[index].enabled;
    setData({ ...data, socials: newSocials });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Save both the section data and the flat socials array for compatibility
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'socials_section', data: data, password })
      });

      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'socials', data: data.socials, password })
      });

      setMessage({ type: 'success', text: 'Follow Me section updated successfully!' });
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
              <Share2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Follow Me</h1>
              <p className="text-muted-foreground text-sm font-medium">Manage your social media presence and section title</p>
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Social Links</h2>
                <button type="button" onClick={addSocial} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                  <Plus size={14} /> Add Link
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {data.socials.map((link, index) => {
                  const Icon = ICON_OPTIONS.find(opt => opt.name === link.icon)?.icon || Globe;
                  const isEditing = editingIndex === index;

                  return (
                    <div key={index} className="flex flex-col items-center gap-4 group">
                      <div className="relative">
                        {/* Circular Icon Container */}
                        <div 
                          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                            link.enabled 
                              ? 'bg-black border-2 border-white/10 text-white' 
                              : 'bg-black/40 border-2 border-red-500/20 text-muted-foreground grayscale opacity-50'
                          }`}
                        >
                          <Icon size={32} strokeWidth={1.5} />
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute -top-2 -right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button" 
                            onClick={() => toggleSocial(index)} 
                            className={`p-1.5 rounded-full bg-white text-black hover:scale-110 transition-all shadow-lg`}
                            title={link.enabled ? 'Disable' : 'Enable'}
                          >
                            {link.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingIndex(isEditing ? null : index)} 
                            className={`p-1.5 rounded-full ${isEditing ? 'bg-primary text-white' : 'bg-white text-black'} hover:scale-110 transition-all shadow-lg`}
                            title="Edit"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => removeSocial(index)} 
                            className="p-1.5 rounded-full bg-red-500 text-white hover:scale-110 transition-all shadow-lg"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${link.enabled ? 'text-white' : 'text-muted-foreground'}`}>
                          {link.name || 'Untitled'}
                        </p>
                      </div>

                      {/* Edit Modal */}
                      <AnimatePresence>
                        {isEditing && (
                          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="w-full max-w-md p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl space-y-6"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h3 className="text-xl font-black uppercase tracking-widest text-white">Edit Social</h3>
                                  <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">Configure your social link</p>
                                </div>
                                <button 
                                  onClick={() => setEditingIndex(null)} 
                                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                                >
                                  <Plus size={20} className="rotate-45" />
                                </button>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Name</label>
                                  <input 
                                    type="text" 
                                    value={link.name} 
                                    onChange={e => handleSocialChange(index, 'name', e.target.value)} 
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary transition-all"
                                    placeholder="e.g. Facebook"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile URL</label>
                                  <input 
                                    type="text" 
                                    value={link.href} 
                                    onChange={e => handleSocialChange(index, 'href', e.target.value)} 
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary transition-all"
                                    placeholder="https://facebook.com/yourprofile"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Choose Icon</label>
                                  <div className="grid grid-cols-5 gap-3">
                                    {ICON_OPTIONS.map(opt => {
                                      const OptIcon = opt.icon;
                                      return (
                                        <button
                                          key={opt.name}
                                          type="button"
                                          onClick={() => handleSocialChange(index, 'icon', opt.name)}
                                          className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                                            link.icon === opt.name 
                                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                              : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                                          }`}
                                          title={opt.name}
                                        >
                                          <OptIcon size={18} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <button 
                                type="button"
                                onClick={() => setEditingIndex(null)}
                                className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl mt-4"
                              >
                                Done
                              </button>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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
