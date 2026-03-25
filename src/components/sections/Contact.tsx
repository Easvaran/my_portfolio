'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import Section from '../Section';
import { useContent } from '@/context/ContentContext';

const Contact = () => {
  const { content, loading } = useContent();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [response, setResponse] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (res.ok) {
        setResponse({ type: 'success', text: 'Message sent successfully! I will get back to you soon.' });
        setFormState({ name: '', email: '', message: '' });
      } else {
        setResponse({ type: 'error', text: data.error || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      setResponse({ type: 'error', text: 'Failed to send message. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Section id="contact">Loading...</Section>;

  const { title, subtitle, info } = content.contact || {};

  return (
    <Section id="contact" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
        >
          {title || 'Get in Touch'}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          {subtitle || 'I am always open to discussing new projects, creative ideas or opportunities to be part of your visions.'}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8"
        >
          {Array.isArray(info) && info.map((item: any, index: number) => {
            const isUrl = typeof item.icon === 'string' && (
              item.icon.startsWith('http') || 
              item.icon.startsWith('/') || 
              item.icon.startsWith('data:image')
            );
            const Icon = !isUrl && (Icons as any)[item.icon] ? (Icons as any)[item.icon] : Icons.HelpCircle;

            return (
              <motion.div 
                key={`contact-info-${item.label}-${index}`} 
                whileHover={{ x: 10 }}
                className="flex items-start gap-8 p-6 rounded-[32px] glass glass-hover relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-24 bg-primary/5 rounded-full -mr-10 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="w-20 h-20 rounded-[24px] glass glass-hover flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 border border-white/5">
                  {isUrl ? (
                    <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain" />
                  ) : (
                    <Icon size={32} strokeWidth={2.5} />
                  )}
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{item.label}</p>
                  <a href={item.href} className="text-xl font-black text-white hover:text-primary transition-colors tracking-tight">
                    {item.value}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2 p-10 md:p-16 rounded-[48px] glass space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-[100px]" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Your Identity</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name"
                value={formState.name} 
                onChange={handleChange} 
                required 
                className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Digital Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="email@example.com"
                value={formState.email} 
                onChange={handleChange} 
                required 
                className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white font-bold" 
              />
            </div>
          </div>
          <div className="space-y-3 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Your Vision</label>
            <textarea 
              name="message" 
              placeholder="Tell me about your project..."
              value={formState.message} 
              onChange={handleChange} 
              required 
              rows={6} 
              className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white font-medium resize-none"
            ></textarea>
          </div>
          
          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl text-sm font-black uppercase tracking-widest ${response.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
            >
              {response.text}
            </motion.div>
          )}

          <motion.button 
            type="submit" 
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 disabled:opacity-70 relative z-10"
          >
            {isSubmitting ? (
              <>
                <Icons.Loader2 className="animate-spin" size={24} />
                Transmitting...
              </>
            ) : (
              <>
                Send Message
                <Icons.Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.form>
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </Section>
  );
};

export default Contact;
