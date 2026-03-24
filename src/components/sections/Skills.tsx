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

  const { title, subtitle, skill_set } = content.skills || {};

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
        {(skill_set || []).map((skill: { name: string; level: number }, index: number) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
            className="p-8 rounded-3xl bg-card border border-white/10 shadow-2xl shadow-black/40 text-center"
          >
            <h3 className="text-lg font-bold text-white mb-4">{skill.name}</h3>
            <div className="w-full bg-white/5 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full shadow-lg shadow-primary/30"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
