import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import SocialsHeader from './components/SocialsHeader';
import SocialsForm from './components/SocialsForm';

export const dynamic = 'force-dynamic';

export default async function FooterSettings() {
  const content = await getInitialContent();
  
  const initialData = {
    text: content.footer?.text || '',
    copyright: content.footer?.copyright || '',
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <SocialsHeader />
      <SocialsForm initialData={initialData} />
    </div>
  );
}
