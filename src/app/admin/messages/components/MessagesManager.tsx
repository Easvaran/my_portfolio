'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import MessagesList from './MessagesList';
import MessageModal from './MessageModal';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface MessagesManagerProps {
  initialMessages: Message[];
}

const MessagesManager = ({ initialMessages }: MessagesManagerProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const password = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  const handleDelete = async () => {
    if (!messageToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/contact/${messageToDelete}?password=${password}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== messageToDelete));
        setShowDeleteModal(false);
        setMessageToDelete(null);
      } else {
        alert('Failed to delete message.');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('An error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (msg: Message) => {
    setEditingMessage(msg);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleUpdateSuccess = (updated: Message) => {
    setMessages(prev => prev.map(m => m._id === updated._id ? updated : m));
  };

  return (
    <>
      <MessagesList 
        messages={messages} 
        onEdit={handleEdit} 
        onDelete={confirmDelete} 
      />

      <MessageModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        message={editingMessage} 
        onSuccess={handleUpdateSuccess} 
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div key="delete-modal-container" className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              key="delete-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              key="delete-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Are you sure?</h2>
              <p className="text-muted-foreground text-sm font-medium mb-8">This action cannot be undone. This message will be permanently deleted.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(MessagesManager);
