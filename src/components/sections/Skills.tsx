'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Section from '../Section';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

const Skills = () => {
  const { content, loading } = useContent();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (loading) return <Section id="skills">Loading...</Section>;

  const { title, subtitle, categories } = content.skills || {};

  return (
    <Section id="skills" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
        >
          {title || 'Technical Skillset'}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          {subtitle || 'A showcase of my technical proficiency and the tools I use to build amazing things.'}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.isArray(categories) && categories.map((category: any, index: number) => {
          const isUrl = typeof category.icon === 'string' && (
            category.icon.startsWith('http') || 
            category.icon.startsWith('/') || 
            category.icon.startsWith('data:image')
          );
          const Icon = !isUrl && (Icons as any)[category.icon] ? (Icons as any)[category.icon] : Icons.Code;

          return (
            <motion.div 
              key={`skill-cat-${category.title}-${index}`} 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
              className="p-8 rounded-[32px] glass-card relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner relative z-10 border border-primary/20">
                {isUrl ? (
                  <img src={category.icon} alt={category.title} className="w-8 h-8 object-contain" />
                ) : (
                  <Icon size={32} strokeWidth={2} />
                )}
              </div>
              <h3 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase italic">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(category.skills) && category.skills.map((skill: string, sIndex: number) => (
                  <motion.span 
                    key={sIndex} 
                    whileHover={{ scale: 1.1, x: 5 }}
                    className="px-4 py-2 rounded-xl bg-white/5 text-muted-foreground text-xs font-bold uppercase tracking-widest border border-white/5 hover:text-primary hover:border-primary/30 transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;
