import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10" />
          <div className="space-y-2">
            <div className="w-48 h-8 bg-white/10 rounded-lg" />
            <div className="w-64 h-4 bg-white/5 rounded-md" />
          </div>
        </div>
        <div className="w-32 h-10 bg-white/5 rounded-xl border border-white/10" />
      </div>

      <div className="space-y-8">
        <div className="p-8 rounded-[40px] bg-card border border-white/10 h-64" />
        <div className="p-8 rounded-[40px] bg-card border border-white/10 h-96" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <Loader2 className="animate-spin text-primary opacity-20" size={48} />
      </div>
    </div>
  );
}
