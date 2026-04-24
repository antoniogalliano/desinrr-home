'use client';

import { motion } from 'framer-motion';
import { staggerContainer, cardVariants } from '@/lib/animations';
import type { ExampleCard } from '@/lib/types';

interface ExampleCardsProps {
  cards: ExampleCard[];
  onCardClick: (text: string) => void;
}

export function ExampleCards({ cards, onCardClick }: ExampleCardsProps) {
  if (!cards.length) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex gap-2 mb-4 px-4 max-w-2xl mx-auto"
    >
      {cards.map((card) => (
        <motion.button
          key={card.id}
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            borderColor: 'rgba(139, 92, 246, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCardClick(card.text)}
          className="text-left bg-surface border border-border rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-white flex-1"
        >
          <span className="inline-block text-[10px] font-medium text-accent-purple bg-accent-lighter rounded-full px-2 py-0.5 mb-1.5">
            {card.label}
          </span>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
            {card.text}
          </p>
        </motion.button>
      ))}
    </motion.div>
  );
}
