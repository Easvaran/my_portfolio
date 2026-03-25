'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we already have auth in localStorage for initial mount
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth && pathname !== '/admin/login') {
      // We can tentatively set authorized to true while we verify in the background
      // to avoid the flash of loader
      setAuthorized(true);
      setLoading(false);
    } else if (!storedAuth && pathname !== '/admin/login') {
      router.push('/admin/login');
      setLoading(false);
      return;
    } else if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const password = localStorage.getItem('admin_auth');

      try {
        const res = await fetch('/api/admin/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        
        if (!res.ok) {
          localStorage.removeItem('admin_auth');
          setAuthorized(false);
          router.push('/admin/login');
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        localStorage.removeItem('admin_auth');
        setAuthorized(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-grow transition-all duration-300 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
