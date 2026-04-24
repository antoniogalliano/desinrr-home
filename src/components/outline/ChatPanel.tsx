'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { slidePanelVariants } from '@/lib/animations';
import { useFlowStore } from '@/stores/flowStore';
import { ChatMessage } from '@/components/chat/ChatMessage';

interface ChatPanelProps {
  show: boolean;
  onClose: () => void;
}

export function ChatPanel({ show, onClose }: ChatPanelProps) {
  const messages = useFlowStore((s) => s.messages);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 z-40"
          />

          {/* Panel */}
          <motion.div
            variants={slidePanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 h-full w-96 bg-white border-r border-border shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text-primary">Chat History</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages
                .filter((m) => m.type === 'text' || m.type === 'structured')
                .map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
