'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelperTooltipProps {
  text: string;
  delay?: number;
}

export function HelperTooltip({ text, delay = 3000 }: HelperTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto mb-3 px-4"
        >
          <div className="flex items-start gap-2.5 bg-accent-lighter border border-accent-light rounded-xl px-4 py-3">
            <svg
              className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-sm text-accent-purple/80 italic flex-1 leading-relaxed">
              {text}
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="text-accent-purple/50 hover:text-accent-purple transition-colors flex-shrink-0"
              aria-label="Dismiss helper"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
