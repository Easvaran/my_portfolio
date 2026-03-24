'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <form
        onSubmit={handleSubmit}
        className="relative p-10 md:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-bold text-secondary uppercase tracking-widest ml-1">Your Name</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-white/20"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-white/20"
              placeholder="john@example.com"
            />
          </div>
        </div>


        <div className="space-y-3">
          <label htmlFor="message" className="text-sm font-bold text-secondary uppercase tracking-widest ml-1">Message</label>
          <textarea
            id="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-white/20 resize-none"
            placeholder="Tell me about your project..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 group/btn overflow-hidden relative"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Sending...
            </>
          ) : status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <CheckCircle size={24} />
              Sent Successfully!
            </motion.div>
          ) : (
            <>
              Send Message
              <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </>
          )}
        </motion.button>

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center font-medium">Something went wrong. Please try again later.</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
