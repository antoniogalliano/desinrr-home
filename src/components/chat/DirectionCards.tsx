'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import type { BookDirection } from '@/lib/types';

interface DirectionCardsProps {
  directions: BookDirection[];
  onSelect: (direction: BookDirection) => void;
  onMoreIdeas: () => void;
}

export function DirectionCards({ directions, onSelect, onMoreIdeas }: DirectionCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleToggle = useCallback((direction: BookDirection) => {
    const isExpanded = expandedId === direction.id;
    setExpandedId(isExpanded ? null : direction.id);

    if (!isExpanded) {
      // Wait for expand animation to finish, then scroll the card to the top
      setTimeout(() => {
        cardRefs.current[direction.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 280);
    }
  }, [expandedId]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-5">
      {/* Direction list card */}
      <div
        className="bg-white border border-[#E0E5EB] overflow-hidden mb-6"
        style={{
          borderRadius: 12,
          boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {directions.map((direction, index) => {
          const isExpanded = expandedId === direction.id;

          return (
            <motion.div
              key={direction.id}
              ref={(el) => { cardRefs.current[direction.id] = el; }}
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.25, delay: index * 0.06 },
                },
              }}
              className={index < directions.length - 1 ? 'border-b border-[#E0E5EB]' : ''}
            >
              {/* Card header — clickable to expand/collapse */}
              <button
                onClick={() => handleToggle(direction)}
                className="flex items-center cursor-pointer transition-colors w-full text-left"
                style={{
                  padding: 16,
                  gap: 16,
                  background: isExpanded ? '#FAFAFA' : 'transparent',
                  minHeight: 70,
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = '#FAFAFA';
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Number badge — rounded square */}
                <span
                  className="flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    fontFamily: 'var(--font-nunito-sans)',
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: '16px',
                    ...(isExpanded
                      ? {
                          background: 'linear-gradient(135deg, #006EFE 0%, #5326BD 100%)',
                          color: '#FFFFFF',
                        }
                      : {
                          background: 'transparent',
                          color: '#8596AD',
                          border: '1.5px solid #C2CBD6',
                        }),
                  }}
                >
                  {index + 1}
                </span>

                {/* Title + subtitle */}
                <div className="flex-1 min-w-0">
                  <span
                    className="block"
                    style={{
                      fontFamily: 'var(--font-nunito-sans)',
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: '20px',
                      ...(isExpanded
                        ? {
                            background: 'linear-gradient(135deg, #006EFE 0%, #5326BD 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }
                        : { color: '#15191F' }),
                    }}
                  >
                    {direction.title}
                  </span>
                  <span
                    className="block"
                    style={{
                      fontFamily: 'var(--font-nunito-sans)',
                      fontSize: 12,
                      fontWeight: 400,
                      lineHeight: '16px',
                      color: '#667C98',
                      marginTop: 4,
                    }}
                  >
                    {direction.subtitle}
                  </span>
                </div>

                {/* Chevron */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                >
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="#8596AD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Expanded detail section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div style={{ padding: '0 16px 16px 16px' }}>
                      {/* Divider */}
                      <div
                        style={{
                          borderTop: '1px solid #E0E5EB',
                          marginBottom: 16,
                        }}
                      />

                      {/* Detail rows — table layout with fixed-width labels */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}
                      >
                        {direction.bestFor && (
                          <div className="flex" style={{ gap: 8 }}>
                            <span
                              className="flex-shrink-0"
                              style={{
                                width: 80,
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: '16px',
                                color: '#52637A',
                              }}
                            >
                              Best for:
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: '16px',
                                color: '#667C98',
                              }}
                            >
                              {direction.bestFor}
                            </span>
                          </div>
                        )}
                        {direction.vibe && (
                          <div className="flex" style={{ gap: 8 }}>
                            <span
                              className="flex-shrink-0"
                              style={{
                                width: 80,
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: '16px',
                                color: '#52637A',
                              }}
                            >
                              Vibe:
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: '16px',
                                color: '#667C98',
                              }}
                            >
                              {direction.vibe}
                            </span>
                          </div>
                        )}
                        {direction.whyThisWorks && (
                          <div className="flex" style={{ gap: 8 }}>
                            <span
                              className="flex-shrink-0"
                              style={{
                                width: 80,
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: '16px',
                                color: '#52637A',
                              }}
                            >
                              Why it works:
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-nunito-sans)',
                                fontSize: 12,
                                fontWeight: 400,
                                lineHeight: '16px',
                                color: '#667C98',
                              }}
                            >
                              {direction.whyThisWorks}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Choose this direction button */}
                      <div className="flex justify-end" style={{ marginTop: 16 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(direction);
                          }}
                          className="cursor-pointer transition-opacity hover:opacity-90"
                          style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            fontFamily: 'var(--font-nunito-sans)',
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: '18px',
                            color: '#FFFFFF',
                            background: 'linear-gradient(135deg, #006EFE 0%, #5326BD 100%)',
                            boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)',
                            border: 'none',
                          }}
                        >
                          Choose this direction
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Give me more ideas */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4 } } }}
        className="flex items-center justify-center gap-3"
      >
        <span className="text-[14px] text-text-tertiary">None of these feel right?</span>
        <button
          onClick={onMoreIdeas}
          className="text-[14px] text-text-primary font-medium border border-[#E0E5EB] rounded-full px-5 py-2 hover:bg-[#F6F7F9] transition-colors cursor-pointer"
        >
          Give me more ideas
        </button>
      </motion.div>
    </motion.div>
  );
}
