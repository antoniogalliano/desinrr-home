'use client';

import { motion } from 'framer-motion';
import { useFlowStore } from '@/stores/flowStore';
import { SideMenuIcon } from '../sidebar/AppSidebar';
import { Tooltip } from '../ui/Tooltip';

interface OutlineHeaderProps {
  onGenerateBook: () => void;
}

export function OutlineHeader({ onGenerateBook }: OutlineHeaderProps) {
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFlowStore((s) => s.setSidebarOpen);

  return (
    <div className="flex-shrink-0 bg-white border-b border-border-light">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Menu icon + divider */}
        <div className="flex items-center gap-2" style={{ minWidth: 180 }}>
          <Tooltip label={sidebarOpen ? 'Close sidebar menu' : 'Show sidebar menu'} position="right">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-lg hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              <SideMenuIcon active={sidebarOpen} />
            </button>
          </Tooltip>
        </div>

        {/* Center: Book Outline title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1 text-center"
        >
          <h1 className="text-[20px] font-semibold leading-[24px] gradient-text">Book Outline</h1>
        </motion.div>

        {/* Right: Counter + Generate Manuscript button */}
        <div className="flex items-center justify-end gap-3" style={{ minWidth: 180 }}>
          {/* Generation counter with tooltip */}
          <div className="relative group">
            <span className="text-[13px] font-semibold text-text-tertiary cursor-default whitespace-nowrap">
              10 / 10 left
            </span>
            {/* Hover tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
              <div className="relative bg-[#1A1F26] text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {/* Arrow pointing up */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-[#1A1F26] rotate-45" />
                Manuscript Generations &bull; Renews Jan 2027
              </div>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGenerateBook}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent text-accent text-[14px] font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Generate Manuscript
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
