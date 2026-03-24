'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith('/admin')) return;

    const sendHeartbeat = async () => {
      try {
        await fetch('/api/heartbeat', { method: 'POST' });
      } catch (error) {
        // Silently fail
      }
    };

    // Initial heartbeat
    sendHeartbeat();

    // Regular interval (every 30 seconds)
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
