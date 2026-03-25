'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

import { portfolioConfig } from '@/config/portfolio';
import { useContent } from '@/context/ContentContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { content } = useContent();
  
  // Use branding from context instead of local fetch
  const branding = content.branding || {
    logo: '',
    heading: 'PORTFOLIO'
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = content.navigation || portfolioConfig.navigation;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="#home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl font-black tracking-tighter uppercase text-white">
            {(branding.heading || 'PORTFOLIO').split('').map((char: string, i: number) => (
              <span key={i} className={i >= (branding.heading || 'PORTFOLIO').length / 2 ? 'text-primary' : ''}>{char}</span>
            ))}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((link: { name: string; href: string }) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/admin"
            className="px-5 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-sm font-bold border border-primary/20"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navigation.map((link: { name: string; href: string }) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-primary border-t border-white/5 pt-4"
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
