'use client';

import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

const Footer = () => {
  const { content } = useContent();
  
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div>
          <Link href="#home" className="text-2xl font-bold tracking-tighter">
            PORT<span className="text-primary">FOLIO</span>
          </Link>
          <p className="mt-2 text-secondary max-w-xs">
            {content.footer.text}
          </p>
        </div>

        <div className="flex space-x-6">
          {content.socials.map((link: any, index: number) => {
            const IconComponent = (Icons as any)[link.icon] || Icons.Link;
            
            // Skip rendering if the URL is invalid or just a placeholder to prevent Next.js prefetch errors
            const isValidUrl = link.href && link.href !== 'https://' && link.href.startsWith('http');
            
            if (!isValidUrl) return null;

            return (
              <Link
                key={`${link.name}-${index}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors"
                aria-label={link.name}
              >
                <IconComponent size={24} />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-secondary">
        {content.footer.copyright}
      </div>
    </footer>
  );
};

export default Footer;
