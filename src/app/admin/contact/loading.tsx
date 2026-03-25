import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-pulse">
      {/* Skeleton for Header */}
      <div className="mb-8 w-32 h-10 bg-white/5 rounded-xl border border-white/10" />
      
      <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <div className="w-48 h-8 bg-white/10 rounded-lg" />
          <div className="w-64 h-4 bg-white/5 rounded-md" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Skeleton for Form Card */}
        <div className="p-8 rounded-[40px] bg-card border border-white/10 space-y-6">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-white/10 rounded ml-1" />
            <div className="w-full h-14 bg-white/5 rounded-2xl border border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-3 bg-white/10 rounded ml-1" />
            <div className="w-full h-14 bg-white/5 rounded-2xl border border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="w-32 h-3 bg-white/10 rounded ml-1" />
            <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/10" />
          </div>
        </div>

        {/* Skeleton for Methods Card */}
        <div className="p-8 rounded-[40px] bg-card border border-white/10 h-64" />
        
        {/* Skeleton for Button */}
        <div className="w-full h-16 bg-white/10 rounded-2xl" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <Loader2 className="animate-spin text-primary opacity-20" size={48} />
      </div>
    </div>
  );
}
