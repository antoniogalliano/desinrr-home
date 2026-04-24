'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MESSAGES = [
  'Reading your document…',
  'Analyzing structure…',
  'Organizing chapters…',
  'Preparing your manuscript…',
  'Almost ready…',
];

function SkeletonLine({ width, height = 14, delay = 0 }: { width: string | number; height?: number; delay?: number }) {
  return (
    <div
      className="skeleton-shimmer rounded"
      style={{ width, height, flexShrink: 0, animationDelay: `${delay}s` }}
    />
  );
}

function SkeletonBlock({ lines, widths, lineHeight = 14, gap = 10, delay = 0 }: {
  lines: number;
  widths?: (string | number)[];
  lineHeight?: number;
  gap?: number;
  delay?: number;
}) {
  const defaultWidths = ['100%', '96%', '100%', '92%', '98%', '88%', '100%', '94%'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={widths?.[i] ?? defaultWidths[i % defaultWidths.length]}
          height={lineHeight}
          delay={delay + i * 0.04}
        />
      ))}
    </div>
  );
}

export function ManuscriptSkeleton() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1 < STATUS_MESSAGES.length ? i + 1 : i));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #F0F2F5 0px,
            #E4E8ED 150px,
            #F0F2F5 300px
          );
          background-size: 600px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="h-full flex overflow-hidden relative bg-white">
        {/* Left sidebar TOC placeholder */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pl-4 pr-3 flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonLine key={i} width={24} height={3} delay={i * 0.06} />
          ))}
        </div>

        {/* Top toolbar placeholder */}
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-[#E0E5EB] bg-white"
          style={{ height: 56, padding: '0 24px' }}
        >
          <div className="flex items-center gap-3">
            <SkeletonLine width={28} height={28} />
            <SkeletonLine width={120} height={16} delay={0.05} />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonLine width={80} height={28} delay={0.08} />
            <SkeletonLine width={28} height={28} delay={0.1} />
            <SkeletonLine width={28} height={28} delay={0.12} />
          </div>
        </div>

        {/* Main scrollable area */}
        <div className="flex-1 overflow-y-auto" style={{ paddingTop: 56 }}>
          <div className="flex justify-center py-12 px-6">
            {/* Page */}
            <div
              className="w-full bg-white shadow-sm border border-[#E8EAED]"
              style={{ maxWidth: 680, borderRadius: 4, padding: '72px 80px', minHeight: 900 }}
            >
              {/* Book title block */}
              <div style={{ marginBottom: 48, textAlign: 'center' }}>
                <SkeletonLine width="60%" height={36} delay={0} />
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                  <SkeletonLine width="40%" height={20} delay={0.06} />
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                  <SkeletonLine width="28%" height={14} delay={0.1} />
                </div>
              </div>

              {/* Divider */}
              <SkeletonLine width="100%" height={1} delay={0.12} />

              {/* Chapter 1 */}
              <div style={{ marginTop: 48 }}>
                <SkeletonLine width="38%" height={24} delay={0.14} />
                <div style={{ marginTop: 24 }}>
                  <SkeletonBlock lines={5} delay={0.18} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <SkeletonBlock lines={6} widths={['100%', '94%', '100%', '97%', '89%', '100%']} delay={0.22} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <SkeletonBlock lines={4} widths={['100%', '93%', '100%', '72%']} delay={0.26} />
                </div>
              </div>

              {/* Chapter 2 */}
              <div style={{ marginTop: 56 }}>
                <SkeletonLine width="44%" height={24} delay={0.3} />
                <div style={{ marginTop: 24 }}>
                  <SkeletonBlock lines={5} widths={['100%', '97%', '91%', '100%', '84%']} delay={0.34} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <SkeletonBlock lines={3} widths={['100%', '96%', '68%']} delay={0.38} />
                </div>
              </div>

              {/* Chapter 3 */}
              <div style={{ marginTop: 56 }}>
                <SkeletonLine width="50%" height={24} delay={0.42} />
                <div style={{ marginTop: 24 }}>
                  <SkeletonBlock lines={5} delay={0.46} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status overlay — bottom center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div
            className="flex items-center gap-3 bg-white border border-[#E0E5EB] rounded-full"
            style={{
              padding: '10px 20px',
              boxShadow: '0px 4px 24px rgba(0,0,0,0.10)',
            }}
          >
            {/* Spinner */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
              <circle cx="8" cy="8" r="6" stroke="#E0E5EB" strokeWidth="2" />
              <path d="M8 2a6 6 0 0 1 6 6" stroke="url(#sk-grad)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="sk-grad" x1="14" y1="8" x2="8" y2="2" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#006EFE" />
                  <stop offset="1" stopColor="#5326BD" />
                </linearGradient>
              </defs>
            </svg>

            <AnimatePresence mode="wait">
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#3D4A5C',
                  whiteSpace: 'nowrap',
                }}
              >
                {STATUS_MESSAGES[statusIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
