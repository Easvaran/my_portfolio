import React from 'react';
import { getInitialMessages } from '@/lib/data-fetchers';
import MessagesHeader from './components/MessagesHeader';
import MessagesManager from './components/MessagesManager';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await getInitialMessages();

  return (
    <div className="p-6 md:p-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <MessagesHeader />
        <MessagesManager initialMessages={messages} />
      </div>
    </div>
  );
}
