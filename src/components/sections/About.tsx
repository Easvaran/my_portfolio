'use client';

import Section from '../Section';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

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
        {Array.isArray(stats) && stats.map((stat: any, index: number) => {
          const isUrl = typeof stat.icon === 'string' && (stat.icon.startsWith('http') || stat.icon.startsWith('/'));
          const IconComponent = !isUrl && (Icons as any)[stat.icon] ? (Icons as any)[stat.icon] : null;

          return (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {isUrl ? (
                  <img src={stat.icon} alt={stat.label} className="w-8 h-8" />
                ) : IconComponent ? (
                  <IconComponent size={32} />
                ) : (
                  <Icons.HelpCircle size={32} />
                )}
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight text-foreground">{stat.value}</h3>
              <p className="text-secondary font-medium uppercase text-sm tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{detailsTitle}</h3>
            {Array.isArray(paragraphs) && paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-secondary leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          {Array.isArray(values) && values.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative bg-black/40 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                <ul className="space-y-6">
                  {values.map((value: any, index: number) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full bg-${value.color}-500/20 flex items-center justify-center text-${value.color}-500 mt-1 shrink-0`}>
                        <div className={`w-2 h-2 rounded-full bg-${value.color}-500`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{value.title}</h4>
                        <p className="text-secondary text-sm">{value.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default About;
