import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import FollowMeHeader from './components/FollowMeHeader';
import FollowMeForm from './components/FollowMeForm';

export const dynamic = 'force-dynamic';

export default async function FollowMeSettings() {
  const content = await getInitialContent();
  
  let initialData = {
    title: 'Follow Me',
    socials: [] as any[]
  };

  if (content.socials_section) {
    // Ensure enabled property exists for all socials
    const normalizedSocials = content.socials_section.socials.map((s: any) => ({
      ...s,
      enabled: s.enabled !== undefined ? s.enabled : true
    }));
    initialData = { ...content.socials_section, socials: normalizedSocials };
  } else if (content.socials) {
    const normalizedSocials = content.socials.map((s: any) => ({
      ...s,
      enabled: true
    }));
    initialData = { title: 'Follow Me', socials: normalizedSocials };
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <FollowMeHeader />
      <FollowMeForm initialData={initialData} />
    </div>
  );
}
