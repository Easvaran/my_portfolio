import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import AboutHeader from './components/AboutHeader';
import AboutForm from './components/AboutForm';

export const dynamic = 'force-dynamic';

export default async function AboutSettings() {
  const content = await getInitialContent();
  
  const initialData = {
    title: content.about?.title || '',
    subtitle: content.about?.subtitle || '',
    details: content.about?.details || '',
    stats: Array.isArray(content.about?.stats) ? content.about.stats : [],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <AboutHeader />
      <AboutForm initialData={initialData} />
    </div>
  );
}
