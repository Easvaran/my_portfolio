'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
}

const ProjectCard = ({ title, description, image, tags, live }: ProjectProps) => {
  return (
    <motion.div 
      whileHover={{ y: -16 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="group relative rounded-[40px] overflow-hidden glass glass-hover flex flex-col h-full shadow-2xl hover:shadow-primary/10"
    >
      {/* Image Container */}
      <Link href={live} target="_blank" className="relative h-72 overflow-hidden block">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[4px]"
        >
          <div className="p-6 rounded-full bg-white text-primary transition-all shadow-2xl shadow-primary/40 transform translate-y-4 group-hover:translate-y-0 duration-500">
            <ExternalLink size={32} strokeWidth={3} />
          </div>
        </motion.div>
        
        <div className="absolute bottom-6 left-8 flex flex-wrap gap-2">
          {tags.slice(0, 2).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-10 flex-grow flex flex-col bg-gradient-to-b from-transparent to-black/20">
        <h3 className="text-3xl font-black mb-4 tracking-tighter text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 line-clamp-3 italic">
          &ldquo;{description}&rdquo;
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">View Project</span>
          <div className="w-10 h-1px bg-white/10 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
