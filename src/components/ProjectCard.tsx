'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';

export interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  live: string;
  github: string;
}

const ProjectCard = ({ title, description, image, tags, live, github }: ProjectProps) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500 hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-md flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6 backdrop-blur-[2px]"
        >
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
            <Link
              href={github}
              target="_blank"
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <Github size={24} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
            <Link
              href={live}
              target="_blank"
              className="p-4 rounded-full bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/25"
            >
              <ExternalLink size={24} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20"
            >
              {tag}
            </motion.span>
          ))}
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
