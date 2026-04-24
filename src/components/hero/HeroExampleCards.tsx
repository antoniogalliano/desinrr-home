'use client';

import { motion } from 'framer-motion';
import { staggerContainer, cardVariants } from '@/lib/animations';
import type { ExampleCard } from '@/lib/types';

interface HeroExampleCardsProps {
  cards: ExampleCard[];
  onCardClick: (text: string) => void;
}

export function HeroExampleCards({ cards, onCardClick }: HeroExampleCardsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[689px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {cards.map((card) => (
        <motion.button
          key={card.id}
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: '0px 4px 40px rgba(143, 132, 171, 0.18)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCardClick(card.text)}
          className="text-left rounded-[30px] px-5 py-4 cursor-pointer transition-colors duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.26)',
            border: '2px solid #FFFFFF',
            boxShadow: '0px 2px 32px rgba(143, 132, 171, 0.12)',
          }}
        >
          {/* Card text — 14px, #8596AD */}
          <p className="text-sm leading-[18px] text-text-tertiary">
            {card.text}
          </p>
        </motion.button>
      ))}
    </motion.div>
  );
}
