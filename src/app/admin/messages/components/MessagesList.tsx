'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Calendar } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface MessagesListProps {
  messages: Message[];
  onEdit: (msg: Message) => void;
  onDelete: (id: string) => void;
}

const MessagesList = ({ messages, onEdit, onDelete }: MessagesListProps) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-32 bg-card/20 rounded-[64px] border border-dashed border-white/10 mt-12 shadow-inner">
        <h2 className="text-3xl font-black text-white mb-3">Inbox Zero!</h2>
        <p className="text-muted-foreground mt-2 font-medium">No new messages at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg, index) => (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="p-8 rounded-[32px] bg-card border border-white/10 shadow-lg shadow-black/20 group relative"
        >
          <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(msg)}
              className="p-2.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/10 transition-all"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onDelete(msg._id)}
              className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl border border-white/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white truncate max-w-[200px]">{msg.name}</h3>
                <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline truncate block max-w-[250px]">{msg.email}</a>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 md:pr-20">
              <Calendar size={14} />
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
          <p className="text-secondary leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap">
            {msg.message}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(MessagesList);
