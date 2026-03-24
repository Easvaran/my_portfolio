'use client';

import { motion } from 'framer-motion';
import Section from '../Section';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

const Skills = () => {
  const { content } = useContent();
  const { title, subtitle, categories } = content.skills;

  return (
    <Section
      id="skills"
      title={title}
      subtitle={subtitle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {categories.map((category: any, index: number) => {
          const IconComponent = (Icons as any)[category.icon] || Icons.Code;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500 group backdrop-blur-sm relative overflow-hidden"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="absolute -right-4 -top-4 text-white/5 group-hover:text-primary/10 transition-colors duration-500"
              >
                <IconComponent size={120} />
              </motion.div>
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner"
                >
                  <IconComponent size={24} />
                </motion.div>
                <h3 className="text-xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors uppercase tracking-[0.2em] text-center">
                  {category.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {category.skills.map((skill: string, skillIndex: number) => (
                    <motion.span
                      key={skillIndex}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                      className="px-4 py-2 rounded-xl bg-white/5 text-sm font-medium border border-white/5 hover:border-primary/30 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;
