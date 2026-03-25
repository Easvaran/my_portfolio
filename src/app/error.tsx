'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full p-10 rounded-[48px] bg-card border border-white/10 shadow-2xl text-center space-y-8"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto shadow-inner">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Something went wrong</h1>
          <p className="text-muted-foreground font-medium leading-relaxed">
            We encountered a critical error while rendering this page. This has been logged and we're looking into it.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-400 break-all">{error.message}</p>
            {error.stack && (
              <pre className="text-[10px] font-mono text-muted-foreground mt-2 opacity-50">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 py-4 px-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
