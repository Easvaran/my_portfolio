'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import SimpleIconUpload from '@/components/SimpleIconUpload';

interface AboutStatsProps {
  control: any;
  register: any;
  setValue: any;
  watch: any;
}

const AboutStats = ({ control, register, setValue, watch }: AboutStatsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stats"
  });

  const stats = watch('stats');

  return (
    <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Experience Stats</h2>
        <button 
          type="button" 
          onClick={() => append({ label: 'New Stat', value: '0', icon: 'Activity' })} 
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
        >
          <Plus size={14} /> Add Stat
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <div key={field.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 relative group">
              <button 
                type="button" 
                onClick={() => remove(index)} 
                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Label</label>
                  <input 
                    type="text" 
                    {...register(`stats.${index}.label`)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value</label>
                  <input 
                    type="text" 
                    {...register(`stats.${index}.value`)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-primary/50 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Icon Image</label>
                <SimpleIconUpload 
                  value={stats[index]?.icon || ''} 
                  onChange={value => setValue(`stats.${index}.icon`, value)} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-muted-foreground font-medium">No experience stats yet.</p>
            <p className="text-sm text-muted-foreground/70">Click "Add Stat" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AboutStats);
