'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

import Image from 'next/image';

import { useContent } from '@/context/ContentContext';

const Hero = () => {
  const { content } = useContent();
  const { name, title, subtitle, description, ctaPrimary, ctaSecondary, profileImage } = content.hero;

  const subtitleMain = subtitle ? subtitle.split(' ').slice(0, -1).join(' ') : 'Full Stack';
  const subtitleAccent = subtitle ? subtitle.split(' ').slice(-1) : 'Developer';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden px-6 bg-gradient-mesh">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
            className="mb-10 relative inline-block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-white/10 p-1 bg-card/50 backdrop-blur-md overflow-hidden group transition-all duration-500 shadow-2xl">
              <Image
                src={profileImage}
                alt={name || 'Profile'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <span className="px-6 py-2 rounded-full glass text-primary border border-primary/20 text-xs font-bold tracking-widest uppercase">
            {title || 'Portfolio'}
          </span>
          <p className="text-xl md:text-3xl font-semibold text-white/90">
            Hi, I&apos;m <span className="text-primary font-bold">{name || 'Developer'}</span>
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-white"
        >
          {subtitleMain} <br />
          <span className="text-gradient-primary">
            {subtitleAccent}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {ctaPrimary && (
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={ctaPrimary.href}
                className="group px-10 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-3 shadow-2xl shadow-primary/40"
              >
                {ctaPrimary.text}
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
            <a
              href="/cv.pdf"
              download
              className="group px-10 py-5 glass text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3"
            >
              Download CV
              <Download size={20} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-secondary uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-[2px] h-10 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
