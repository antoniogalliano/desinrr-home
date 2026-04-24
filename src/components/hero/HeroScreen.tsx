'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroInput } from './HeroInput';
import { HeroExampleCards } from './HeroExampleCards';
import { SideMenuIcon } from '../sidebar/AppSidebar';
import { Tooltip } from '../ui/Tooltip';
import { useFlowStore } from '@/stores/flowStore';
import { HERO_SUBTITLE, HERO_PLACEHOLDER, HERO_FALLBACK, HERO_EXAMPLE_CARDS } from '@/lib/mockResponses';

interface HeroScreenProps {
  onSubmit: (text: string) => void;
}

export function HeroScreen({ onSubmit }: HeroScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFlowStore((s) => s.setSidebarOpen);

  return (
    <div className="h-full flex flex-col app-gradient-bg overflow-hidden">
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

      {/* Centered content area */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto relative z-10">
      <div className="w-full max-w-[700px] mx-auto flex flex-col items-center py-8">
        {/* Logo — 60px, semibold, gradient text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex flex-col items-center"
        >
          <svg width="66" height="26" viewBox="0 0 66 26" fill="none" className="mb-2">
            <rect width="66" height="26" rx="13" fill="url(#paint0_new_tag)"/>
            <g clipPath="url(#clip0_new_tag)">
              <path d="M19 7.75L17.8847 11.1409C17.8276 11.3145 17.7305 11.4722 17.6014 11.6014C17.4722 11.7305 17.3145 11.8276 17.1409 11.8847L13.75 13L17.1409 14.1153C17.3145 14.1724 17.4722 14.2695 17.6014 14.3986C17.7305 14.5278 17.8276 14.6855 17.8847 14.8591L19 18.25L20.1153 14.8591C20.1724 14.6855 20.2695 14.5278 20.3986 14.3986C20.5278 14.2695 20.6855 14.1724 20.8591 14.1153L24.25 13L20.8591 11.8847C20.6855 11.8276 20.5278 11.7305 20.3986 11.6014C20.2695 11.4722 20.1724 11.3145 20.1153 11.1409L19 7.75Z" fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.625 6.875L14.2532 8.00531C14.2342 8.06315 14.2018 8.11573 14.1588 8.15879C14.1157 8.20185 14.0632 8.2342 14.0053 8.25322L12.875 8.625L14.0053 8.99678C14.0632 9.0158 14.1157 9.04815 14.1588 9.09121C14.2018 9.13427 14.2342 9.18685 14.2532 9.24469L14.625 10.375L14.9968 9.24469C15.0158 9.18685 15.0482 9.13427 15.0912 9.09121C15.1343 9.04815 15.1868 9.0158 15.2447 8.99678L16.375 8.625L15.2447 8.25322C15.1868 8.2342 15.1343 8.20185 15.0912 8.15879C15.0482 8.11573 15.0158 8.06315 14.9968 8.00531L14.625 6.875Z" fill="white" stroke="white" strokeWidth="0.375" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23.375 15.625L23.0032 16.7553C22.9842 16.8132 22.9518 16.8657 22.9088 16.9088C22.8657 16.9518 22.8132 16.9842 22.7553 17.0032L21.625 17.375L22.7553 17.7468C22.8132 17.7658 22.8657 17.7982 22.9088 17.8412C22.9518 17.8843 22.9842 17.9368 23.0032 17.9947L23.375 19.125L23.7468 17.9947C23.7658 17.9368 23.7982 17.8843 23.8412 17.8412C23.8843 17.7982 23.9368 17.7658 23.9947 17.7468L25.125 17.375L23.9947 17.0032C23.9368 16.9842 23.8843 16.9518 23.8412 16.9088C23.7982 16.8657 23.7658 16.8132 23.7468 16.7553L23.375 15.625Z" fill="white" stroke="white" strokeWidth="0.375" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <path d="M36.669 9.22727V16.5H35.6605L31.9638 11.1662H31.8963V16.5H30.799V9.22727H31.8146L35.5149 14.5682H35.5824V9.22727L36.669 9.22727ZM38.2697 16.5V9.22727H42.8294V10.1719H39.367V12.3878H42.5914V13.3288H39.367V15.5554H42.872V16.5H38.2697ZM45.7191 16.5L43.7021 9.22727H44.8562L46.2731 14.8594H46.3406L47.8143 9.22727H48.9577L50.4315 14.8629H50.4989L51.9123 9.22727H53.07L51.0494 16.5H49.945L48.4144 11.0526H48.3576L46.8271 16.5H45.7191Z" fill="white"/>
            <defs>
              <linearGradient id="paint0_new_tag" x1="67.0625" y1="-1.31359" x2="0.148597" y2="31.3975" gradientUnits="userSpaceOnUse">
                <stop stopColor="#006EFE"/>
                <stop offset="1" stopColor="#5326BD"/>
              </linearGradient>
              <clipPath id="clip0_new_tag">
                <rect width="14" height="14" fill="white" transform="translate(12 6)"/>
              </clipPath>
            </defs>
          </svg>
          <h1 className="text-[60px] leading-[68px] font-semibold gradient-text">
            Start creating your book
          </h1>
        </motion.div>

        {/* Subtitle — 16px, #29323D */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-text-secondary text-center text-base leading-5 mb-10 max-w-[532px]"
        >
          {HERO_SUBTITLE}
        </motion.p>

        {/* Input bar */}
        <HeroInput placeholder={HERO_PLACEHOLDER} onSubmit={onSubmit} value={inputValue} onChange={setInputValue} />

        {/* Fallback text — 14px, #52637A */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-text-muted text-sm mt-10 mb-6 text-center"
        >
          {HERO_FALLBACK}
        </motion.p>

        {/* Example cards */}
        <HeroExampleCards cards={HERO_EXAMPLE_CARDS} onCardClick={setInputValue} />

      </div>
      </div>
    </div>
  );
}
