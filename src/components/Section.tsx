'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(({ id, title, subtitle, children, className = '' }, ref) => {
  const variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      } 
    }
  };

  return (
    <section ref={ref} id={id} className={`py-20 px-6 md:px-12 lg:px-24 ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={variants}
        className="max-w-6xl mx-auto"
      >
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary via-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-secondary text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
});

export default Section;
