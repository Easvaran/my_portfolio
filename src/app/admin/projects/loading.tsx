import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 animate-pulse">
      <div className="mb-8 w-32 h-10 bg-white/5 rounded-xl border border-white/10" />
      
      <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <div className="w-48 h-8 bg-white/10 rounded-lg" />
          <div className="w-64 h-4 bg-white/5 rounded-md" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Section Metadata Skeleton */}
        <div className="p-8 rounded-[40px] bg-card border border-white/10 h-64" />
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[400px] rounded-[40px] bg-card border border-white/10" />
          <div className="h-[400px] rounded-[40px] bg-card border border-white/10" />
        </div>
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <Loader2 className="animate-spin text-primary opacity-20" size={48} />
      </div>
    </div>
  );
}
