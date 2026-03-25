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
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden glass glass-hover flex flex-col h-full"
    >
      {/* Image Container */}
      <Link href={live} target="_blank" className="relative h-64 overflow-hidden block">
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
          <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
            <div className="p-4 rounded-full bg-primary text-primary-foreground transition-all shadow-lg shadow-primary/25">
              <ExternalLink size={24} />
            </div>
          </motion.div>
        </motion.div>
      </Link>

      {/* Content Container */}
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {tag}
            </motion.span>
          ))}
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
