'use client';

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
              className="p-8 rounded-2xl glass flex flex-col items-center text-center group glass-hover"
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
              <p className="text-muted-foreground font-medium uppercase text-sm tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 glass p-10 rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{detailsTitle}</h3>
            {Array.isArray(paragraphs) && paragraphs.map((paragraph: string, index: number) => (
              <p key={`para-${index}`} className="text-muted-foreground leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          {Array.isArray(values) && values.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-3xl group-hover:bg-primary/20 transition-all duration-500" />
              <div className="relative glass p-8 rounded-3xl">
                <ul className="space-y-6">
                  {values.map((value: { color: string; title: string; description: string }, index: number) => (
                    <li key={`val-${value.title}-${index}`} className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full bg-${value.color}-500/20 flex items-center justify-center text-${value.color}-500 mt-1 shrink-0`}>
                        <div className={`w-2 h-2 rounded-full bg-${value.color}-500`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{value.title}</h4>
                        <p className="text-muted-foreground text-sm">{value.description}</p>
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
