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
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative inline-block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/20 p-2 bg-background/50 backdrop-blur-sm overflow-hidden group">
              <Image
                src={profileImage}
                alt={name || 'Profile'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <span className="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black tracking-[0.2em] uppercase">
            {title || 'Portfolio'}
          </span>
          <p className="text-xl md:text-2xl font-bold text-white/90 tracking-tight">Hi, I&apos;m {name || 'Developer'}</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85]"
        >
          {subtitleMain} <br />
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-blue-500 bg-clip-text text-transparent">
            {subtitleAccent}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {ctaPrimary && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={ctaPrimary.href}
                className="group px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                {ctaPrimary.text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="/cv.pdf"
              download
              className="group px-8 py-4 bg-white/5 text-foreground font-bold rounded-xl hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              Download CV
              <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
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
