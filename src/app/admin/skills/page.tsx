import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import SkillsHeader from './components/SkillsHeader';
import SkillsForm from './components/SkillsForm';

export const dynamic = 'force-dynamic';

export default async function SkillsSettings() {
  const content = await getInitialContent();
  
  const initialData = {
    title: content.skills?.title || '',
    subtitle: content.skills?.subtitle || '',
    categories: Array.isArray(content.skills?.categories) ? content.skills.categories : [],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <SkillsHeader />
      <SkillsForm initialData={initialData} />
    </div>
  );
}
