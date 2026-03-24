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
          const Icon = (Icons as any)[category.icon] || Icons.Code;
          return (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
              className="p-8 rounded-3xl bg-card border border-white/10 shadow-2xl shadow-black/40"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(category.skills) && category.skills.map((skill: string, sIndex: number) => (
                  <span key={sIndex} className="px-3 py-1 rounded-lg bg-white/5 text-secondary text-xs font-medium border border-white/5">
                    {skill}
                  </span>
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
