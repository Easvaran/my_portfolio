import React from 'react';
import Link from 'next/link';
import { Upload, ArrowLeft } from 'lucide-react';

const CVHeader = () => {
  return (
    <>
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm font-bold group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/20">
          <Upload size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">CV Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Update your professional resume</p>
        </div>
      </div>
    </>
  );
};

export default React.memo(CVHeader);
