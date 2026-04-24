'use client';

import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, onClick, className = '', hoverable = true }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={
        hoverable
          ? {
              scale: 1.01,
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
            }
          : {}
      }
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={`
        bg-surface border border-border rounded-2xl p-5
        transition-colors duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
