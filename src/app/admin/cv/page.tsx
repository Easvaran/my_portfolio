import React from 'react';
import { getInitialCV } from '@/lib/data-fetchers';
import CVHeader from './components/CVHeader';
import CVUploadForm from './components/CVUploadForm';

export const dynamic = 'force-dynamic';

export default async function CVPicker() {
  const initialCV = await getInitialCV();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <CVHeader />
      <CVUploadForm initialCV={initialCV} />
    </div>
  );
}
