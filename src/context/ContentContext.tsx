'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioConfig } from '@/config/portfolio';

interface ContentContextType {
  content: any;
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<any>(portfolioConfig);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
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
    fetchContent();
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
