'use client';

import { useEffect } from 'react';

export default function BrandingManager({ initialBranding }: { initialBranding?: any }) {
  useEffect(() => {
    const applyBranding = (data: any) => {
      const { heading, logo } = data;
      
      // Update document title
      if (heading) {
        document.title = heading;
      }
      
      // Update favicon dynamically
      const updateIcons = (url: string) => {
        // Remove any existing favicons to avoid conflicts with Vercel/Next defaults
        const existingIcons = document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]');
        existingIcons.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });

        // Add primary favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
        document.head.appendChild(favicon);

        // Add shortcut icon for older browsers
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = url;
        document.head.appendChild(shortcutIcon);

        // Add apple touch icon
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = url;
        document.head.appendChild(appleIcon);
      };
      
      if (logo) {
        updateIcons(logo);
      } else {
        updateIcons('/api/branding/favicon');
      }
    };

    if (initialBranding) {
      applyBranding(initialBranding);
    }

    const fetchBranding = async () => {
      try {
        const res = await fetch('/api/content?section=branding', { cache: 'no-store' });
        if (res.ok) {
          const result = await res.json();
          if (result && result.data) {
            applyBranding(result.data);
          }
        }
      } catch (err) {
        console.error('Branding manager fetch failed:', err);
      }
    };

    fetchBranding();
  }, [initialBranding]);

  return null;
}
