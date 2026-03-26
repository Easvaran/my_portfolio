'use client';

import { motion } from 'framer-motion';
import Section from '../Section';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

const iconMap: Record<string, React.ElementType> = Icons as any;

const About = () => {
  const { content } = useContent();
  const { title, subtitle, stats, details } = content.about;

  // Handle both the old (object) and new (string) structures for details
  const detailsTitle = typeof details === 'object' ? details.title : 'My Journey';
  const paragraphs = typeof details === 'object' 
    ? details.paragraphs 
    : (typeof details === 'string' ? details.split('\n\n') : []);
  const values = typeof details === 'object' ? details.values : [];

  return (
    <Section
      id="about"
      title={title}
      subtitle={subtitle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.isArray(stats) && stats.map((stat: { value: string; label: string; icon: string }, index: number) => {
          const isUrl = typeof stat.icon === 'string' && (
            stat.icon.startsWith('http') || 
            stat.icon.startsWith('/') || 
            stat.icon.startsWith('data:image')
          );
          const IconComponent = !isUrl && iconMap[stat.icon] ? iconMap[stat.icon] : null;

          return (
            <div
              key={`stat-${stat.label}-${index}`}
              className="p-8 rounded-[32px] glass-card flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner relative z-10">
                {isUrl ? (
                  <img src={stat.icon} alt={stat.label} className="w-10 h-10 object-contain" />
                ) : IconComponent ? (
                  <IconComponent size={36} strokeWidth={2} />
                ) : (
                  <Icons.HelpCircle size={36} strokeWidth={2} />
                )}
              </div>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-white group-hover:text-primary transition-colors">{stat.value}</h3>
              <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">{stat.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-20 glass-card p-8 md:p-16 rounded-[48px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mt-32 blur-[100px]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {detailsTitle}
            </h3>
            <div className="space-y-6">
              {Array.isArray(paragraphs) && paragraphs.map((paragraph: string, index: number) => (
                <p key={`para-${index}`} className="text-muted-foreground leading-relaxed text-lg font-medium border-l-4 border-primary/40 pl-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {Array.isArray(values) && values.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
              <div className="relative space-y-6">
                {values.map((value: { color: string; title: string; description: string }, index: number) => (
                  <motion.div 
                    key={`val-${value.title}-${index}`} 
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-6 p-6 rounded-3xl glass-card group/item"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${value.color}-500/10 flex items-center justify-center text-${value.color}-500 mt-1 shrink-0 shadow-inner border border-${value.color}-500/20 group-hover/item:scale-110 transition-transform`}>
                      <div className={`w-3 h-3 rounded-full bg-${value.color}-500 animate-pulse`} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{value.title}</h4>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default About;
