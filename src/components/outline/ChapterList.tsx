'use client';

import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import { useFlowStore } from '@/stores/flowStore';
import { ChapterItem } from './ChapterItem';

export function ChapterList() {
  const outline = useFlowStore((s) => s.generatedOutline);

  if (!outline) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="py-8 px-8"
    >
      {outline.chapters.map((chapter) => (
        <ChapterItem key={chapter.id} chapter={chapter} />
      ))}
    </motion.div>
  );
}
