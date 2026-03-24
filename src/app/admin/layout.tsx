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
    const checkAuth = async () => {
      const password = localStorage.getItem('admin_auth');
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (!password || password !== adminPassword) {
        router.push('/admin/login');
        return;
      }

      setAuthorized(true);
      setLoading(false);
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
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-grow transition-all duration-300 md:ml-64">
        {children}
      </main>
    </div>
  );
}
