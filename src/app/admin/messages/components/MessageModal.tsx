'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any | null;
  onSuccess: (updated: any) => void;
}

const MessageModal = ({ isOpen, onClose, message, onSuccess }: MessageModalProps) => {
  const [submitting, setSubmitting] = React.useState(false);
  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (message) {
      reset({
        name: message.name,
        email: message.email,
        message: message.message
      });
    }
  }, [message, reset]);

  const onSubmit = async (data: any) => {
    if (!message) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/contact/${message._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, password })
      });

      if (res.ok) {
        const updated = await res.json();
        onSuccess(updated);
        onClose();
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                  <textarea
                    rows={5}
                    {...register('message')}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white leading-relaxed"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-[2] py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Update Message
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(MessageModal);
