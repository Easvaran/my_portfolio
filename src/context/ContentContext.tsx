'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioConfig } from '@/config/portfolio';

interface ContentContextType {
  content: Record<string, any>;
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ 
  children,
  initialContent = portfolioConfig
}: { 
  children: React.ReactNode;
  initialContent?: Record<string, any>;
}) => {
  const [content, setContent] = useState<Record<string, any>>(initialContent);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const data = await res.json();
      if (data && !data.error) {
        // Merge with static config to ensure no missing fields
        setContent({
          ...portfolioConfig,
          ...data
        });
      }
    } catch (err) {
      console.error('Failed to fetch site content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We already have initial content from the server, 
    // but we can refresh it to ensure it's up-to-date
    // if we want to handle dynamic updates without a page refresh
    // fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
