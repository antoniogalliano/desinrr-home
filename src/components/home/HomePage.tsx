'use client';

import { motion } from 'framer-motion';
import Logo from './Logo';
import HomeWordgenieInput from './WordgenieInput';
import ImportCards from './ImportCards';
import RecentProjects from './RecentProjects';
import { SideMenuIcon } from '../sidebar/AppSidebar';
import { Tooltip } from '../ui/Tooltip';
import { useFlowStore } from '@/stores/flowStore';

export default function HomePage() {
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFlowStore((s) => s.setSidebarOpen);

  return (
    <div className="h-full overflow-y-auto">
      <div className="app-gradient-bg flex min-h-full flex-col">
        {/* Menu button — top left */}
        <div className="absolute top-4 left-5 z-20">
          <Tooltip label={sidebarOpen ? 'Close sidebar menu' : 'Show sidebar menu'} position="right">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-lg hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              <SideMenuIcon active={sidebarOpen} />
            </button>
          </Tooltip>
        </div>

        {/* Hero section */}
        <main className="relative z-10 flex flex-1 flex-col">
          <div className="flex flex-col items-center px-4 pt-[100px]">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo />
            </motion.div>

            {/* Title — Nunito Sans 60px Semi Bold */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-center text-[60px] font-semibold leading-[68px] tracking-[-1.8px] text-text-primary"
              style={{ fontFamily: "'Nunito Sans', var(--font-nunito-sans), sans-serif" }}
            >
              Start creating your book
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-[372px] text-center text-base leading-5 text-text-muted"
            >
              Choose how you want to create your manuscript.
              You can turn it into any book format later.
            </motion.p>

            {/* Wordgenie input + Import options — wrapped in one 833px container with 32px gap like Figma */}
            <div className="mt-[64px] flex w-full max-w-[833px] flex-col items-center" style={{ gap: 32 }}>
              <HomeWordgenieInput />
              <ImportCards />
            </div>
          </div>

          {/* Recent projects */}
          <div className="mt-20">
            <RecentProjects />
          </div>
        </main>
      </div>
    </div>
  );
}
