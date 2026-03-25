import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import HomeHeader from './components/HomeHeader';
import HomeForm from './components/HomeForm';

export const dynamic = 'force-dynamic';

export default async function HomeSettings() {
  const content = await getInitialContent();
  
  const initialData = {
    name: content.hero?.name || '',
    title: content.hero?.title || '',
    subtitle: content.hero?.subtitle || '',
    description: content.hero?.description || '',
    ctaPrimaryText: content.hero?.ctaPrimary?.text || '',
    ctaPrimaryHref: content.hero?.ctaPrimary?.href || '',
    ctaSecondaryText: content.hero?.ctaSecondary?.text || '',
    ctaSecondaryHref: content.hero?.ctaSecondary?.href || '',
    profileImage: content.hero?.profileImage || ''
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <HomeHeader />
      <HomeForm initialData={initialData} />
    </div>
  );
}
