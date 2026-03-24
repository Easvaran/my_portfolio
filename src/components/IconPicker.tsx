'use client';

import { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, X } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const iconNames = useMemo(() => Object.keys(Icons).filter(name => 
    !['createReactComponent', 'LucideProps', 'LucideIcon'].includes(name) // Add any icons to exclude here
  ), []);

  const filteredIcons = useMemo(() => 
    iconNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [iconNames, searchTerm]
  );

  const isUrl = value && (value.startsWith('http') || value.startsWith('/'));
  const CurrentIcon = !isUrl && (Icons as any)[value] ? (Icons as any)[value] : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Icon upload failed:', error);
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
      >
        {isUrl ? (
          <img src={value} alt="Custom Icon" className="w-5 h-5" />
        ) : CurrentIcon ? (
          <CurrentIcon size={18} className="text-primary" />
        ) : (
          <Icons.HelpCircle size={18} className="text-muted-foreground" />
        )}
        <span className="text-xs truncate">{value}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 w-72 bg-card border border-white/10 rounded-2xl shadow-2xl z-50 p-4"
          >
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto grid grid-cols-5 gap-2 pr-2">
              {filteredIcons.map(name => {
                const Icon = (Icons as any)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { onChange(name); setIsOpen(false); }}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${value === name ? 'bg-primary text-white' : 'hover:bg-white/10'}`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground cursor-pointer transition-colors">
                <Upload size={14} />
                Upload Custom Icon
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-white">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
