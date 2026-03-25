'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface SkillCategoriesProps {
  control: any;
  register: any;
}

const SkillCategories = ({ control, register }: SkillCategoriesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories"
  });

  return (
    <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Skill Categories</h2>
        <button 
          type="button" 
          onClick={() => append({ title: 'New Category', icon: 'Code', skills: [] })} 
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>
      
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group">
            <button 
              type="button" 
              onClick={() => remove(index)} 
              className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Category Name</label>
                <input 
                  type="text" 
                  {...register(`categories.${index}.title`)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Icon (Lucide Name)</label>
                <input 
                  type="text" 
                  {...register(`categories.${index}.icon`)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-primary/50 transition-all" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Skills (Comma separated)</label>
              <textarea 
                rows={2} 
                {...register(`categories.${index}.skills_raw`)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white leading-relaxed outline-none focus:border-primary/50 transition-all" 
                placeholder="React, Next.js, TypeScript..." 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SkillCategories);
