'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Save, 
  RefreshCcw,
  Layout,
  AlertCircle,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  UserPlus,
  Trash2,
  Edit3,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [showModalPass, setShowModalPass] = useState(false);
  
  // Form states for new/edit admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Branding states
  const [branding, setBranding] = useState({
    logo: '',
    heading: 'PORTFOLIO'
  });
  const [isBrandingLoading, setIsBrandingLoading] = useState(false);

  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    fetchAdmins();
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const res = await fetch('/api/content?section=branding', { cache: 'no-store' });
      if (res.ok) {
        const result = await res.json();
        if (result && result.data) {
          setBranding({
            logo: result.data.logo || '',
            heading: result.data.heading || 'PORTFOLIO'
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch branding:', err);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBrandingLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'branding',
          data: branding,
          password
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Branding updated successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update branding' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setIsBrandingLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to S3/Cloudinary. 
    // For now, we'll use a Base64 string as a placeholder or simulation.
    const reader = new FileReader();
    reader.onloadend = () => {
      setBranding({ ...branding, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`/api/admin/manage?password=${password}`);
      const data = await res.json();
      if (res.ok) setAdmins(data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingAdmin ? 'PUT' : 'POST';
      const body = editingAdmin 
        ? { id: editingAdmin._id, email: adminEmail, password: adminPassword, adminPassword: password }
        : { email: adminEmail, password: adminPassword, adminPassword: password };

      const res = await fetch('/api/admin/manage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: editingAdmin ? 'Admin updated' : 'Admin added' });
        setIsModalOpen(false);
        setEditingAdmin(null);
        setAdminEmail('');
        setAdminPassword('');
        fetchAdmins();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save admin' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      const res = await fetch(`/api/admin/manage?id=${id}&adminPassword=${password}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Admin deleted' });
        fetchAdmins();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const openEditModal = (admin: any) => {
    setEditingAdmin(admin);
    setAdminEmail(admin.email);
    setAdminPassword(admin.password);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Save branding as part of general save
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'branding',
          data: branding,
          password
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuration updated successfully.' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update configuration' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <>
      <div className="p-6 md:p-12 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/20">
                <Settings size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">System Settings</h1>
                <p className="text-muted-foreground text-sm font-medium">Configure your portfolio and administrative preferences</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm font-bold group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
            </div>
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-10 p-5 rounded-3xl border shadow-xl flex items-center gap-4 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/5' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/5'
              }`}
            >
              <div className={`p-3 rounded-2xl ${message.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">{message.type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-xs font-bold opacity-80 mt-0.5">{message.text}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Branding Section */}
              <section className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 mb-8">
                  <Globe className="text-primary" size={20} strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">Website Branding</h2>
                </div>
                
                <form onSubmit={handleSaveBranding} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Website Logo</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                          {branding.logo ? (
                            <img src={branding.logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                          ) : (
                            <Layout className="text-muted-foreground opacity-20" size={32} />
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                            <Upload size={20} className="text-white" />
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                        </div>
                        <div className="flex-grow space-y-2">
                          <p className="text-xs text-white font-bold">Upload Brand Mark</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">Square PNG or SVG works best. This will appear in the navigation bar.</p>
                          {branding.logo && (
                            <button 
                              type="button" 
                              onClick={() => setBranding({...branding, logo: ''})}
                              className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400"
                            >
                              Remove Logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Heading Option */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Website Heading</label>
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={branding.heading} 
                          onChange={e => setBranding({...branding, heading: e.target.value})} 
                          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white font-black tracking-widest outline-none focus:border-primary transition-all"
                          placeholder="e.g. PORTFOLIO"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">Visible if no logo is uploaded or as fallback text.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isBrandingLoading}
                      className="px-8 py-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                      {isBrandingLoading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Branding
                    </button>
                  </div>
                </form>
              </section>

              {/* Security Section */}
              <section className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="text-primary" size={20} strokeWidth={2.5} />
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Admin Management</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setEditingAdmin(null);
                        setAdminEmail('');
                        setAdminPassword('');
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
                    >
                      <UserPlus size={14} /> Add Admin
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/10"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{admin.email}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Administrator</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(admin)}
                          className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {admins.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[30px]">
                      <Shield className="mx-auto text-muted-foreground opacity-20 mb-4" size={48} />
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">No secondary admins configured</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Actions */}
              <div className="pt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-[24px] transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {loading ? <RefreshCcw size={20} className="animate-spin" /> : (
                    <>
                      <Save size={20} className="group-hover:scale-110 transition-transform" />
                      <span>Apply Configuration</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => router.push('/admin')}
                  className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-[24px] transition-all border border-white/10 shadow-xl"
                >
                  Discard
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* Admin Management Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                  <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">Provide access credentials</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSaveAdmin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={adminEmail} 
                      onChange={e => setAdminEmail(e.target.value)} 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary transition-all"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type={showModalPass ? 'text' : 'password'} 
                      value={adminPassword} 
                      onChange={e => setAdminPassword(e.target.value)} 
                      className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary transition-all font-mono"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPass(!showModalPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showModalPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCcw size={18} className="animate-spin" /> : (editingAdmin ? 'Update Admin' : 'Create Admin')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
