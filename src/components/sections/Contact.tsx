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
            const Icon = (Icons as any)[item.icon] || Icons.HelpCircle;
            return (
              <div key={index} className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-card border border-white/10 flex items-center justify-center text-primary">
                  <Icon size={28} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                  <a href={item.href} className="text-lg font-bold text-white hover:text-primary transition-colors">
                    {item.value}
                  </a>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2 p-8 md:p-12 rounded-[40px] bg-card border border-white/10 shadow-2xl shadow-black/40 space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
              <input type="text" name="name" value={formState.name} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Email</label>
              <input type="email" name="email" value={formState.email} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
            <textarea name="message" value={formState.message} onChange={handleChange} required rows={5} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white"></textarea>
          </div>
          
          {response && (
            <div className={`p-4 rounded-xl text-sm font-bold ${response.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {response.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </Section>
  );
};

export default Contact;
