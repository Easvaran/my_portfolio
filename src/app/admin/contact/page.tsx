import React from 'react';
import { getInitialContent } from '@/lib/data-fetchers';
import PageHeader from './components/PageHeader';
import ContactForm from './components/ContactForm';

// Use standard Next.js dynamic export for route
export const dynamic = 'force-dynamic';

export default async function ContactSettings() {
  // 1. Fetch data on server-side
  const content = await getInitialContent();
  
  // 2. Prepare initial data (merge with defaults)
  const initialData = content.contact || {
    title: 'Get In Touch',
    subtitle: "Have a project in mind or just want to say hello? I'd love to hear from you.",
    details: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
    info: [
      { icon: 'Mail', label: 'Email', value: 'contact@example.com', href: 'mailto:contact@example.com' },
      { icon: 'Phone', label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
      { icon: 'MapPin', label: 'Location', value: 'San Francisco, CA', href: '#' },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      {/* 3. Render Page Header (Server Component) */}
      <PageHeader />

      {/* 4. Render Optimized Contact Form (Client Component) */}
      <ContactForm initialData={initialData} />
    </div>
  );
}
