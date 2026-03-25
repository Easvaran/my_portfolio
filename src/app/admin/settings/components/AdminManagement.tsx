'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  Edit3, 
  X, 
  Mail, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AdminManagementProps {
  initialAdmins: any[];
}

const AdminManagement = ({ initialAdmins }: AdminManagementProps) => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (editingAdmin) {
      reset({
        email: editingAdmin.email,
        password: editingAdmin.password
      });
    } else {
      reset({
        email: '',
        password: ''
      });
    }
  }, [editingAdmin, reset]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/manage?password=${password}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setAdmins(data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  }, [password]);

  const handleSaveAdmin = async (data: any) => {
    setLoading(true);
    setMessage(null);
    try {
      const method = editingAdmin ? 'PUT' : 'POST';
      const body = editingAdmin 
        ? { id: editingAdmin._id, email: data.email, password: data.password, adminPassword: password }
        : { email: data.email, password: data.password, adminPassword: password };

      const res = await fetch('/api/admin/manage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: editingAdmin ? 'Admin updated' : 'Admin added' });
        setIsModalOpen(false);
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Failed to save admin' });
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

  return (
    <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Shield size={20} className="text-primary" />
          Admin Management
        </h2>
        <button 
          onClick={() => { setEditingAdmin(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95"
        >
          <UserPlus size={16} /> Add New Admin
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold uppercase tracking-wider">{message.text}</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {admins.map((admin) => (
          <div key={admin._id} className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/5 group/item hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-primary border border-white/10">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-white font-bold">{admin.email}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Administrator</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <button onClick={() => { setEditingAdmin(admin); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"><Edit3 size={16} /></button>
              <button onClick={() => handleDeleteAdmin(admin._id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-card border border-white/10 rounded-[48px] shadow-2xl overflow-hidden p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">{editingAdmin ? 'Edit Admin' : 'Add Admin'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit(handleSaveAdmin)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="email" {...register('email')} required className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-medium" placeholder="admin@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="password" {...register('password')} required className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-medium" placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  <span>{editingAdmin ? 'Update Admin' : 'Create Admin'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AdminManagement);
