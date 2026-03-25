'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Globe, 
  Github, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Send, 
  Video, 
  Link as LinkIcon,
  X,
  Check
} from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

const ICON_OPTIONS = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Twitter', icon: Twitter },
  { name: 'Instagram', icon: Instagram },
  { name: 'Youtube', icon: Youtube },
  { name: 'Telegram', icon: Send },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'Vimeo', icon: Video },
  { name: 'Github', icon: Github },
  { name: 'Globe', icon: Globe },
  { name: 'Link', icon: LinkIcon },
];

interface SocialLinksGridProps {
  control: any;
  register: any;
  watch: any;
  setValue: any;
}

const SocialLinksGrid = ({ control, register, watch, setValue }: SocialLinksGridProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials"
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const socials = watch('socials');

  const toggleEnabled = (index: number) => {
    setValue(`socials.${index}.enabled`, !socials[index].enabled);
  };

  return (
    <div className="p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Social Links</h2>
        <button 
          type="button" 
          onClick={() => append({ name: 'New Link', href: 'https://', icon: 'Facebook', enabled: true })} 
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
        >
          <Plus size={14} /> Add Link
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {fields.map((field, index) => {
          const currentSocial = socials[index];
          const Icon = ICON_OPTIONS.find(opt => opt.name === currentSocial?.icon)?.icon || Globe;
          const isEditing = editingIndex === index;

          return (
            <div key={field.id} className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentSocial?.enabled 
                      ? 'bg-black border-2 border-white/10 text-white shadow-xl' 
                      : 'bg-black/40 border-2 border-red-500/20 text-muted-foreground grayscale opacity-50'
                  }`}
                >
                  <Icon size={32} strokeWidth={1.5} />
                </div>

                <div className="absolute -top-2 -right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    type="button" 
                    onClick={() => toggleEnabled(index)} 
                    className="p-1.5 rounded-full bg-white text-black hover:scale-110 transition-all shadow-lg"
                  >
                    {currentSocial?.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingIndex(index)} 
                    className="p-1.5 rounded-full bg-white text-black hover:scale-110 transition-all shadow-lg"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => remove(index)} 
                    className="p-1.5 rounded-full bg-red-500 text-white hover:scale-110 transition-all shadow-lg"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${currentSocial?.enabled ? 'text-white' : 'text-muted-foreground'}`}>
                  {currentSocial?.name || 'Untitled'}
                </p>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-md p-8 rounded-[40px] bg-card border border-white/10 shadow-2xl space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">Edit Social Link</h3>
                        <button type="button" onClick={() => setEditingIndex(null)} className="p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-all">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                          <input type="text" {...register(`socials.${index}.name`)} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL (href)</label>
                          <input type="text" {...register(`socials.${index}.href`)} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Choose Icon</label>
                          <div className="grid grid-cols-5 gap-3">
                            {ICON_OPTIONS.map((opt) => (
                              <button
                                key={opt.name}
                                type="button"
                                onClick={() => setValue(`socials.${index}.icon`, opt.name)}
                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                                  currentSocial?.icon === opt.name ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                }`}
                              >
                                <opt.icon size={20} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => setEditingIndex(null)}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Done Editing
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SocialLinksGrid);
