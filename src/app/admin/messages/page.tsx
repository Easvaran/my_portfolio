'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, User, Calendar, Trash2, Edit3, X, Send, AlertTriangle } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/contact?password=${password}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages.');
      }
    } catch (err) {
      setError('An error occurred while fetching messages.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/contact/${messageToDelete}?password=${password}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== messageToDelete));
        setShowDeleteModal(false);
        setMessageToDelete(null);
      } else {
        alert('Failed to delete message.');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('An error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (msg: Message) => {
    setEditingMessage(msg);
    setFormData({
      name: msg.name,
      email: msg.email,
      message: msg.message
    });
    setShowModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/contact/${editingMessage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password })
      });

      if (res.ok) {
        const updated = await res.json();
        setMessages(prev => prev.map(m => m._id === updated._id ? updated : m));
        setShowModal(false);
      } else {
        alert('Failed to update message.');
      }
    } catch (err) {
      console.error('Error updating message:', err);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm font-bold group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/20">
            <Mail size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Inbox</h1>
            <p className="text-muted-foreground text-sm font-medium">Client messages and inquiries</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-32 bg-card/20 rounded-[64px] border border-dashed border-white/10 mt-12 shadow-inner">
              <h2 className="text-3xl font-black text-white mb-3">Inbox Zero!</h2>
              <p className="text-muted-foreground mt-2 font-medium">No new messages at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-8 rounded-[32px] bg-card border border-white/10 shadow-lg shadow-black/20 group relative"
              >
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(msg)}
                    className="p-2.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/10 transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(msg._id)}
                    className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl border border-white/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 pr-20">
                    <Calendar size={14} />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-secondary leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10">
                  {msg.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-card border border-white/10 rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white">Edit Message</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitEdit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner shadow-red-500/20">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2">Delete Message?</h2>
              <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                This action is permanent and cannot be undone. Are you sure you want to remove this message from your inbox?
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  {deleting ? 'Deleting...' : 'Yes, Delete Message'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

